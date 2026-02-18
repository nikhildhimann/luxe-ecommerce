import Order from '../../models/Order.js';
import asyncHandler from '../../middlewares/asyncHandler.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    order_number,
    items,
    shipping_address,
    payment_method,
    items_price,
    tax,
    shipping,
    total,
    subtotal
  } = req.body;

  if (items && items.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      order_number,
      items: items.map((x) => ({
        ...x,
        product: x.product_id,
        _id: undefined
      })),
      user: req.user._id,
      shipping_address,
      payment_method,
      items_price,
      tax,
      shipping,
      total,
      subtotal
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ created_date: -1 });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    // Check authorization (admin or owner)
    if(req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()){
        res.status(401);
        throw new Error('Not authorized');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});
