const express = require('express');
const router = express.Router();

// Simple API endpoint for testing
router.get('/api/test', function(req, res, next) {
  res.json({ message: 'Backend working' });
});

module.exports = router;
