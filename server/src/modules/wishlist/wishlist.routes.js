import express from 'express';
import {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
  removeFromWishlistByProduct,
} from './wishlist.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

// Get all wishlist items
router.get('/', getWishlistItems);

// Add to wishlist
router.post('/', addToWishlist);

// Remove from wishlist by wishlist item ID
router.delete('/:id', removeFromWishlist);

// Remove from wishlist by product ID
router.delete('/product/:productId', removeFromWishlistByProduct);

export default router;
