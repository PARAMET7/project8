const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth')

const test = (req, res) => {
  res.send('Test route is working');
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({
        error: 'Name is required',
      });
    }

    // Check if password is valid
    if (!password || password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long',
      });
    }

    // Check if email already exists
    const exist = await User.findOne({ email }); // Use 'User' here instead of 'user'
    if (exist) {
      return res.status(400).json({
        error: 'Email already exists',
      });
    }

    const hashedPassword = await hashPassword(password)
    // Create a new user  in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return the created user
    return res.status(201).json(user);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

module.exports = {
  test,
  registerUser, // Ensure that `registerUser` is exported as well
};
