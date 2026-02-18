import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { luxe } from '@/api/luxeClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const [step, setStep] = useState('shipping');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    card_number: '',
    expiry: '',
    cvv: ''
  });

  const queryClient = useQueryClient();

  const { data: cartItems = [] } = useQuery({
    queryKey: ['cartItems'],
    queryFn: async () => {
      const isAuth = await luxe.auth.isAuthenticated();
      if (!isAuth) return [];
      return luxe.entities.CartItem.list();
    }
  });

  const { data: products = [] } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => luxe.entities.Product.list()
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const order = await luxe.entities.Order.create(orderData);
      // Clear cart
      for (const item of cartItems) {
        await luxe.entities.CartItem.delete(item.id);
      }
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 'shipping') {
      setStep('payment');
      return;
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    placeOrderMutation.mutate({
      order_number: orderNumber,
      items: cartWithProducts.map(item => ({
        product_id: item.product_id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0]
      })),
      subtotal,
      shipping,
      tax,
      total,
      status: 'pending',
      shipping_address: {
        full_name: formData.full_name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
        phone: formData.phone
      },
      payment_method: 'Credit Card'
    });
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-light mb-4">Order Confirmed!</h1>
            <p className="text-white/60 mb-8">
              Thank you for your purchase. We've sent a confirmation email with your order details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Account')}>
                <button className="px-8 py-4 bg-gold text-black font-semibold tracking-wider hover:bg-[#E8D5A3] transition-colors">
                  VIEW ORDERS
                </button>
              </Link>
              <Link to={createPageUrl('Shop')}>
                <button className="px-8 py-4 border border-white/30 font-semibold tracking-wider hover:border-gold hover:text-gold transition-colors">
                  CONTINUE SHOPPING
                </button>
              </Link>
            </div>
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
          <span className="text-gold text-sm tracking-[0.3em] uppercase">Secure</span>
          <h1 className="text-5xl font-light mt-4">Checkout</h1>
        </motion.div>

        {/* Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-gold' : 'text-white/40'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                step === 'shipping' ? 'border-gold' : 'border-white/20'
              }`}>
                1
              </div>
              <span className="text-sm">Shipping</span>
            </div>
            <div className="w-16 h-[1px] bg-white/20" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-gold' : 'text-white/40'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                step === 'payment' ? 'border-gold' : 'border-white/20'
              }`}>
                2
              </div>
              <span className="text-sm">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {step === 'shipping' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#1A1A1A] border border-white/5 p-8"
                >
                  <h2 className="text-xl font-semibold tracking-wider mb-6">Shipping Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="full_name" className="text-white/80">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        required
                        className="mt-2 bg-black border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white/80">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="mt-2 bg-black border-white/20 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone" className="text-white/80">Phone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        className="mt-2 bg-black border-white/20 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="text-white/80">Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required
                        className="mt-2 bg-black border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-white/80">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                        className="mt-2 bg-black border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-white/80">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        required
                        className="mt-2 bg-black border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal_code" className="text-white/80">Postal Code *</Label>
                      <Input
                        id="postal_code"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                        required
                        className="mt-2 bg-black border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-white/80">Country *</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        required
                        className="mt-2 bg-black border-white/20 text-white"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#1A1A1A] border border-white/5 p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-6 h-6 text-gold" />
                    <h2 className="text-xl font-semibold tracking-wider">Payment Details</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="card_number" className="text-white/80">Card Number *</Label>
                      <Input
                        id="card_number"
                        placeholder="1234 5678 9012 3456"
                        value={formData.card_number}
                        onChange={(e) => setFormData({...formData, card_number: e.target.value})}
                        required
                        className="mt-2 bg-black border-white/20 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="expiry" className="text-white/80">Expiry Date *</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                          required
                          className="mt-2 bg-black border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-white/80">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                          required
                          className="mt-2 bg-black border-white/20 text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-6 p-4 bg-green-500/10 border border-green-500/20">
                    <Lock className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-500">Your payment information is secure and encrypted</p>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                {step === 'payment' && (
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="px-8 py-4 border border-white/30 font-semibold tracking-wider hover:border-gold hover:text-gold transition-colors"
                  >
                    BACK
                  </button>
                )}
                <button
                  type="submit"
                  disabled={placeOrderMutation.isPending}
                  className="flex-1 px-8 py-4 bg-gold text-black font-semibold tracking-wider hover:bg-[#E8D5A3] transition-colors disabled:opacity-50"
                >
                  {step === 'shipping' ? 'CONTINUE TO PAYMENT' : 'PLACE ORDER'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-[#1A1A1A] border border-white/5 p-8">
              <h2 className="text-xl font-semibold tracking-wider mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartWithProducts.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.product?.images?.[0]}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product?.name}</p>
                      <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm text-gold">
                      ${(item.product?.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 py-6 border-t border-white/10">
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between pt-4 text-lg font-semibold border-t border-white/10">
                <span>Total</span>
                <span className="text-gold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}