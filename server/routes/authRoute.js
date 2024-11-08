const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser } = require('../controlers/authControlers')

// Middleware for CORS
router.use(cors({
  credentials: true,
  origin: 'http://localhost:5173', // Ensure this matches your frontend origin
}));

// Define your route(s)
router.get('/', test);
router.post('/register', registerUser)

module.exports = router;
