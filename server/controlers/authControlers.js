const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');


const test = (req, res) => {
  res.send('Test route is working');
};
 //register endpoint
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

//login endpoint
const loginUser = async (req, res) =>{
  try {
    const {email, password} = req.body;

    //checking if the user is exist
    const user = await User.findOne({email});
    if (!user){
      return res.json({
        error: 'No user found'
      })
    }
    //check password match
    const match = await comparePassword(password, user.password)
    if (match){
      jwt.sign({email: user.email, id: user._id,name: user.name}, process.env.JWT_SECRET, {}, (err, token) =>{
        if (err) throw err;
        res.cookie('token', token).token(user)
      })
    res.json('password match')
    }
    if (!match){
      res.json({
        error: "Password do not match"
      })
    }
  } catch (error) {
    console.log(error);
  }
}

const getProfile = (req,res) =>{
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user)=>{
      res.json(user)
    })
  } else{
    res.json(null)
  }
}

module.exports = {
  test,
  registerUser, // Ensure that `registerUser` is exported as well
  loginUser,
  getProfile
};
