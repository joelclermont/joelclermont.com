import { EmailMessage } from 'cloudflare:email';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env, ctx);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env, ctx) {
  const form = await request.formData();

  const human = await verifyTurnstile(
    form.get('cf-turnstile-response'),
    request.headers.get('CF-Connecting-IP'),
    env.TURNSTILE_SECRET,
  );
  if (!human) {
    return new Response('Spam check failed. Please go back and try again.', { status: 400 });
  }

  const submission = validateSubmission(form);
  if (!submission) {
    return new Response('Please go back and include a message and a valid email address.', { status: 400 });
  }

  const raw = buildMessage({
    from: env.CONTACT_FROM,
    to: env.CONTACT_TO,
    replyTo: submission.email,
    subject: 'joelclermont.com contact form',
    text: `From: ${submission.email}\n\n${submission.message}`,
  });

  // Sending takes several seconds, so don't make the visitor wait on it.
  // A failed send is logged with the submission so the message can still be recovered.
  ctx.waitUntil(
    env.CONTACT_EMAIL.send(new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, raw)).catch((error) => {
      console.error('Contact form email failed', { error: String(error), submission });
    }),
  );

  return Response.redirect(new URL('/contact-success/', request.url), 303);
}

async function verifyTurnstile(token, ip, secret) {
  if (typeof token !== 'string' || token === '') {
    return false;
  }

  const body = new URLSearchParams({ secret, response: token });
  if (ip) {
    body.set('remoteip', ip);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const outcome = await response.json();

  return outcome.success === true;
}

/**
 * Returns { email, message } when the submission is acceptable, or null to reject it.
 *
 * The email ends up in a Reply-To header, so it must never contain a line break.
 */
function validateSubmission(form) {
  const email = form.get('email');
  const message = form.get('message');

  if (typeof email !== 'string' || typeof message !== 'string') {
    return null;
  }

  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (trimmedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return null;
  }

  if (trimmedMessage === '' || trimmedMessage.length > 5000) {
    return null;
  }

  return { email: trimmedEmail, message: trimmedMessage };
}

// The body is base64 encoded so long lines and non-ASCII text survive SMTP intact.
function buildMessage({ from, to, replyTo, subject, text }) {
  const bytes = new TextEncoder().encode(text);
  const body = btoa(String.fromCharCode(...bytes)).replace(/.{76}/g, '$&\r\n');

  return [
    `From: Contact Form <${from}>`,
    `To: ${to}`,
    `Reply-To: ${replyTo.replace(/[\r\n]/g, '')}`,
    `Subject: ${subject}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${from.split('@')[1]}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    body,
  ].join('\r\n');
}
