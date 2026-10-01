const db = require('../db');
const nodemailer = require('nodemailer');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_RECEIVER = 'kutsvaraclever@outlook.com';
const recipientEmail = (process.env.CONTACT_RECEIVER_EMAIL || DEFAULT_RECEIVER).trim().toLowerCase();

let cachedTransport = null;
let smtpDisabled = false;

function createMailTransport() {
  if (smtpDisabled) {
    return null;
  }

  const SMTP_PASSWORD = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    return null;
  }

  if (/yourprovider|example\.com|placeholder/i.test(SMTP_HOST)) {
    return null;
  }

  if (cachedTransport) {
    return cachedTransport;
  }

  const port = Number(SMTP_PORT);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  cachedTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    requireTLS: !secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    tls: {
      minVersion: 'TLSv1.2',
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 12000,
  });

  return cachedTransport;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function saveContactBestEffort(name, email, message) {
  try {
    await db.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );
  } catch (err) {
    console.warn('Contact saved to email only. Database write skipped:', err.message || err);
  }
}

async function sendViaSmtp(name, email, message) {
  const mailTransport = createMailTransport();
  if (!mailTransport) {
    return false;
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  try {
    await mailTransport.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: `${name} <${email}>`,
      subject: `New portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
          <h2 style="margin-bottom: 8px;">New portfolio contact message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    cachedTransport = null;
    if (err && (err.code === 'EAUTH' || err.responseCode === 535)) {
      smtpDisabled = true;
    }
    console.warn('SMTP delivery unavailable:', err.message || err);
    return false;
  }
}

async function sendViaFormSubmit(name, email, message) {
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Origin: 'http://localhost:5000',
      Referer: 'http://localhost:5000/contact.html',
      'User-Agent': 'Mozilla/5.0 PortfolioContactBot',
    },
    body: JSON.stringify({
      name,
      email,
      message,
      _replyto: email,
      _subject: `New portfolio message from ${name}`,
      _template: 'table',
      _captcha: 'false',
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === 'false' || payload.success === false) {
    throw new Error(payload.message || payload.error || `FormSubmit status ${response.status}`);
  }
}

exports.submitContact = async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const message = String(req.body?.message || '').trim();
  const alreadyDelivered = req.body?.alreadyDelivered === true || req.headers['x-client-delivered'] === '1';

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  if (name.length > 120) {
    return res.status(400).json({ error: 'Name must be 120 characters or fewer.' });
  }

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters long.' });
  }

  if (message.length > 5000) {
    return res.status(400).json({ error: 'Message must be 5000 characters or fewer.' });
  }

  try {
    if (!alreadyDelivered) {
      const smtpOk = await sendViaSmtp(name, email, message);
      if (!smtpOk) {
        await sendViaFormSubmit(name, email, message);
      }
    }

    await saveContactBestEffort(name, email, message);

    return res.json({
      status: 'received',
      message: 'Thanks for reaching out! Your message was sent successfully.',
    });
  } catch (err) {
    console.error('Contact email failed:', err);
    return res.status(502).json({
      error: 'Failed to deliver your message. Please try again shortly, or email kutsvaraclever@outlook.com directly.',
    });
  }
};
