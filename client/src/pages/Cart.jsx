import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { luxe } from '@/api/luxeClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading: cartLoading } = useQuery({
    queryKey: ['cartItems'],
    queryFn: async () => {
      const isAuth = await luxe.auth.isAuthenticated();
      if (!isAuth) {
        luxe.auth.redirectToLogin(createPageUrl('Cart'));
        return [];
      }
      return luxe.entities.CartItem.list();
    }
  });

  const { data: products = [] } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => luxe.entities.Product.list()
  });

  const updateQuantityMutation = useMutation({
    mutationFn: (variables) => {
      const { id, quantity } = variables;
      return luxe.entities.CartItem.update(id, { quantity });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cartItems'] })
  });

  const removeItemMutation = useMutation({
    mutationFn: (id) => luxe.entities.CartItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      toast.success('Item removed from cart');
    }
  });

  const getProduct = (productId) => products.find(p => p.id === productId);

  const cartWithProducts = cartItems.map(item => ({
    ...item,
    product: getProduct(item.product_id)
  })).filter(item => item.product);

  const subtotal = cartWithProducts.reduce((sum, item) => 
    sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  
  const shipping = subtotal > 500 ? 0 : 15;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (cartWithProducts.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShoppingBag className="w-20 h-20 text-white/20 mx-auto mb-6" />
            <h1 className="text-3xl font-light mb-4">Your Cart is Empty</h1>
            <p className="text-white/60 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to={createPageUrl('Shop')}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gold text-black font-semibold tracking-wider inline-flex items-center gap-3"
              >
                START SHOPPING
                <ArrowRight className="w-5 h-5" />
              </motion.button>
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
          <span className="text-gold text-sm tracking-[0.3em] uppercase">Shopping</span>
          <h1 className="text-5xl font-light mt-4">Your Cart</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cartWithProducts.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 p-6 bg-[#1A1A1A] border border-white/5"
                >
                  {/* Image */}
                  <Link 
                    to={createPageUrl(`ProductDetail?id=${item.product_id}`)}
                    className="w-28 h-28 flex-shrink-0 overflow-hidden"
                  >
                    <img
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                      alt={item.product?.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white/50 text-xs tracking-wider uppercase">
                            {item.product?.brand || item.product?.category}
                          </p>
                          <Link 
                            to={createPageUrl(`ProductDetail?id=${item.product_id}`)}
                            className="text-lg font-medium hover:text-gold transition-colors"
                          >
                            {item.product?.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => removeItemMutation.mutate(item.id)}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      {item.size && (
                        <p className="text-white/40 text-sm mt-1">Size: {item.size}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-white/20">
                        <button
                          onClick={() => updateQuantityMutation.mutate({
                            id: item.id,
                            quantity: Math.max(1, (item.quantity || 1) - 1)
                          })}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/5"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantityMutation.mutate({
                            id: item.id,
                            quantity: (item.quantity || 1) + 1
                          })}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/5"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-gold font-semibold">
                        ${((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-32 h-fit"
          >
            <div className="bg-[#1A1A1A] border border-white/5 p-8">
              <h2 className="text-xl font-semibold tracking-wider mb-6">Order Summary</h2>

              <div className="space-y-4 pb-6 border-b border-white/10">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between py-6 text-lg font-semibold">
                <span>Total</span>
                <span className="text-gold">${total.toFixed(2)}</span>
              </div>

              {/* Free Shipping Banner */}
              {subtotal < 500 && (
                <div className="flex items-center gap-3 p-4 bg-gold/10 border border-gold/20 mb-6">
                  <Truck className="w-5 h-5 text-gold flex-shrink-0" />
                  <p className="text-sm">
                    Add <span className="text-gold font-semibold">${(500 - subtotal).toFixed(2)}</span> more for free shipping
                  </p>
                </div>
              )}

              <Link to={createPageUrl('Checkout')}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gold text-black font-semibold tracking-wider flex items-center justify-center gap-3 hover:bg-[#E8D5A3] transition-colors"
                >
                  PROCEED TO CHECKOUT
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link to={createPageUrl('Shop')}>
                <button className="w-full py-4 text-white/60 hover:text-gold text-sm mt-4 transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}