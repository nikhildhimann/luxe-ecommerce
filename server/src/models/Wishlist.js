import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
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
}, {
  timestamps: true,
});

// Ensure a user can't add the same product twice to wishlist
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

wishlistSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

wishlistSchema.virtual('product_id').get(function(){
    return this.product._id ? this.product._id.toHexString() : this.product.toHexString();
});

wishlistSchema.set('toJSON', {
    virtuals: true
});

export default mongoose.model('Wishlist', wishlistSchema);
