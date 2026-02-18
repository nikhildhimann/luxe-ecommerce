import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { luxe } from '@/api/luxeClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Wishlist() {
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const isAuth = await luxe.auth.isAuthenticated();
      if (!isAuth) {
        luxe.auth.redirectToLogin(createPageUrl('Wishlist'));
        return [];
      }
      return luxe.entities.Wishlist.list();
    }
  });

  const { data: products = [] } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => luxe.entities.Product.list()
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (id) => luxe.entities.Wishlist.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    }
  });

  const addToCartMutation = useMutation({
    mutationFn: async (productId) => {
      return luxe.entities.CartItem.create({
        product_id: productId,
        quantity: 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      toast.success('Added to cart');
    }
  });

  const getProduct = (productId) => products.find(p => p.id === productId);

  const wishlistWithProducts = wishlistItems.map(item => ({
    ...item,
    product: getProduct(item.product_id)
  })).filter(item => item.product);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (wishlistWithProducts.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Heart className="w-20 h-20 text-white/20 mx-auto mb-6" />
            <h1 className="text-3xl font-light mb-4">Your Wishlist is Empty</h1>
            <p className="text-white/60 mb-8">
              Save your favorite items here to purchase later.
            </p>
            <Link to={createPageUrl('Shop')}>
              <button className="px-8 py-4 bg-gold text-black font-semibold tracking-wider hover:bg-[#E8D5A3] transition-colors">
                DISCOVER PRODUCTS
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase">Saved</span>
          <h1 className="text-5xl font-light mt-4">My Wishlist</h1>
          <p className="text-white/60 mt-4">{wishlistWithProducts.length} items saved</p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistWithProducts.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#1A1A1A]">
                <Link to={createPageUrl(`ProductDetail?id=${item.product_id}`)}>
                  <img
                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                    alt={item.product?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlistMutation.mutate(item.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/70 flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Add to Cart Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  onClick={() => addToCartMutation.mutate(item.product_id)}
                  className="absolute bottom-4 left-4 right-4 py-3 bg-gold text-black font-semibold flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ShoppingBag className="w-5 h-5" />
                  ADD TO CART
                </motion.button>
              </div>

              {/* Product Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-white/50 tracking-[0.2em] uppercase mb-1">
                  {item.product?.brand || item.product?.category}
                </p>
                <Link to={createPageUrl(`ProductDetail?id=${item.product_id}`)}>
                  <h3 className="text-white font-medium hover:text-gold transition-colors">
                    {item.product?.name}
                  </h3>
                </Link>
                <div className="mt-2">
                  <span className="text-gold font-semibold">
                    ${item.product?.price?.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}