import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler(async (req, res) => {
  const { name, phone_number, password } = req.body;
  console.log(req.body);
  
  // Validate input fields
  if (!name || !phone_number || !password) {
    res.status(400);
    throw new Error('Please provide name, phone number, and password');
  }
  
  // Check if user with the same phone number already exists
  const userExists = await User.findOne({ phone_number });
  if (userExists) {
    res.status(400);
    throw new Error('User with this phone number already exists');
  }
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Create a new user document
  const user = await User.create({
    name,
    phone_number,
    password: hashedPassword,
  });
  
  if (user) {
    // Generate a token upon registration
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'defaultSecretKeyForTesting',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token, // Send the generated token
      user: {
        id: user._id,
        name: user.name,
        phone_number: user.phone_number,
        role: user.role,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});
  

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { phone_number, password } = req.body;
console.log(phone_number , password , 'cred')
  // Validate that phone number and password are provided
  if (!phone_number || !password) {
    res.status(400);
    throw new Error("Please provide both phone number and password");
  }

  // Find the user by phone number
  const user = await User.findOne({ phone_number });
  if (!user) {
    res.status(401);
    throw new Error("Invalid phone number or password");
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid phone number or password");
  }

  //Generate a JSON Web Token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  // Respond with the token and user details
  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      phone_number: user.phone_number,
      role: user.role,
    },
  });
});

export {registerUser,  loginUser };
