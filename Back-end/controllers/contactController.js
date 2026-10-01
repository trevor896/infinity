const db = require('../db');
const nodemailer = require('nodemailer');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_RECEIVER = 'kutsvaraclever@outlook.com';
const recipientEmail = (process.env.CONTACT_RECEIVER_EMAIL || DEFAULT_RECEIVER).trim().toLowerCase();

let cachedTransport = null;

function createMailTransport() {
  const SMTP_PASSWORD = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
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
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
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
    // Email delivery is the primary goal; never fail the request because of DB issues.
    console.warn('Contact saved to email only. Database write skipped:', err.message || err);
  }
}

function describeMailError(err) {
  const code = err && (err.responseCode || err.code);
  const response = String(err && (err.response || err.message) || '');

  if (code === 'EAUTH' || /auth|login|credentials|535|534/i.test(response)) {
    return 'Email authentication failed. For Gmail, create an App Password at https://myaccount.google.com/apppasswords and set it as SMTP_PASS.';
  }

  if (code === 'EDNS' || code === 'ENOTFOUND') {
    return 'SMTP host could not be found. Set SMTP_HOST to smtp.gmail.com (Gmail) or smtp-mail.outlook.com (Outlook).';
  }

  if (code === 'ESOCKET' || code === 'ETIMEDOUT' || code === 'ECONNECTION' || /timeout|connect/i.test(response)) {
    return 'Could not connect to the email server. Check SMTP_HOST, SMTP_PORT, and your network.';
  }

  return 'Failed to deliver your message. Please try again shortly.';
}

exports.submitContact = async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const message = String(req.body?.message || '').trim();

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

  const mailTransport = createMailTransport();

  if (!mailTransport) {
    return res.status(503).json({
      error: 'Email delivery is not configured. Set the SMTP environment variables and restart the backend.',
    });
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

    await saveContactBestEffort(name, email, message);

    return res.json({
      status: 'received',
      message: 'Thanks for reaching out! Your message was sent successfully.',
    });
  } catch (err) {
    console.error('Contact email failed:', err);
    return res.status(502).json({ error: describeMailError(err) });
  }
};
