import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middlewares/error.middleware.js';

// Import route modules
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/products/product.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import orderRoutes from './modules/orders/order.routes.js';
import wishlistRoutes from './modules/wishlist/wishlist.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Global rate limiting (lenient)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Increased from 1000 to 5000 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  skip: (req) => process.env.NODE_ENV === 'development', // Disable rate limiting for development
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  },
});

// Auth rate limiting (more lenient for development)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased from 50 to 500 auth requests per windowMs
  message: 'Too many login/register attempts, please try again after 15 minutes',
  skip: (req) => process.env.NODE_ENV === 'development', // Disable rate limiting for development
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many authentication attempts. Please wait before trying again.' });
  },
});

app.use(globalLimiter);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files from public directory (product images)
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

export default app;
