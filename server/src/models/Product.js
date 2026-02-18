import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  original_price: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    default: 'Generic',
  },
  images: [{
    type: String,
  }],
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  new_arrival: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  // Additional fields for organization
  gender: {
    type: String,
    enum: ['Boys', 'Girls', 'Men', 'Women'],
  },
  colour: {
    type: String,
  },
  productType: {
    type: String,
  },
  subCategory: {
    type: String,
  },
  usage: {
    type: String,
  },
  productId: {
    type: String,
  },
}, {
  timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' },
});

// Since the frontend uses 'id' instead of '_id', let's add a virtual
productSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
