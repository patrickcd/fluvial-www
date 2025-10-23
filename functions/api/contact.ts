// Cloudflare Pages Function: contact form handler with Turnstile verification
// Sends email via Sweego HTTP API

export interface Env {
  CONTACT_RECIPIENT: string // e.g., info@fluvialdiligence.com
  TURNSTILE_SECRET: string
  CONTACT_FROM?: string // e.g., noreply@fluvialdiligence.com
  SWEEGO_KEY?: string // Sweego API key
}

export const onRequestPost = async (context: any) => {
  try {
    const { request, env } = context
    const url = new URL(request.url)

    // Ensure content-type and parse FormData
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/x-www-form-urlencoded') && !contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: 'Unsupported content type' }), { status: 415, headers: { 'content-type': 'application/json' } })
    }

    const formData = await request.formData()
    const debugParam = url.searchParams.get('debug') || (formData.get('debug') as string | null)
    const debug = debugParam === '1' || debugParam === 'true'

    if (!env.CONTACT_RECIPIENT) {
      const msg = 'CONTACT_RECIPIENT env var is not set'
      return debug
        ? new Response(JSON.stringify({ error: msg }), { status: 500, headers: { 'content-type': 'application/json' } })
        : new Response(null, { status: 303, headers: { Location: '/thank-you?sent=0' } })
    }
    if (!env.TURNSTILE_SECRET) {
      const msg = 'TURNSTILE_SECRET env var is not set'
      return debug
        ? new Response(JSON.stringify({ error: msg }), { status: 500, headers: { 'content-type': 'application/json' } })
        : new Response(null, { status: 303, headers: { Location: '/thank-you?sent=0' } })
    }

    // Honeypot check
    const honeypot = (formData.get('website') || '').toString().trim()
    if (honeypot) {
      if (debug) {
        return new Response(JSON.stringify({ blocked: 'honeypot', value: honeypot }), { headers: { 'content-type': 'application/json' } })
      }
      return new Response(null, { status: 303, headers: { Location: '/thank-you?sent=0' } })
    }

    const name = (formData.get('name') || '').toString().trim()
    const email = (formData.get('email') || '').toString().trim()
    const company = (formData.get('company') || '').toString().trim()
    const message = (formData.get('message') || '').toString().trim()
    const turnstileToken = (formData.get('cf-turnstile-response') || '').toString()

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'content-type': 'application/json' } })
    }

    // Verify Turnstile
    const ip = request.headers.get('cf-connecting-ip') || ''
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: turnstileToken,
        remoteip: ip,
      }),
    })

    const verifyJson = await verifyRes.json()
    if (!verifyJson.success) {
      return debug
        ? new Response(JSON.stringify({ error: 'Captcha verification failed', verify: verifyJson }), { status: 400, headers: { 'content-type': 'application/json' } })
        : new Response(null, { status: 303, headers: { Location: '/thank-you?sent=0' } })
    }

    // Build message
    const subject = `New website enquiry from ${name}${company ? ' @ ' + company : ''}`
    const textBody = `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`

    const host = url.hostname.replace(/^www\./, '')
    const fromEmail = env.CONTACT_FROM || `noreply@${host}`

    // Send via Sweego HTTP API
    if (env.SWEEGO_KEY) {
      const swBody: Record<string, any> = {
        channel: 'email',
        provider: 'sweego',
        recipients: [{ email: env.CONTACT_RECIPIENT }],
        from: { name: 'Website Contact', email: fromEmail },
        subject,
        'message-txt': textBody,
      }

      const swRes = await fetch('https://api.sweego.io/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': env.SWEEGO_KEY,
        },
        body: JSON.stringify(swBody),
      })

      if (!swRes.ok) {
        const errText = await swRes.text()
        const errorJson = { service: 'sweego', error: 'Email send failed', status: swRes.status, to: env.CONTACT_RECIPIENT, from: fromEmail, errText: errText?.slice(0, 4000) }
        console.error('Sweego send failed', errorJson)
        return debug
          ? new Response(JSON.stringify(errorJson, null, 2), { status: 500, headers: { 'content-type': 'application/json' } })
          : new Response(null, { status: 303, headers: { Location: '/thank-you?sent=0' } })
      }
      if (debug) {
        const data = await swRes.json().catch(() => ({}))
        return new Response(JSON.stringify({ ok: true, service: 'sweego', data }, null, 2), { headers: { 'content-type': 'application/json' } })
      }
      // Success
      return new Response(null, { status: 303, headers: { Location: '/thank-you?sent=1' } })
    }
    // If Sweego key is missing, return an actionable error (or redirect)
    const msg = 'SWEEGO_KEY env var is not set'
    return debug
      ? new Response(JSON.stringify({ error: msg }), { status: 500, headers: { 'content-type': 'application/json' } })
      : new Response(null, { status: 303, headers: { Location: '/thank-you?sent=0' } })
  } catch (err: any) {
    const body = JSON.stringify({ error: 'Server error', details: err?.message })
    console.error('Contact function crash', body)
    return new Response(body, { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
