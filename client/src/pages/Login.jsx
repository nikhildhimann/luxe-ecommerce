import React, { useState } from 'react';
import { luxe } from '@/api/luxeClient';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await luxe.auth.login(email, password);
      // specific redirection logic or default to account/home
      const params = new URLSearchParams(window.location.search);
      const redirectRel = params.get('redirect');
      if (redirectRel) {
          window.location.href = redirectRel;
      } else {
          window.location.href = createPageUrl('Account');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
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
            <span className="text-gold text-sm tracking-[0.3em] uppercase">Welcome Back</span>
            <h1 className="text-3xl font-light mt-4 text-white">Sign In</h1>
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
              <div className="flex justify-between mb-2">
                <label className="block text-xs uppercase tracking-wider text-white/50">
                  Password
                </label>
                <a href="#" className="text-xs text-white/40 hover:text-gold transition-colors">
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-gold outline-none transition-colors placeholder-white/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black font-bold py-4 hover:bg-white transition-colors tracking-[0.2em] uppercase flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              Don't have an account?{' '}
              <Link to={createPageUrl('Register')} className="text-gold hover:text-white transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
