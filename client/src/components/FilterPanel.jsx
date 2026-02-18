import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { useShopStore } from '../store/shopStore';

const FilterPanel = memo(({ isOpen, onClose, availableCategories = [], availableGenders = [] }) => {
  const {
    filters,
    setFilters,
    resetFilters
  } = useShopStore();

  const handleCategoryToggle = (category) => {
    const updated = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setFilters({ categories: updated });
  };

  const handleGenderToggle = (gender) => {
    const updated = filters.genders.includes(gender)
      ? filters.genders.filter(g => g !== gender)
      : [...filters.genders, gender];
    setFilters({ genders: updated });
  };

  const handlePriceChange = (value) => {
    setFilters({ priceRange: value });
  };

  const activeFiltersCount = useMemo(() => {
    return (
      filters.categories.length +
      filters.genders.length +
      (filters.newArrivals ? 1 : 0) +
      (filters.featured ? 1 : 0) +
      ((filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) ? 1 : 0)
    );
  }, [filters]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20, width: 0 }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20, width: isOpen ? 280 : 0 }}
      exit={{ opacity: 0, x: -20, width: 0 }}
      className="flex-shrink-0 overflow-hidden border-r border-white/10"
    >
      <div className="w-[280px] space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 bg-gold text-black text-xs font-bold rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <button onClick={onClose} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        {availableCategories.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase mb-4">Categories</h3>
            <div className="space-y-3">
              {availableCategories.map((category) => (
                <label key={category} className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                    className="border-white/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                  />
                  <span className="text-white/70 capitalize group-hover:text-white transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Gender */}
        {availableGenders.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase mb-4">Gender</h3>
            <div className="space-y-3">
              {availableGenders.map((gender) => (
                <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={filters.genders.includes(gender)}
                    onCheckedChange={() => handleGenderToggle(gender)}
                    className="border-white/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                  />
                  <span className="text-white/70 group-hover:text-white transition-colors">
                    {gender}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em] uppercase mb-4">Price Range</h3>
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            max={10000}
            step={50}
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
                onCheckedChange={(checked) => setFilters({ newArrivals: checked })}
                className="border-white/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <span className="text-white/70 group-hover:text-white transition-colors">
                New Arrivals
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={filters.featured}
                onCheckedChange={(checked) => setFilters({ featured: checked })}
                className="border-white/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <span className="text-white/70 group-hover:text-white transition-colors">
                Featured
              </span>
            </label>
          </div>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </motion.aside>
  );
});

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;
