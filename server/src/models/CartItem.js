import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  size: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

// Frontend uses 'product_id' in some places, but population will replace 'product' field.
// We should check what the frontend expects.
// Frontend expects: `product` object populated in logic, but raw item has `product_id`.
// Actually in Cart.jsx: 
// const cartWithProducts = cartItems.map(item => ({ ...item, product: getProduct(item.product_id) }))
// So it seems frontend fetches cart items which contains `product_id` and then manually joins with products list.
// To support this, we should return `product_id` or just populate it and let frontend handle it.
// Best practice is to populate it in backend. But to keep "minimal changes" to frontend logic:
// The frontend manually maps `getProduct(item.product_id)`.
// So the `CartItem` response should have `product_id`.
// Let's add a virtual or just return the field.

cartItemSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

cartItemSchema.virtual('product_id').get(function(){
    return this.product._id ? this.product._id.toHexString() : this.product.toHexString();
});

cartItemSchema.set('toJSON', {
    virtuals: true
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;
