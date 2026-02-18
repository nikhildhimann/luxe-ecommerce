import Product from '../../models/Product.js';
import asyncHandler from '../../middlewares/asyncHandler.js';

// Simple fuzzy search helper
const fuzzySearch = (text, pattern) => {
  const patternLower = pattern.toLowerCase();
  const textLower = text.toLowerCase();
  let patternIdx = 0;
  
  for (let i = 0; i < textLower.length; i++) {
    if (textLower[i] === patternLower[patternIdx]) {
      patternIdx++;
    }
  }
  
  return patternIdx === pattern.length;
};

// @desc    Fetch products with pagination, filtering, and search
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(Number(req.query.limit) || 20, 100); // Max 100 per page
  const skip = (page - 1) * pageSize;
  
  // Build filter query
  let filterQuery = {};
  
  // Search by name or description
  if (req.query.search) {
    const searchPattern = req.query.search.trim();
    filterQuery.$or = [
      { name: { $regex: searchPattern, $options: 'i' } },
      { description: { $regex: searchPattern, $options: 'i' } },
      { productType: { $regex: searchPattern, $options: 'i' } },
      { colour: { $regex: searchPattern, $options: 'i' } }
    ];
  }

  // Category filter
  if (req.query.category) {
    const categories = Array.isArray(req.query.category) 
      ? req.query.category 
      : [req.query.category];
    
    filterQuery.category = { $in: categories.map(c => c.toLowerCase()) };
  }

  // Gender filter
  if (req.query.gender) {
    const genders = Array.isArray(req.query.gender) 
      ? req.query.gender 
      : [req.query.gender];
    
    filterQuery.gender = { $in: genders };
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filterQuery.price = {};
    if (req.query.minPrice) filterQuery.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filterQuery.price.$lte = Number(req.query.maxPrice);
  }

  // Rating filter
  if (req.query.minRating) {
    filterQuery.rating = { $gte: Number(req.query.minRating) };
  }

  // New arrivals only
  if (req.query.newArrivals === 'true') {
    filterQuery.new_arrival = true;
  }

  // Featured only
  if (req.query.featured === 'true') {
    filterQuery.featured = true;
  }

  // Sorting
  let sortQuery = {};
  if (req.query.sort) {
    const sortBy = req.query.sort.startsWith('-') 
      ? { [req.query.sort.slice(1)]: -1 }
      : { [req.query.sort]: 1 };
    sortQuery = sortBy;
  } else {
    sortQuery = { created_date: -1 };
  }

  // Get total count for pagination
  const total = await Product.countDocuments(filterQuery);

  // Fetch products with pagination
  // Note: We intentionally avoid `.lean()` here so that Mongoose virtuals
  // like `id` are included in the JSON response for the frontend.
  const products = await Product.find(filterQuery)
    .sort(sortQuery)
    .skip(skip)
    .limit(pageSize)
    .exec();

  // Return paginated response
  res.json({
    data: products,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: page * pageSize < total,
      hasPrevPage: page > 1
    },
    meta: {
      searchQuery: req.query.search || null,
      filters: {
        categories: req.query.category,
        genders: req.query.gender,
        priceRange: req.query.minPrice || req.query.maxPrice ? { min: req.query.minPrice, max: req.query.maxPrice } : null
      }
    }
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
