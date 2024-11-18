// app.js

const express = require("express");
const app = express();

// Middleware configuration (e.g., body parsers, CORS, etc.)
require("./config")(app);  // Custom middleware configuration

// Import and set up routes
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);  // Use index routes for API routes

const authRoutes = require("./routes/authRoute");
app.use("/auth", authRoutes);  // Use auth routes for login, signup, etc.

// Error handling (optional, to handle errors globally)
require("./error-handling")(app);  // Error handling middleware

module.exports = app;  // Export the app for server.js to use
