import React, { useState } from 'react';
import { luxe } from '@/api/luxeClient';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
    }

    try {
      await luxe.auth.register(name, email, password);
      // On success, redirect to account or home
      window.location.href = createPageUrl('Account');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-12">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1A1A] border border-white/5 p-8 md:p-10"
        >
          <div className="text-center mb-10">
            <span className="text-gold text-sm tracking-[0.3em] uppercase">Join Us</span>
            <h1 className="text-3xl font-light mt-4 text-white">Create Account</h1>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-gold outline-none transition-colors placeholder-white/20"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-gold outline-none transition-colors placeholder-white/20"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-gold outline-none transition-colors placeholder-white/20"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-gold outline-none transition-colors placeholder-white/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black font-bold py-4 hover:bg-white transition-colors tracking-[0.2em] uppercase flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              Already have an account?{' '}
              <Link to={createPageUrl('Login')} className="text-gold hover:text-white transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
