const fs = require('fs');
const path = require('path');
const db = require('../db');

const jsonPath = path.join(__dirname, '../data/projects.json');

function readLocalProjects() {
  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Local project data unavailable:', error.message);
    return [];
  }
}

function mapProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    tags: row.tags || [],
    liveUrl: row.live_url || row.liveUrl || '',
    repoUrl: row.repo_url || row.repoUrl || '',
    category: row.category || 'General',
  };
}

exports.getProjects = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, title, description, tags, live_url, repo_url, category FROM projects ORDER BY created_at DESC');
    const projects = result.rows.map(mapProject);
    return res.json(projects.length ? projects : readLocalProjects());
  } catch (err) {
    const fallbackProjects = readLocalProjects();
    if (fallbackProjects.length) {
      return res.json(fallbackProjects);
    }
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, title, description, tags, live_url, repo_url, category FROM projects WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      const fallbackProjects = readLocalProjects();
      const match = fallbackProjects.find((project) => String(project.id) === String(req.params.id));
      if (!match) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.json(match);
    }
    const row = result.rows[0];
    return res.json(mapProject(row));
  } catch (err) {
    const fallbackProjects = readLocalProjects();
    const match = fallbackProjects.find((project) => String(project.id) === String(req.params.id));
    if (match) {
      return res.json(match);
    }
    next(err);
  }
};
