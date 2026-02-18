import express from 'express';
import {
  loginUser,
  registerUser,
  getUserProfile,
  logoutUser,
  refreshAccessToken
} from './auth.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);
router.get('/me', protect, getUserProfile);

export default router;
