import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { luxe } from '@/api/luxeClient';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, LayoutGrid, X, ChevronDown } from 'lucide-react';
import { useShopStore } from '../store/shopStore';
import FilterPanel from '../components/FilterPanel';
import DebouncedSearch from '../components/DebouncedSearch';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductSkeleton';

const ShopPageOptimized = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  // Get all filter and search state from Zustand store
  const {
    filters,
    searchQuery,
    currentPage,
    pageSize,
    sortBy,
    setCurrentPage,
    setPageSize,
    setSortBy
  } = useShopStore();

  // Get available categories and genders from first query
  const { data: allProducts = [] } = useQuery({
    queryKey: ['all-products-list'],
    queryFn: () => luxe.entities.Product.list('-created_date', 3000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Memoized available filters
  const { availableCategories, availableGenders } = useMemo(() => {
    const categories = [...new Set(allProducts.map(p => p.category))].sort();
    const genders = [...new Set(allProducts.map(p => p.gender))].filter(Boolean).sort();
    return { availableCategories: categories, availableGenders: genders };
  }, [allProducts]);

  // Paginated query with all filters
  const { data: paginatedData = { data: [], pagination: {} }, isLoading, isFetching, isPreviousData } = useQuery({
    queryKey: [
      'products-paginated',
      currentPage,
      pageSize,
      searchQuery,
      JSON.stringify(filters),
      sortBy
    ],
    queryFn: () => luxe.entities.Product.listPaginated({
      page: currentPage,
      limit: pageSize,
      search: searchQuery,
      category: filters.categories,
      gender: filters.genders,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      minRating: filters.minRating,
      sort: sortBy,
      newArrivals: filters.newArrivals,
      featured: filters.featured
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
  });

  const products = paginatedData.data || [];
  const pagination = paginatedData.pagination || {};

  // Sort options
  const sortOptions = [
    { label: 'Newest', value: '-created_date' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
    { label: 'Best Sellers', value: '-rating' }
  ];

  // Handle search
  const handleSearch = useCallback((query) => {
    // Search is handled through the store
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentPage]);

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

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <DebouncedSearch onSearch={handleSearch} placeholder="Search products by name, color, type..." />
      </div>

      {/* Toolbar */}
      <div className="border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {Object.values(filters).some(v => {
              if (Array.isArray(v)) return v.length > 0;
              if (typeof v === 'boolean') return v;
              return false;
            }) && (
              <span className="w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center">
                {Object.values(filters).reduce((count, v) => {
                  if (Array.isArray(v)) return count + v.length;
                  if (typeof v === 'boolean') return count + (v ? 1 : 0);
                  return count;
                }, 0)}
              </span>
            )}
          </motion.button>

          {/* Product Count */}
          <span className="text-white/50 text-sm">
            {pagination.total || 0} Products
            {searchQuery && ` (search: "${searchQuery}")`}
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <AnimatePresence mode="wait">
            {showFilters && (
              <FilterPanel
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                availableCategories={availableCategories}
                availableGenders={availableGenders}
              />
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <ProductGridSkeleton count={pageSize} />
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-white/60 text-lg mb-4">No products found</p>
                <button
                  onClick={() => {
                    setCurrentPage(1);
                  }}
                  className="text-gold hover:underline"
                >
                  Try adjusting your filters
                </button>
              </motion.div>
            ) : (
              <>
                {/* Mixed Product Display - Girls & Other Pattern */}
                <div className="space-y-12">
                  {(() => {
                    // Separate products: Girls and Other
                    const girls = products.filter(p => p.gender === 'Girls');
                    const other = products.filter(p => p.gender !== 'Girls');

                    // Create interleaved display: 4 girls, 4 other, repeat
                    const sections = [];
                    const itemsPerSection = 4;
                    
                    const maxIndex = Math.max(
                      Math.ceil(girls.length / itemsPerSection),
                      Math.ceil(other.length / itemsPerSection)
                    );

                    for (let i = 0; i < maxIndex; i++) {
                      // Girls section
                      const girlsStart = i * itemsPerSection;
                      const girlsItems = girls.slice(girlsStart, girlsStart + itemsPerSection);
                      
                      if (girlsItems.length > 0) {
                        sections.push({
                          key: `girls-${i}`,
                          label: i === 0 ? 'Girls Collection' : 'Girls Collection (Cont.)',
                          items: girlsItems
                        });
                      }

                      // Other section
                      const otherStart = i * itemsPerSection;
                      const otherItems = other.slice(otherStart, otherStart + itemsPerSection);
                      
                      if (otherItems.length > 0) {
                        sections.push({
                          key: `other-${i}`,
                          label: i === 0 ? 'Other' : 'Other (Cont.)',
                          items: otherItems
                        });
                      }
                    }

                    return sections.map((section) => (
                      <div key={section.key}>
                        <h3 className="text-gold text-sm tracking-[0.2em] uppercase mb-4 font-semibold">
                          {section.label}
                        </h3>
                        <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: `repeat(${showFilters ? 3 : 4}, minmax(0, 1fr))` }}>
                          {section.items.map((product, idx) => (
                            <motion.div
                              key={product._id || product.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                              className={isPreviousData ? 'opacity-50' : ''}
                            >
                              <ProductCard product={product} index={idx} />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-4 py-2 border border-white/20 text-white/80 hover:border-gold hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center border transition-colors ${
                            currentPage === pageNum
                              ? 'bg-gold text-black border-gold'
                              : 'border-white/20 text-white/80 hover:border-gold hover:text-gold'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {pagination.totalPages > 5 && (
                      <span className="text-white/50">...</span>
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 border border-white/20 text-white/80 hover:border-gold hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>

                    <span className="text-white/50 text-sm ml-4">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPageOptimized;
