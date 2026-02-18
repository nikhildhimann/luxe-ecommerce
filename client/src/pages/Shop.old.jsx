import React, { useState, useEffect } from 'react';
import { luxe } from '@/api/luxeClient';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  SlidersHorizontal, 
  Grid3X3, 
  LayoutGrid, 
  X,
  ChevronDown
} from 'lucide-react';

const categories = ['clothing', 'footwear'];
const sortOptions = [
  { label: 'Newest', value: '-created_date' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Best Sellers', value: '-rating' }
];

export default function Shop() {
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 10000],
    newArrivals: false,
    onSale: false
  });
  const [sortBy, setSortBy] = useState('-created_date');
  const [gridCols, setGridCols] = useState(4);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Get category from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category) {
      // Case-insensitive category match
      const matchedCategory = categories.find(
        cat => cat.toLowerCase() === category.toLowerCase()
      );
      if (matchedCategory) {
        setFilters(prev => ({ ...prev, categories: [matchedCategory] }));
      }
    }
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => luxe.entities.Product.list('-created_date', 3000) // Load all products
  });

  const filteredProducts = products.filter(product => {
    if (filters.categories.length > 0) {
      const productCategoryLower = (product.category || '').toLowerCase();
      const hasCategoryMatch = filters.categories.some(
        cat => cat.toLowerCase() === productCategoryLower
      );
      if (!hasCategoryMatch) {
        return false;
      }
    }
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    if (filters.newArrivals && !product.new_arrival) {
      return false;
    }
    if (filters.onSale && (!product.original_price || product.original_price <= product.price)) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (a.price || 0) - (b.price || 0);
      case '-price':
        return (b.price || 0) - (a.price || 0);
      case '-rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const toggleCategory = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase">Discover</span>
          <h1 className="text-5xl md:text-6xl font-light mt-4">Our Collection</h1>
        </motion.div>
      </div>

      {/* Toolbar */}
      <div className="border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {(filters.categories.length > 0 || filters.newArrivals || filters.onSale) && (
              <span className="w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center">
                {filters.categories.length + (filters.newArrivals ? 1 : 0) + (filters.onSale ? 1 : 0)}
              </span>
            )}
          </motion.button>

          {/* Product Count */}
          <span className="text-white/50 text-sm">
            {filteredProducts.length} Products
          </span>

          {/* Right Controls */}
          <div className="flex items-center gap-6">
            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors"
              >
                <span className="hidden sm:inline text-sm">Sort by</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-white/10 z-50"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors ${
                          sortBy === option.value ? 'text-gold' : 'text-white/80'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grid Toggle */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 transition-colors ${gridCols === 3 ? 'text-gold' : 'text-white/40 hover:text-white'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-2 transition-colors ${gridCols === 4 ? 'text-gold' : 'text-white/40 hover:text-white'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-12">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 280 }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="w-[280px] space-y-8">
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-semibold tracking-[0.2em] uppercase mb-4">Categories</h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <Checkbox
                            checked={filters.categories.some(
                              cat => cat.toLowerCase() === category.toLowerCase()
                            )}
                            onCheckedChange={() => toggleCategory(category)}
                            className="border-white/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                          />
                          <span className="text-white/70 capitalize group-hover:text-white transition-colors">
                            {category.replace(/'/g, '')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="text-sm font-semibold tracking-[0.2em] uppercase mb-4">Price Range</h3>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                      max={10000}
                      step={100}
                      className="mt-6"
                    />
                    <div className="flex justify-between mt-4 text-sm text-white/60">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div>
                    <h3 className="text-sm font-semibold tracking-[0.2em] uppercase mb-4">Filter By</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox
                          checked={filters.newArrivals}
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, newArrivals: checked }))}
                          className="border-white/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                        />
                        <span className="text-white/70 group-hover:text-white transition-colors">
                          New Arrivals
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox
                          checked={filters.onSale}
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, onSale: checked }))}
                          className="border-white/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                        />
                        <span className="text-white/70 group-hover:text-white transition-colors">
                          On Sale
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={() => setFilters({
                      categories: [],
                      priceRange: [0, 10000],
                      newArrivals: false,
                      onSale: false
                    })}
                    className="text-gold text-sm hover:underline"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-white/5 rounded" />
                    <div className="mt-4 h-4 bg-white/5 rounded w-2/3 mx-auto" />
                    <div className="mt-2 h-4 bg-white/5 rounded w-1/3 mx-auto" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-white/60 text-lg">No products found</p>
                <button
                  onClick={() => setFilters({
                    categories: [],
                    priceRange: [0, 10000],
                    newArrivals: false,
                    onSale: false
                  })}
                  className="mt-4 text-gold hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <div className={`grid grid-cols-2 md:grid-cols-3 ${showFilters ? '' : `lg:grid-cols-${gridCols}`} gap-6`}
                   style={{ gridTemplateColumns: showFilters ? undefined : `repeat(${gridCols}, minmax(0, 1fr))` }}
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}