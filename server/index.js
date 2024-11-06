const express = require('express');
const dotenv = require('dotenv').config();
const {mongoose} =require('mongoose')

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('Database is connected'))
.catch((err) => console.log('Database is not connected',err));




const cors = require('cors');
const authRoute = require('./routes/authRoute');

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

app.use(cors({
  origin: 'http://localhost:5174', // Specify frontend origin for CORS
  credentials: true, // Enable credentials (e.g., cookies, sessions)
}));

// Use routes
app.use('/', authRoute); // Prefix all auth routes with '/auth'

const port = process.env.PORT || 8000; // Use environment variable for port if available
app.listen(port, () => console.log(`Server is running on port ${port}`));
