const express = require('express');
const router = express.Router();

router.get('/overview', (req, res) => {
  res.json([
    {
      title: 'User-centered design',
      description: 'Interfaces designed around clarity, readability, and conversion-focused journeys.',
      metric: 'UX-first',
    },
    {
      title: 'Fast front-end delivery',
      description: 'Clean, lightweight markup and assets that load quickly across devices.',
      metric: 'Responsive',
    },
    {
      title: 'Reliable backend support',
      description: 'Structured API routes, fallback data, and safe contact handling for production readiness.',
      metric: 'Deployable',
    },
  ]);
});

module.exports = router;
