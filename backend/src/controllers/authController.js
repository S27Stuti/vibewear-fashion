const { User } = require('../models');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/apiError');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError('Please provide name, email, and password', 400));
    }

    if (password.length < 8) {
      return next(new ApiError('Password must be at least 8 characters or digits long.', 400));
    }

    // Check if user already exists
    const userExists = await User.findOne({ where: { email: email.toLowerCase() } });
    if (userExists) {
      return next(new ApiError('A user with this email already exists', 400));
    }

    // Create user in MySQL
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role && ['Customer', 'Admin'].includes(role) ? role : 'Customer'
    });

    // Generate JWT
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        _id: user.id, // For backward compatibility with frontend
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError('Please provide email and password', 400));
    }

    // Find user by email
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return next(new ApiError('Invalid email or password', 401));
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ApiError('Invalid email or password', 401));
    }

    // Generate JWT
    const token = generateToken(user.id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        _id: user.id, // For backward compatibility
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
