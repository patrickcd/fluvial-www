---
layout: ../layouts/MarkdownLayout.astro
title: Contact Fluvial
---

For enquiries regarding pricing or product details, please use the form below.

<style>
.contact-form { 
  display: grid; 
  gap: 1rem; 
  max-width: 600px; 
  margin-top: 2rem;
}

.contact-form label { 
  display: grid;
  gap: 0.5rem; 
  font-weight: 500;
  color: #374151;
}

.contact-form .label-text {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.contact-form input[type="text"],
.contact-form input[type="email"],
.contact-form textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #ffffff;
  color: #111827;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.contact-form textarea { 
  resize: vertical;
  min-height: 120px;
}

.contact-form .honeypot {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.contact-form button[type="submit"] {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  background: #3b82f6;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s;
  align-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-form button[type="submit"]:hover {
  background: #2563eb;
}

.contact-form button[type="submit"]:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.contact-form .btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  display: none;
  animation: spin 0.6s linear infinite;
}

.contact-form button[type="submit"]:disabled .btn-spinner {
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.contact-form .form-notice {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: -0.5rem;
}

.cf-turnstile {
  margin: 0.5rem 0;
}
</style>

<form action="/api/contact" method="POST" class="contact-form" onsubmit="handleSubmit(this); return true;">
  <label>
    <span class="label-text">
      Name <span style="color: #ef4444;">*</span>
    </span>
    <input type="text" name="name" autocomplete="name" required>
  </label>

  <label>
    <span class="label-text">
      Work email <span style="color: #ef4444;">*</span>
    </span>
    <input type="email" name="email" autocomplete="email" required>
  </label>

  <label>
    Company
    <input type="text" name="company" autocomplete="organization">
  </label>

  <label>
    <span class="label-text">
      Message <span style="color: #ef4444;">*</span>
    </span>
    <textarea name="message" rows="6" required></textarea>
  </label>

  <!-- Honeypot field: leave empty -->
  <input type="text" name="website" class="honeypot" tabindex="-1" autocomplete="off" aria-hidden="true">

  <!-- Cloudflare Turnstile widget -->
  <!-- Replace with your actual Turnstile site key -->
  <div class="cf-turnstile" data-sitekey="0x4AAAAAAB7VZp5GC8OufIcA"></div>

  <button type="submit" aria-live="polite">
    <span class="btn-spinner" aria-hidden="true"></span>
    <span class="btn-label">Send message</span>
  </button>

  <p class="form-notice">
    We typically respond within 1 business day. By submitting, you agree to our privacy policy.
  </p>
</form>

<script is:inline>
function handleSubmit(form) {
  const btn = form.querySelector('button[type="submit"]');
  const label = btn?.querySelector('.btn-label');
  
  if (btn) {
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
  }
  
  if (label) {
    label.textContent = 'Sending…';
  }
  
  return true;
}
</script>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>