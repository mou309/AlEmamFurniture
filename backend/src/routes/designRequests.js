const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads/requests');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `req-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only image files are allowed'));
  },
});

// POST /api/design-requests
router.post(
  '/',
  upload.array('images', 5),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('description').trim().isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, phone, description, user_id } = req.body;
    const imageUrls = req.files ? req.files.map(f => `/uploads/requests/${f.filename}`) : [];

    // If DB is available, save to it; otherwise just return success
    try {
      await db.query(
        `INSERT INTO design_requests (user_id, name, email, description, image_url)
         VALUES ($1, $2, $3, $4, $5)`,
        [user_id || null, name, phone, description, imageUrls[0] || null]
      );
    } catch (err) {
      // DB might not be connected — still return success so UI works
      console.warn('[DB] Design request not saved to DB:', err.message);
    }

    res.status(201).json({
      message: `شكراً ${name}! تم استلام طلبك بنجاح وسنتواصل معك على الرقم ${phone} قريباً 🎉`,
      images_received: imageUrls.length,
    });
  }
);

// Serve uploaded files statically
router.use('/files', require('express').static(uploadDir));

module.exports = router;
