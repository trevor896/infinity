const db = require('../db');
const nodemailer = require('nodemailer');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || 'Kutsvaraclever@outlook.com';

function createMailTransport() {
  const SMTP_PASSWORD = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true' || SMTP_PORT === '465',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
}

exports.submitContact = async (req, res, next) => {
  const rawName = req.body?.name;
  const rawEmail = req.body?.email;
  const rawMessage = req.body?.message;

  const name = String(rawName || '').trim();
  const email = String(rawEmail || '').trim();
  const message = String(rawMessage || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters long.' });
  }

  try {
    const mailTransport = createMailTransport();

    if (!mailTransport) {
      return res.status(503).json({
        error: 'Email delivery is not configured. Set the SMTP environment variables and restart the backend.',
      });
    }

    await db.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );

    await mailTransport.sendMail({
      from: `Portfolio contact form <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.json({ status: 'received', message: 'Thanks for reaching out!' });
  } catch (err) {
    next(err);
  }
};
