---
layout: ../layouts/MarkdownLayout.astro
title: Thanks for subscribing!
---

<div style="text-align: center; max-width: 600px; margin: 2rem auto;">

# Thanks for subscribing! 📬

You're now on our mailing list and will receive updates about Fluvial's latest features, news, and insights.

<div style="margin: 2rem 0; padding: 1.5rem; background: #f0f9ff; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
  <p style="margin: 0; color: #1e40af;">
    <strong>What to expect:</strong> We typically send updates monthly and you can unsubscribe at any time.
  </p>
</div>

[← Back to homepage](/)

</div>

<script is:inline>
// Show success/failure message based on URL parameter
const params = new URLSearchParams(window.location.search);
const sent = params.get('sent');

if (sent === '0') {
  document.querySelector('h1').textContent = 'Oops, something went wrong';
  document.querySelector('div > p').textContent = 'We couldn\'t complete your newsletter subscription. Please try again or contact us directly.';
}
</script>
