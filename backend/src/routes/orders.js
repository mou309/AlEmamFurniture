const router = require('express').Router();
const db = require('../models/db');
const authMiddleware = require('../middleware/auth');

// POST /api/orders — create order
router.post('/', authMiddleware, async (req, res) => {
  const { items, shipping_address, notes } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: 'No items provided' });

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const totalAmount = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, notes) VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.userId, totalAmount, JSON.stringify(shipping_address), notes]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, item_id, quantity, unit_price, custom_options) VALUES ($1, $2, $3, $4, $5)`,
        [order.order_id, item.item_id, item.quantity, item.unit_price, JSON.stringify(item.custom_options || {})]
      );
    }

    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Order creation failed' });
  } finally {
    client.release();
  }
});

// GET /api/orders — user's orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT o.*, json_agg(oi) as items FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.order_id ORDER BY o.created_at DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
