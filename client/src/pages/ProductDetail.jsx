import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { luxe } from '@/api/luxeClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Star, 
  Truck, 
  RotateCcw, 
  Shield,
  ChevronLeft,
  ChevronRight,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => luxe.entities.Product.filter({ id: productId }),
    enabled: !!productId,
    select: (data) => data[0]
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['relatedProducts', product?.category],
    queryFn: () => luxe.entities.Product.filter({ category: product?.category }, '-created_date', 4),
    enabled: !!product?.category
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const isAuth = await luxe.auth.isAuthenticated();
      if (!isAuth) {
        luxe.auth.redirectToLogin(createPageUrl(`ProductDetail?id=${productId}`));
        return;
      }
      return luxe.entities.CartItem.create({
        product_id: productId,
        quantity,
        size: selectedSize
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      toast.success('Added to cart');
    }
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      const isAuth = await luxe.auth.isAuthenticated();
      if (!isAuth) {
        luxe.auth.redirectToLogin(createPageUrl(`ProductDetail?id=${productId}`));
        return;
      }
      return luxe.entities.Wishlist.create({
        product_id: productId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4">Product not found</h2>
          <Link to={createPageUrl('Shop')} className="text-gold hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'];

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const discount = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/50 mb-12">
          <Link to={createPageUrl('Home')} className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to={createPageUrl('Shop')} className="hover:text-gold transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-gold capitalize">{product.category}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              className="relative aspect-square bg-[#1A1A1A] overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.new_arrival && (
                  <span className="px-3 py-1 bg-gold text-black text-xs font-semibold tracking-wider">
                    NEW
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-3 py-1 bg-white text-black text-xs font-semibold tracking-wider">
                    -{discount}%
                  </span>
                )}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Brand */}
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-2">
              {product.brand || 'LUXE'}
            </p>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-light mb-4">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating) 
                          ? 'fill-gold text-gold' 
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{product.rating?.toFixed(1)}</span>
                  <span className="text-white/50 text-sm">({product.numReviews || 0} reviews)</span>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-3xl text-gold font-semibold">
                ${product.price?.toLocaleString()}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xl text-white/40 line-through">
                  ${product.original_price?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-white/60 leading-relaxed mb-8">
              {product.description || 'Experience unparalleled luxury with this exquisite piece. Crafted with meticulous attention to detail using only the finest materials, this item embodies timeless elegance and sophisticated design.'}
            </p>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold tracking-wider uppercase">Size</h3>
                <button className="text-gold text-sm hover:underline">Size Guide</button>
              </div>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border transition-all ${
                      selectedSize === size
                        ? 'border-gold bg-gold text-black'
                        : 'border-white/20 hover:border-gold'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {product.stock && (
                  <span className="text-white/40 text-sm">
                    {product.stock} in stock
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending}
                className="flex-1 py-4 bg-gold text-black font-semibold tracking-wider flex items-center justify-center gap-3 hover:bg-[#E8D5A3] transition-colors disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5" />
                ADD TO CART
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToWishlistMutation.mutate()}
                className="w-14 h-14 border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              >
                <Heart className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-white/10">
              <div className="flex flex-col items-center text-center">
                <Truck className="w-6 h-6 text-gold mb-2" />
                <span className="text-xs text-white/60">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="w-6 h-6 text-gold mb-2" />
                <span className="text-xs text-white/60">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-6 h-6 text-gold mb-2" />
                <span className="text-xs text-white/60">2-Year Warranty</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 1 && (
          <section className="mt-24">
            <div className="text-center mb-12">
              <span className="text-gold text-sm tracking-[0.3em] uppercase">You May Also Like</span>
              <h2 className="text-3xl font-light mt-4">Related Products</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}