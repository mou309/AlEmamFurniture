const router = require('express').Router();
const crypto = require('crypto');
const db = require('../models/db');
const authMiddleware = require('../middleware/auth');

// POST /api/virtual-room — save room
router.post('/', authMiddleware, async (req, res) => {
  const { name, room_data } = req.body;
  if (!room_data) return res.status(400).json({ error: 'room_data is required' });

  const shareToken = crypto.randomBytes(32).toString('hex');
  try {
    const result = await db.query(
      `INSERT INTO virtual_rooms (user_id, name, room_data, share_token) VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.userId, name || 'My Room', JSON.stringify(room_data), shareToken]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/virtual-room — user's saved rooms
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM virtual_rooms WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/virtual-room/share/:token — public share view
router.get('/share/:token', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT room_id, name, room_data, created_at FROM virtual_rooms WHERE share_token = $1',
      [req.params.token]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Room not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/virtual-room/:id — update room
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, room_data } = req.body;
  try {
    const result = await db.query(
      `UPDATE virtual_rooms SET name = COALESCE($1, name), room_data = COALESCE($2, room_data), updated_at = NOW()
       WHERE room_id = $3 AND user_id = $4 RETURNING *`,
      [name, room_data ? JSON.stringify(room_data) : null, req.params.id, req.user.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Room not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
