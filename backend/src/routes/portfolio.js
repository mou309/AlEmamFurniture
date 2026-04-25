const router = require('express').Router();
const db = require('../models/db');

// GET /api/portfolio
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM portfolio_projects ORDER BY completed_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
