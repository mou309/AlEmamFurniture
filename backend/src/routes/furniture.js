const router = require('express').Router();
const db = require('../models/db');

// GET /api/furniture — list with filters
router.get('/', async (req, res) => {
  const { category, style, min_price, max_price, search, page = 1, limit = 12 } = req.query;

  try {
    // Try Firestore first
    const fsResult = await db.firestoreList({ category, style, min_price, max_price, search, page: parseInt(page), limit: parseInt(limit) });

    if (fsResult) {
      return res.json({
        items: fsResult.items,
        pagination: {
          total: fsResult.total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(fsResult.total / limit),
        },
      });
    }

    // Fallback: mock data (already filtered in db.js)
    const mockResult = await db.query('SELECT f.*, c.name as category_name', []);
    let items = mockResult.rows;

    // Apply filters to mock data
    if (category)  items = items.filter(i => i.category_slug === category);
    if (style)     items = items.filter(i => i.style?.toLowerCase().includes(style.toLowerCase()));
    if (min_price) items = items.filter(i => Number(i.price) >= Number(min_price));
    if (max_price) items = items.filter(i => Number(i.price) <= Number(max_price));
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => i.name?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q));
    }

    const total = items.length;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    items = items.slice(offset, offset + parseInt(limit));

    res.json({
      items,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/furniture/categories
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name', []);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/furniture/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT f.*, c.name as category_name, c.slug as category_slug
       FROM furniture_items f
       LEFT JOIN categories c ON f.category_id = c.category_id
       WHERE f.item_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
