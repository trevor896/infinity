const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');

router.get('/', (req, res) => {
	res.json({
		status: 'ok',
		message: 'Contact endpoint is available. Submit messages with POST /api/contact.',
	});
});

router.post('/', submitContact);

module.exports = router;
