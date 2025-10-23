// Cloudflare Pages Function: newsletter signup handler
// Reuses the same contact function but redirects to newsletter-specific thank you page

export interface Env {
  CONTACT_RECIPIENT: string
  TURNSTILE_SECRET: string
  CONTACT_FROM?: string
  SWEEGO_KEY?: string
}

export const onRequestPost = async (context: any) => {
  try {
    const { request, env } = context
    const url = new URL(request.url)

    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/x-www-form-urlencoded') && !contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: 'Unsupported content type' }), { status: 415, headers: { 'content-type': 'application/json' } })
    }

    const formData = await request.formData()
    const debugParam = url.searchParams.get('debug') || (formData.get('debug') as string | null)
    const debug = debugParam === '1' || debugParam === 'true'

    if (!env.CONTACT_RECIPIENT) {
      return debug
        ? new Response(JSON.stringify({ error: 'CONTACT_RECIPIENT not set' }), { status: 500, headers: { 'content-type': 'application/json' } })
        : new Response(null, { status: 303, headers: { Location: '/newsletter-thanks?sent=0' } })
    }
    if (!env.TURNSTILE_SECRET) {
      return debug
        ? new Response(JSON.stringify({ error: 'TURNSTILE_SECRET not set' }), { status: 500, headers: { 'content-type': 'application/json' } })
        : new Response(null, { status: 303, headers: { Location: '/newsletter-thanks?sent=0' } })
    }

    // Honeypot check
    const honeypot = (formData.get('website') || '').toString().trim()
    if (honeypot) {
      return debug
        ? new Response(JSON.stringify({ blocked: 'honeypot' }), { headers: { 'content-type': 'application/json' } })
        : new Response(null, { status: 303, headers: { Location: '/newsletter-thanks?sent=0' } })
    }

    const email = (formData.get('email') || '').toString().trim()
    const turnstileToken = (formData.get('cf-turnstile-response') || '').toString()

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), { status: 400, headers: { 'content-type': 'application/json' } })
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
        ? new Response(JSON.stringify({ error: 'Captcha failed', verify: verifyJson }), { status: 400, headers: { 'content-type': 'application/json' } })
        : new Response(null, { status: 303, headers: { Location: '/newsletter-thanks?sent=0' } })
    }

    // Build message
    const subject = `Newsletter subscription: ${email}`
    const textBody = `New newsletter subscription request:\n\nEmail: ${email}\n\nPlease add to mailing list.`

    const host = url.hostname.replace(/^www\./, '')
    const fromEmail = env.CONTACT_FROM || `noreply@${host}`

    // Send via Sweego
    if (env.SWEEGO_KEY) {
      const swBody = {
        channel: 'email',
        provider: 'sweego',
        recipients: [{ email: env.CONTACT_RECIPIENT }],
        from: { name: 'Newsletter Signup', email: fromEmail },
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
        console.error('Newsletter signup - Sweego failed', { status: swRes.status, error: errText?.slice(0, 1000) })
        return debug
          ? new Response(JSON.stringify({ error: 'Email send failed', status: swRes.status }), { status: 500, headers: { 'content-type': 'application/json' } })
          : new Response(null, { status: 303, headers: { Location: '/newsletter-thanks?sent=0' } })
      }

      if (debug) {
        const data = await swRes.json().catch(() => ({}))
        return new Response(JSON.stringify({ ok: true, service: 'sweego', data }, null, 2), { headers: { 'content-type': 'application/json' } })
      }

      // Success - redirect to newsletter-specific thank you page
      return new Response(null, { status: 303, headers: { Location: '/newsletter-thanks?sent=1' } })
    }

    return debug
      ? new Response(JSON.stringify({ error: 'SWEEGO_KEY not set' }), { status: 500, headers: { 'content-type': 'application/json' } })
      : new Response(null, { status: 303, headers: { Location: '/newsletter-thanks?sent=0' } })
  } catch (err: any) {
    console.error('Newsletter signup error', err)
    return new Response(JSON.stringify({ error: 'Server error', details: err?.message }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
