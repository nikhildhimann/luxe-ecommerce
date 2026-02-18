import React, { useState } from 'react';
import { luxe } from '@/api/luxeClient';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { createPageUrl } from '../utils';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  LogOut, 
  Package,
  Truck,
  CheckCircle
} from 'lucide-react';

export default function Account() {
  const [activeTab, setActiveTab] = useState('orders');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const isAuth = await luxe.auth.isAuthenticated();
      if (!isAuth) {
        luxe.auth.redirectToLogin(createPageUrl('Account'));
        return null;
      }
      return luxe.auth.me();
    }
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['userOrders'],
    queryFn: () => luxe.entities.Order.list('-created_date', 50),
    enabled: !!user
  });

  const handleLogout = () => {
    luxe.auth.logout(createPageUrl('Home'));
  };

  const tabs = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    processing: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
    delivered: 'bg-green-500/20 text-green-500 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-500 border-red-500/30'
  };

  const statusIcons = {
    pending: Package,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: ShoppingBag
  };

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase">Welcome Back</span>
          <h1 className="text-5xl font-light mt-4">{user?.full_name || 'My Account'}</h1>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] border border-white/5 p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-gold" />
                </div>
                <h3 className="text-lg font-semibold">{user?.full_name}</h3>
                <p className="text-white/50 text-sm">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gold/10 text-gold border-l-2 border-gold'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-white/60 hover:text-red-500 hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-[#1A1A1A] border border-white/5 p-8">
                  <h2 className="text-2xl font-semibold mb-6">Order History</h2>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
                      <p className="text-white/60">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => {
                        const StatusIcon = statusIcons[order.status];
                        return (
                          <div
                            key={order.id}
                            className="border border-white/10 p-6 hover:border-gold/30 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-sm text-white/50">Order #{order.order_number}</p>
                                <p className="text-xs text-white/40 mt-1">
                                  {new Date(order.created_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className={`flex items-center gap-2 px-3 py-1 border ${statusColors[order.status]}`}>
                                <StatusIcon className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase">
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-3 mb-4">
                              {order.items?.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                  <img
                                    src={item.image}
                                    alt={item.product_name}
                                    className="w-16 h-16 object-cover"
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{item.product_name}</p>
                                    <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                                  </div>
                                  <span className="text-sm text-gold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                              {order.items?.length > 2 && (
                                <p className="text-xs text-white/40">
                                  +{order.items.length - 2} more items
                                </p>
                              )}
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                              <span className="text-white/60">Total</span>
                              <span className="text-gold font-semibold text-lg">
                                ${order.total?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-[#1A1A1A] border border-white/5 p-8">
                  <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-white/50">Full Name</label>
                      <p className="text-lg mt-1">{user?.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-white/50">Email</label>
                      <p className="text-lg mt-1">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-white/50">Role</label>
                      <p className="text-lg mt-1 capitalize">{user?.role}</p>
                    </div>
                    <div>
                      <label className="text-sm text-white/50">Member Since</label>
                      <p className="text-lg mt-1">
                        {new Date(user?.created_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}