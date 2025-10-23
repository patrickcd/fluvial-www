# Cloudflare Pages Function Setup

## Contact Form Handler

The contact form function is located at `/functions/api/contact.ts` and will be available at:
- `https://yourdomain.com/api/contact`

### Required Environment Variables

Set these in Cloudflare Pages dashboard (Settings → Environment variables):

#### Production & Preview:
```
CONTACT_RECIPIENT=info@fluvialdiligence.com
TURNSTILE_SECRET=your_turnstile_secret_key
SWEEGO_KEY=your_sweego_api_key
```

#### Optional:
```
CONTACT_FROM=noreply@fluvialdiligence.com
```
(If not set, will default to `noreply@yourdomain.com`)

### How to Get These Keys:

1. **Turnstile (Cloudflare CAPTCHA)**
   - Go to: https://dash.cloudflare.com/?to=/:account/turnstile
   - Create a new site
   - Copy the **Secret Key** → use as `TURNSTILE_SECRET`
   - Copy the **Site Key** → use in your contact form

2. **Sweego Email API**
   - Sign up at: https://sweego.io
   - Get your API key from dashboard
   - Use as `SWEEGO_KEY`

### Features:

✅ **Turnstile verification** - Cloudflare's CAPTCHA to prevent spam
✅ **Honeypot field** - Additional spam protection
✅ **Email via Sweego API** - Reliable transactional email
✅ **Debug mode** - Add `?debug=1` to test
✅ **Success/Error redirects** - Redirects to `/thank-you?sent=1` or `sent=0`

### Form Fields Expected:

Required:
- `name` - Sender's name
- `email` - Sender's email
- `message` - Message content

Optional:
- `company` - Sender's company
- `website` - Honeypot field (should be hidden and empty)
- `cf-turnstile-response` - Turnstile token (auto-populated)

### Testing:

1. **Local testing**: Not available (needs Cloudflare Workers runtime)
2. **Debug mode**: Deploy and use `?debug=1` parameter
3. **Production**: Just submit the form normally

### Example HTML Form Structure:

```html
<form action="/api/contact" method="POST">
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <input type="text" name="company" />
  <textarea name="message" required></textarea>
  
  <!-- Honeypot (hidden) -->
  <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off" />
  
  <!-- Turnstile widget -->
  <div class="cf-turnstile" data-sitekey="YOUR_TURNSTILE_SITE_KEY"></div>
  
  <button type="submit">Send</button>
</form>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
```

### Next Steps:

1. Set environment variables in Cloudflare Pages
2. Get Turnstile site key and add to contact form
3. Update `/src/pages/contact.md` with the form
4. Deploy and test!
