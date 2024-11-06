const test = (req, res) => {
  res.send('Test route is working');
};

module.exports = { test };
// In controllers/authControllers.js
exports.test = (req, res) => {
  res.send({ message: 'Server is working correctly!' });
};
