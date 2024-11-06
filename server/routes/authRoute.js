const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test } = require('../controlers/authControlers');

// Middleware for CORS
router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

// Define route to test the server
router.get('/', test);

module.exports = router;
app.use('/auth', require('./routes/authRoute')); 
