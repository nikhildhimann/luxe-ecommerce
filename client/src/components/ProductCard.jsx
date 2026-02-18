import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { luxe } from '@/api/luxeClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ProductCard = memo(function ProductCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const isAuth = await luxe.auth.isAuthenticated();
      if (!isAuth) {
        luxe.auth.redirectToLogin(createPageUrl('Shop'));
        return;
      }
      return luxe.entities.CartItem.create({
        product_id: product.id,
        quantity: 1
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
        luxe.auth.redirectToLogin(createPageUrl('Shop'));
        return;
      }
      return luxe.entities.Wishlist.create({
        product_id: product.id
      });
    },
    onSuccess: () => {
      setIsLiked(true);
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
    },
    onError: () => {
      setIsLiked(false);
      toast.error('Failed to add to wishlist');
    }
  });

  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
  const hoverImage = product.images?.[1] || mainImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1A1A1A]">
        <motion.img
          src={isHovered ? hoverImage : mainImage}
          alt={product.name}
          className="w-full h-full object-cover"
          initial={false}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.new_arrival && (
            <span className="px-3 py-1 bg-gold text-black text-xs font-semibold tracking-wider">
              NEW
            </span>
          )}
          {product.original_price && product.original_price > product.price && (
            <span className="px-3 py-1 bg-white text-black text-xs font-semibold tracking-wider">
              SALE
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 left-4 right-4 flex justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCartMutation.mutate()}
            className="w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-gold transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
          </motion.button>
          <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-gold transition-colors"
            >
              <Eye className="w-5 h-5" />
            </motion.div>
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToWishlistMutation.mutate()}
            className={`w-12 h-12 flex items-center justify-center transition-colors ${
              isLiked ? 'bg-gold text-black' : 'bg-white text-black hover:bg-gold'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="mt-4 px-2 text-center">
        <p className="text-xs text-white/50 tracking-[0.2em] uppercase mb-2">
          {product.brand || product.category}
        </p>
        <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
          <h3 className="text-white font-medium hover:text-gold transition-colors line-clamp-2 text-sm">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        {product.rating && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(product.rating)
                      ? 'fill-gold text-gold'
                      : 'text-white/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-white/50">({product.numReviews || 0})</span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="text-gold font-semibold text-lg">
            ${product.price?.toLocaleString()}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-white/40 line-through text-sm">
              ${product.original_price?.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;