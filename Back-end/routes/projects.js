const express = require('express');
const router = express.Router();
const { getProjects, getProjectById } = require('../controllers/projectsController');

router.get('/', getProjects);
router.get('/:id', getProjectById);

module.exports = router;
