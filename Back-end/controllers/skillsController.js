const fs = require('fs');
const path = require('path');
const db = require('../db');

const jsonPath = path.join(__dirname, '../data/skills.json');

function readLocalSkills() {
  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Local skills data unavailable:', error.message);
    return [];
  }
}

exports.getSkills = async (req, res, next) => {
  try {
    const result = await db.query('SELECT category, items FROM skills ORDER BY category');
    const skills = result.rows.map((row) => ({
      category: row.category,
      items: row.items || [],
    }));
    return res.json(skills.length ? skills : readLocalSkills());
  } catch (err) {
    const fallbackSkills = readLocalSkills();
    if (fallbackSkills.length) {
      return res.json(fallbackSkills);
    }
    next(err);
  }
};
