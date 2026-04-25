/**
 * db.js — Unified data layer
 * Priority: Firestore (if configured) → Mock data (fallback)
 */
const { Pool } = require('pg');
require('dotenv').config();

// ─── PostgreSQL Pool (kept for future use) ────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
pool.on('error', (err) => {
  console.warn('[DB] Pool error (PostgreSQL not connected):', err.message);
});

// ─── Firebase ────────────────────────────────────────────────────────────────
const { getDb } = require('../firebase/admin');

// ─── Mock data (fallback when no DB connected) ────────────────────────────────
const mockCategories = [
  { category_id: 1, name: 'Living Room', slug: 'living-room' },
  { category_id: 2, name: 'Bedroom', slug: 'bedroom' },
  { category_id: 3, name: 'Dining Room', slug: 'dining-room' },
  { category_id: 4, name: 'Office', slug: 'office' },
  { category_id: 5, name: 'Outdoor', slug: 'outdoor' },
];

const mockFurniture = [
  { item_id: 1,  name: 'Oslo Sofa',           price: 1299,  image_url: '/images/Living Room1.jpg', category_id: 1, category_name: 'Living Room', category_slug: 'living-room', style: 'Scandinavian', in_stock: true },
  { item_id: 2,  name: 'Natura Coffee Table', price: 449,   image_url: '/images/Living Room2.jpg', category_id: 1, category_name: 'Living Room', category_slug: 'living-room', style: 'Modern',       in_stock: true },
  { item_id: 3,  name: 'Haven Bed Frame',      price: 899,   image_url: '/images/br.jpg',           category_id: 2, category_name: 'Bedroom',     category_slug: 'bedroom',     style: 'Contemporary', in_stock: true },
  { item_id: 4,  name: 'Smart Storage Bed',    price: 8500,  image_url: '/images/br1.jpg',          category_id: 2, category_name: 'Bedroom',     category_slug: 'bedroom',     style: 'Modern',       in_stock: true },
  { item_id: 5,  name: 'Modern Vanity Desk',   price: 4200,  image_url: '/images/br2.jpg',          category_id: 2, category_name: 'Bedroom',     category_slug: 'bedroom',     style: 'Modern',       in_stock: true },
  { item_id: 6,  name: 'Luxury Beige Vanity',  price: 5500,  image_url: '/images/br3.jpg',          category_id: 2, category_name: 'Bedroom',     category_slug: 'bedroom',     style: 'Luxury',       in_stock: true },
  { item_id: 7,  name: 'Green Velvet Sectional',price: 12500, image_url: '/images/Living Room3.jpg',category_id: 1, category_name: 'Living Room', category_slug: 'living-room', style: 'Contemporary', in_stock: true },
  { item_id: 8,  name: 'Beige Sectional Sofa', price: 14000, image_url: '/images/Living Room4.jpg', category_id: 1, category_name: 'Living Room', category_slug: 'living-room', style: 'Modern',       in_stock: true },
  { item_id: 9,  name: 'Classic Wooden Bed',   price: 7500,  image_url: '/images/br4.jpg',          category_id: 2, category_name: 'Bedroom',     category_slug: 'bedroom',     style: 'Classic',      in_stock: true },
  { item_id: 10, name: 'Dark Grey Sectional',  price: 13500, image_url: '/images/Living Room1.jpg', category_id: 1, category_name: 'Living Room', category_slug: 'living-room', style: 'Modern',       in_stock: true },
];

// ─── Firestore helpers ────────────────────────────────────────────────────────
async function firestoreList({ category, style, min_price, max_price, search, page = 1, limit = 12 }) {
  const fsDb = getDb();
  if (!fsDb) return null;

  let query = fsDb.collection('furniture_items');
  const snapshot = await query.get();
  let items = snapshot.docs.map((doc) => ({ ...doc.data(), _id: doc.id }));

  // Apply filters in JS (Firestore free tier doesn't support complex compound queries)
  if (category)   items = items.filter(i => i.category_slug === category);
  if (style)      items = items.filter(i => i.style?.toLowerCase().includes(style.toLowerCase()));
  if (min_price)  items = items.filter(i => Number(i.price) >= Number(min_price));
  if (max_price)  items = items.filter(i => Number(i.price) <= Number(max_price));
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(i => i.name?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q));
  }

  // Sort by item_id descending (newest first)
  items.sort((a, b) => b.item_id - a.item_id);

  const total = items.length;
  const offset = (page - 1) * limit;
  items = items.slice(offset, offset + Number(limit));

  return { items, total };
}

async function firestoreGetById(id) {
  const fsDb = getDb();
  if (!fsDb) return null;
  const doc = await fsDb.collection('furniture_items').doc(String(id)).get();
  return doc.exists ? { ...doc.data(), _id: doc.id } : null;
}

async function firestoreCategories() {
  const fsDb = getDb();
  if (!fsDb) return null;
  const snap = await fsDb.collection('categories').get();
  return snap.docs.map(d => d.data()).sort((a, b) => a.category_id - b.category_id);
}

// ─── Unified query function ───────────────────────────────────────────────────
module.exports = {
  query: async (text, params) => {
    // ── Categories ──────────────────────────────────────────────────────────
    if (text.includes('SELECT * FROM categories')) {
      const fs = await firestoreCategories();
      return { rows: fs || mockCategories };
    }

    // ── Furniture count ─────────────────────────────────────────────────────
    if (text.includes('SELECT COUNT(*) FROM furniture_items')) {
      const fsDb = getDb();
      if (fsDb) {
        const snap = await fsDb.collection('furniture_items').get();
        return { rows: [{ count: String(snap.size) }] };
      }
      return { rows: [{ count: String(mockFurniture.length) }] };
    }

    // ── Furniture list ───────────────────────────────────────────────────────
    if (text.includes('SELECT f.*, c.name as category_name')) {
      // Parse params from SQL context (not ideal but works for our routes)
      // We'll let the furniture route call firestoreList directly instead
      const fsDb = getDb();
      if (fsDb) {
        const snap = await fsDb.collection('furniture_items').get();
        const items = snap.docs.map(d => d.data()).sort((a, b) => b.item_id - a.item_id);
        return { rows: items };
      }
      return { rows: mockFurniture };
    }

    // ── Single item ──────────────────────────────────────────────────────────
    if (text.includes('WHERE f.item_id = $1')) {
      const id = parseInt(params[0]);
      const fsItem = await firestoreGetById(id);
      if (fsItem) return { rows: [fsItem] };
      const item = mockFurniture.find(i => i.item_id === id);
      return { rows: item ? [item] : [] };
    }

    // ── Fallback to PostgreSQL (design_requests, orders, auth, etc.) ─────────
    return pool.query(text, params);
  },

  // Expose Firestore list helper directly for furniture route
  firestoreList,
  firestoreCategories,

  getClient: () => pool.connect(),
};
