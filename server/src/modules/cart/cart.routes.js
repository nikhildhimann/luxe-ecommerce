import express from 'express';
import {
  getCartItems,
  addToCart,
  updateCartItem,
  removeCartItem,
} from './cart.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').get(protect, getCartItems).post(protect, addToCart);
router.route('/:id').put(protect, updateCartItem).delete(protect, removeCartItem);

export default router;
