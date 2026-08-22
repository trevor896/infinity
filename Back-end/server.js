require('dotenv').config();

const express = require('express');
const cors = require('cors');
const projectsRouter = require('./routes/projects');
const skillsRouter = require('./routes/skills');
const contactRouter = require('./routes/contact');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/contact', contactRouter);

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio backend is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(port, () => {
  console.log(`Portfolio backend running on http://localhost:${port}`);
});
