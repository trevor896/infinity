const db = require('../db');

exports.getSkills = async (req, res, next) => {
  try {
    const result = await db.query('SELECT category, items FROM skills ORDER BY category');
    const skills = result.rows.map((row) => ({
      category: row.category,
      items: row.items,
    }));
    res.json(skills);
  } catch (err) {
    next(err);
  }
};
