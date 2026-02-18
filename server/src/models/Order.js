import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  order_number: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
      product_name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
      price: { type: Number, required: true },
    },
  ],
  shipping_address: {
    full_name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
  },
  payment_method: {
    type: String,
    required: true,
  },
  payment_result: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
  tax: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shipping: {
    type: Number,
    required: true,
    default: 0.0,
  },
  subtotal: {
      type: Number,
      required: true,
      default: 0.0
  },
  total: {
    type: Number,
    required: true,
    default: 0.0,
  },
  is_paid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paid_at: {
    type: Date,
  },
  is_delivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  delivered_at: {
    type: Date,
  },
  status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  }
}, {
  timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' },
});

orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
