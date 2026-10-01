require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const projectsRouter = require('./routes/projects');
const skillsRouter = require('./routes/skills');
const contactRouter = require('./routes/contact');
const siteRouter = require('./routes/site');

const app = express();
const port = Number(process.env.PORT || 5000);
const frontendDir = path.join(__dirname, '../docs');

app.disable('x-powered-by');
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many contact submissions. Please try again later.' },
});

app.use('/api', apiLimiter);
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/contact', contactLimiter, contactRouter);
app.use('/api/site', siteRouter);

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Portfolio backend is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.use(express.static(frontendDir, {
  maxAge: '1h',
  etag: true,
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(port, () => {
  console.log(`Portfolio app running on http://localhost:${port}`);

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const receiver = process.env.CONTACT_RECEIVER_EMAIL || 'kutsvaraclever@outlook.com';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('Contact email is NOT ready: missing SMTP_HOST, SMTP_USER, or SMTP_PASS in Back-end/.env');
  } else if (/yourprovider|example\.com|your-/i.test(smtpHost) || /your-|example/i.test(smtpUser)) {
    console.warn('Contact email looks misconfigured: replace placeholder SMTP values in Back-end/.env');
  } else {
    console.log(`Contact email ready: send via ${smtpUser} → ${receiver}`);
  }
});
