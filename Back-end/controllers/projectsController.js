const db = require('../db');

exports.getProjects = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, title, description, tags, live_url, repo_url, category FROM projects ORDER BY created_at DESC');
    const projects = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      tags: row.tags,
      liveUrl: row.live_url,
      repoUrl: row.repo_url,
      category: row.category,
    }));
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, title, description, tags, live_url, repo_url, category FROM projects WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const row = result.rows[0];
    res.json({
      id: row.id,
      title: row.title,
      description: row.description,
      tags: row.tags,
      liveUrl: row.live_url,
      repoUrl: row.repo_url,
      category: row.category,
    });
  } catch (err) {
    next(err);
  }
};
