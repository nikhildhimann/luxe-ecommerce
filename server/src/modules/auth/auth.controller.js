import User from '../../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken.js';
import asyncHandler from '../../middlewares/asyncHandler.js';
import jwt from 'jsonwebtoken';

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    // Send refresh token in cookie
    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
    }

    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
        return res.status(401).json({ message: 'Not authorized, no refresh token' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshSecret');
        
        // Find user by id (decoded.id) AND refreshToken to ensure it's the valid one
        const user = await User.findOne({ _id: decoded.id, refreshToken });

        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Issue new access token
        const accessToken = generateAccessToken(user._id);
        
        // Optionally rotate refresh token here for extra security, but keeping it simple for now as per plan
        
        res.json({ token: accessToken });

    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
