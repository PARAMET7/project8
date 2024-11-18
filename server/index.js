const express = require('express');
const dotenv = require('dotenv').config();
const {mongoose} =require('mongoose');
const cookieParser = require('cookie-parser')

const app = express();


mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('Database is connected'))
.catch((err) => console.log('Database is not connected',err));




// const cors = require('cors');
const authRoute = require('./routes/authRoute');


// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

// app.use(cors({
//   origin: process.env.CLIENT_URL, // Specify frontend origin for CORS
//   credentials: true, // Enable credentials (e.g., cookies, sessions)
// }));

// Use routes
app.use('/auth', authRoute);// Prefix all auth routes with '/auth'

const port = process.env.PORT || 8000; // Use environment variable for port if available
// app.listen(port, () => console.log(`Server is running on port ${port}`));


//PORT=5005
//ORIGIN=http://localhost:3000
//TOKEN_SECRET=y0uRt0k3N$eCr3T
