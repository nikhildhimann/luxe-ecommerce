import CartItem from '../../models/CartItem.js';
import asyncHandler from '../../middlewares/asyncHandler.js';

// @desc    Get cart items
// @route   GET /api/cart
// @access  Private
export const getCartItems = asyncHandler(async (req, res) => {
  const cartItems = await CartItem.find({ user: req.user._id });
  res.json(cartItems);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { product_id, quantity, size } = req.body;

  // Check if item already exists in cart for this user
  const existingItem = await CartItem.findOne({
    user: req.user._id,
    product: product_id,
    size: size // If size is different, it's a different item
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    const updatedItem = await existingItem.save();
    res.status(200).json(updatedItem);
  } else {
    const cartItem = await CartItem.create({
      user: req.user._id,
      product: product_id,
      quantity,
      size,
    });
    res.status(201).json(cartItem);
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  
  const cartItem = await CartItem.findById(req.params.id);

  if (cartItem) {
    // Check if user owns the item
    if (cartItem.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    cartItem.quantity = quantity;
    const updatedItem = await cartItem.save();
    res.json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Cart item not found');
  }
});

// @desc    Remove cart item
// @route   DELETE /api/cart/:id
// @access  Private
export const removeCartItem = asyncHandler(async (req, res) => {
  const cartItem = await CartItem.findById(req.params.id);

  if (cartItem) {
    // Check if user owns the item
    if (cartItem.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await cartItem.deleteOne();
    res.json({ message: 'Item removed' });
  } else {
    res.status(404);
    throw new Error('Cart item not found');
  }
});
