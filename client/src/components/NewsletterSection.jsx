import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast.success('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase">Stay Updated</span>
          <h2 className="text-4xl md:text-5xl font-light mt-4 mb-6">
            Join the <span className="text-gold">LUXE</span> Circle
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
            Be the first to discover new arrivals, exclusive offers, and style inspiration delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-6 py-4 bg-black border border-white/20 text-white placeholder-white/40 focus:border-gold outline-none transition-colors"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className={`px-8 py-4 font-semibold tracking-wider flex items-center justify-center gap-2 transition-all ${
                isSubmitted 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gold text-black hover:bg-[#E8D5A3]'
              }`}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-5 h-5" />
                  SUBSCRIBED
                </>
              ) : (
                <>
                  SUBSCRIBE
                  <Send className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-white/30 text-sm mt-6">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </motion.div>
      </div>
    </section>
  );
}