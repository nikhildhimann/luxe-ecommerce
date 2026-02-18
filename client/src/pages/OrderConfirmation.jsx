import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Mail } from 'lucide-react';

export default function OrderConfirmation() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderNumber = urlParams.get('order') || 'ORD-XXXXX';

  return (
    <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-24 h-24 mx-auto mb-8 bg-gold/20 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-gold" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-light mb-4">Thank You!</h1>
          <p className="text-white/60 text-lg mb-8">
            Your order has been successfully placed
          </p>

          <div className="bg-[#1A1A1A] border border-white/10 p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Package className="w-6 h-6 text-gold" />
              <span className="text-gold tracking-wider">Order Number</span>
            </div>
            <p className="text-2xl font-mono tracking-wider">{orderNumber}</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-white/60 mb-8">
            <Mail className="w-5 h-5" />
            <p className="text-sm">
              A confirmation email has been sent to your email address
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Account')}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-white/20 text-white hover:border-gold hover:text-gold transition-colors"
              >
                VIEW ORDER STATUS
              </motion.button>
            </Link>
            <Link to={createPageUrl('Shop')}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gold text-black font-semibold tracking-wider flex items-center gap-3 hover:bg-[#E8D5A3] transition-colors"
              >
                CONTINUE SHOPPING
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}