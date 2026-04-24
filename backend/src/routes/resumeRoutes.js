const express = require('express');
const multer = require('multer');
const path = require('path');
const { analyzeResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Use memory storage so files are parsed directly without local disk dependency.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const mimeType = (file.mimetype || '').toLowerCase();
    const extension = path.extname(file.originalname || '').toLowerCase();
    const isAllowedMime = ['application/pdf', 'application/x-pdf', 'text/plain', 'application/octet-stream'].includes(mimeType);
    const isAllowedExtension = ['.pdf', '.txt'].includes(extension);
    const isAllowed = isAllowedMime && isAllowedExtension;

    if (!isAllowed) {
      return callback(new Error('Unsupported file type. Upload PDF or TXT file only.'));
    }

    return callback(null, true);
  },
});

router.post('/analyze', protect, (req, res, next) => {
  upload.single('resume')(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File is too large. Maximum size is 2MB.',
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message || 'File upload failed.',
      });
    }

    return next();
  });
}, analyzeResume);

module.exports = router;
