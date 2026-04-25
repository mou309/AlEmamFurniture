const fs = require('fs');
const path = require('path');
const { query } = require('./db');

async function initDb() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await query(sql);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('DB init error:', err.message);
    process.exit(1);
  }
}

initDb();
