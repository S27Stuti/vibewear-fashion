const { User } = require('../models');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/apiError');

const ADMIN_SECURITY_KEY = 'VIBE-ADMIN-2026';
const RIDER_SECURITY_KEY = 'VIBE-RIDER-2026';

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, vehicleDetails, licenseNumber, securityKey } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError('Please provide name, email, and password', 400));
    }

    if (password.length < 8) {
      return next(new ApiError('Password must be at least 8 characters or digits long.', 400));
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const userExists = await User.findOne({ where: { email: cleanEmail } });
    if (userExists) {
      return next(new ApiError('A user with this email already exists. Please log in directly.', 400));
    }

    // STRICT ROLE SECURITY VALIDATION
    let assignedRole = 'Customer';

    if (role === 'Admin') {
      if (securityKey !== ADMIN_SECURITY_KEY || !cleanEmail.endsWith('@vibewear.com')) {
        return next(
          new ApiError(
            'Admin Registration Denied: Corporate @vibewear.com email address and valid Admin Security Access Key (VIBE-ADMIN-2026) are required.',
            403
          )
        );
      }
      assignedRole = 'Admin';
    } else if (role === 'DeliveryPartner') {
      if (securityKey !== RIDER_SECURITY_KEY || !phone || !vehicleDetails || !licenseNumber) {
        return next(
          new ApiError(
            'Rider Registration Denied: Valid Driving License Number, Vehicle Registration, Contact Phone, and Authorized Rider Access Code (VIBE-RIDER-2026) are required.',
            400
          )
        );
      }
      assignedRole = 'DeliveryPartner';
    }

    // Create user in MySQL
    const user = await User.create({
      name,
      email: cleanEmail,
      password,
      role: assignedRole,
      phone: phone || null,
      vehicleDetails: vehicleDetails || null,
      licenseNumber: licenseNumber || null
    });

    // Generate JWT
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      message: `${assignedRole} registered successfully!`,
      token,
      user: {
        id: user.id,
        _id: user.id, // For backward compatibility with frontend
        name: user.name,
        email: user.email,
        phone: user.phone,
        vehicleDetails: user.vehicleDetails,
        licenseNumber: user.licenseNumber,
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
    const { email, password, requestedRole } = req.body;

    if (!email || !password) {
      return next(new ApiError('Please provide email and password', 400));
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ where: { email: cleanEmail } });
    if (!user) {
      return next(new ApiError('Account not found! Please register first before logging in.', 401));
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ApiError('Incorrect password! Please check your credentials.', 401));
    }

    // STRICT LOGIN PORTAL ROLE VALIDATION
    if (requestedRole === 'Admin' && user.role !== 'Admin') {
      return next(
        new ApiError(
          'Access Denied: This account does not possess Administrator clearance. Please sign in via the Customer portal.',
          403
        )
      );
    }

    if (requestedRole === 'DeliveryPartner' && user.role !== 'DeliveryPartner') {
      return next(
        new ApiError(
          'Access Denied: This account is not registered as an authorized Delivery Hero / Rider. Please sign in via the Customer portal.',
          403
        )
      );
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
        phone: user.phone,
        vehicleDetails: user.vehicleDetails,
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
        phone: user.phone,
        vehicleDetails: user.vehicleDetails,
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
