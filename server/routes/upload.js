const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');

// Upload a product image (admin only)
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  // Return the file path (relative to server root)
  res.json({ imageUrl: `/uploads/${path.basename(req.file.path)}` });
});

module.exports = router; 