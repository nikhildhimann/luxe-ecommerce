import Wishlist from '../../models/Wishlist.js';
import asyncHandler from '../../middlewares/asyncHandler.js';

// @desc    Get wishlist items for logged in user
// @route   GET /api/wishlist
// @access  Private
export const getWishlistItems = asyncHandler(async (req, res) => {
  const wishlistItems = await Wishlist.find({ user: req.user._id }).populate('product');
  res.json(wishlistItems);
});

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const { product_id } = req.body;

  if (!product_id) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  // Check if item already exists in wishlist
  const existingItem = await Wishlist.findOne({
    user: req.user._id,
    product: product_id,
  });

  if (existingItem) {
    res.status(200).json(existingItem);
    return;
  }

  const wishlistItem = await Wishlist.create({
    user: req.user._id,
    product: product_id,
  });

  await wishlistItem.populate('product');
  res.status(201).json(wishlistItem);
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlistItem = await Wishlist.findById(req.params.id);

  if (!wishlistItem) {
    res.status(404);
    throw new Error('Wishlist item not found');
  }

  // Check if user owns this wishlist item
  if (wishlistItem.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to remove this item');
  }

  await Wishlist.findByIdAndDelete(req.params.id);
  res.json({ message: 'Wishlist item removed' });
});

// @desc    Remove item from wishlist by product ID
// @route   DELETE /api/wishlist/product/:productId
// @access  Private
export const removeFromWishlistByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlistItem = await Wishlist.findOneAndDelete({
    user: req.user._id,
    product: productId,
  });

  if (!wishlistItem) {
    res.status(404);
    throw new Error('Wishlist item not found');
  }

  res.json({ message: 'Wishlist item removed' });
});
