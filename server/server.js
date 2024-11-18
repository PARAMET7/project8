// server.js

const app = require("./app");
require('dotenv').config();  // Load environment variables

const PORT = process.env.SERVER_PORT || 8000;  // Get the port from environment or default to 8000

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
