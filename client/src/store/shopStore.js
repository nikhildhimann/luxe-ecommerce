import { create } from 'zustand';

export const useShopStore = create((set) => ({
  // Filter state
  filters: {
    categories: [],
    genders: [],
    priceRange: [0, 1000],
    minRating: 0,
    newArrivals: false,
    featured: false,
  },
  
  // Search state
  searchQuery: '',
  
  // Pagination state
  currentPage: 1,
  pageSize: 20,
  
  // UI state
  sortBy: '-created_date',
  viewType: 'grid', // 'grid' or 'list'
  
  // Update filters
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    currentPage: 1, // Reset to page 1 when filters change
  })),
  
  // Update search
  setSearchQuery: (query) => set({
    searchQuery: query,
    currentPage: 1, // Reset to page 1 when search changes
  }),
  
  // Update pagination
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
  
  // Update sorting
  setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),
  
  // Update view type
  setViewType: (type) => set({ viewType: type }),
  
  // Reset all filters
  resetFilters: () => set({
    filters: {
      categories: [],
      genders: [],
      priceRange: [0, 1000],
      minRating: 0,
      newArrivals: false,
      featured: false,
    },
    searchQuery: '',
    currentPage: 1,
    sortBy: '-created_date',
  }),
}));
