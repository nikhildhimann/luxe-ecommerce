import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { luxe } from '@/api/luxeClient';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Search,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook
} from 'lucide-react';

import { useAuth } from './lib/AuthContext';

export default function Layout({ children, currentPageName }) {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { data: cartItems = [] } = useQuery({
    queryKey: ['cartItems'],
    queryFn: async () => {
      try {
        const isAuth = await luxe.auth.isAuthenticated();
        if (!isAuth) return [];
        return luxe.entities.CartItem.list();
      } catch {
        return [];
      }
    }
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', page: 'Home' },
    { name: 'Shop', page: 'Shop' },
    { name: 'Collections', page: 'Collections' },
    { name: 'About', page: 'About' },
    { name: 'Development Team', page: 'DevelopmentTeam' },
  ];

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        :root {
          --color-gold: #C9A050;
          --color-gold-light: #E8D5A3;
          --color-dark: #0A0A0A;
          --color-dark-lighter: #1A1A1A;
        }
        
        body {
          background-color: #000;
          color: #fff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .text-gold { color: var(--color-gold); }
        .bg-gold { background-color: var(--color-gold); }
        .border-gold { border-color: var(--color-gold); }
        
        .luxury-gradient {
          background: linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%);
        }
        
        .gold-gradient {
          background: linear-gradient(135deg, #C9A050 0%, #E8D5A3 50%, #C9A050 100%);
        }
        
        .glass-effect {
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .smooth-scroll {
          scroll-behavior: smooth;
        }
        
        ::selection {
          background-color: var(--color-gold);
          color: #000;
        }
      `}</style>

      {/* Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass-effect border-b border-white/10' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center">
              <motion.span 
                className="text-2xl font-bold tracking-[0.3em] text-gold"
                whileHover={{ scale: 1.05 }}
              >
                LUXE
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-12">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="relative group"
                >
                  <span className={`text-sm tracking-[0.2em] uppercase transition-colors duration-300 ${
                    currentPageName === link.page ? 'text-gold' : 'text-white/80 hover:text-white'
                  }`}>
                    {link.name}
                  </span>
                  <span className={`absolute -bottom-1 left-0 h-[1px] bg-gold transition-all duration-300 ${
                    currentPageName === link.page ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>

          {isAuthenticated ? (
            <>

              <Link to={createPageUrl('Wishlist')}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Heart className="w-5 h-5 text-white/80 hover:text-white transition-colors" />
                </motion.div>
              </Link>

              <Link to={createPageUrl('Cart')} className="relative">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <ShoppingBag className="w-5 h-5 text-white/80 hover:text-white transition-colors" />
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              <Link to={createPageUrl('Account')}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <User className="w-5 h-5 text-white/80 hover:text-white transition-colors" />
                </motion.div>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Login')}>
                <button className="text-sm font-medium hover:text-gold transition-colors">
                  LOGIN
                </button>
              </Link>
              <Link to={createPageUrl('Register')}>
                <button className="px-4 py-2 bg-white text-black text-xs font-bold tracking-wider hover:bg-gold transition-colors">
                  REGISTER
                </button>
              </Link>
            </div>
          )}

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass-effect border-t border-white/10"
            >
              <nav className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-lg tracking-[0.15em] uppercase text-white/80 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] glass-effect flex items-center justify-center"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl px-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full bg-transparent border-b-2 border-white/30 focus:border-gold py-4 text-2xl text-white placeholder-white/40 outline-none transition-colors"
                  autoFocus
                />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
              </div>
              <button 
                onClick={() => setSearchOpen(false)}
                className="absolute top-6 right-6 text-white/60 hover:text-white"
              >
                <X className="w-8 h-8" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold tracking-[0.3em] text-gold mb-6">LUXE</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Discover the finest in luxury fashion and accessories. Curated collections for the discerning individual.
              </p>
              <div className="flex space-x-4">
                <motion.a whileHover={{ scale: 1.1, y: -2 }} href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                  <Instagram className="w-4 h-4" />
                </motion.a>
                <motion.a whileHover={{ scale: 1.1, y: -2 }} href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                  <Twitter className="w-4 h-4" />
                </motion.a>
                <motion.a whileHover={{ scale: 1.1, y: -2 }} href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                  <Facebook className="w-4 h-4" />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold tracking-[0.2em] uppercase mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Shop All', 'New Arrivals', 'Best Sellers', 'Sale'].map((link) => (
                  <li key={link}>
                    <Link to={createPageUrl('Shop')} className="text-white/60 hover:text-gold text-sm transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-sm font-semibold tracking-[0.2em] uppercase mb-6">Customer Service</h4>
              <ul className="space-y-3">
                {['Contact Us', 'Shipping Info', 'Returns', 'FAQ'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/60 hover:text-gold text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold tracking-[0.2em] uppercase mb-6">Contact</h4>
              <div className="space-y-4">
                <a href="tel:+917876*****" className="flex items-center space-x-3 text-white/60 hover:text-gold transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+91 787675****</span>
                </a>
                <a href="mailto:stackron@gmail.com" className="flex items-center space-x-3 text-white/60 hover:text-gold transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">stackron@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/40 text-sm">
              Developed by <span className="text-gold">Stackron</span>
            </p>
            <p className="text-white/40 text-xs mt-4 md:mt-0">
              © 2026 LUXE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}