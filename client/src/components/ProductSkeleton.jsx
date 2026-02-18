import React from 'react';
import { motion } from 'framer-motion';

export const ProductSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Image skeleton */}
      <div className="aspect-[3/4] bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded overflow-hidden">
        <div className="w-full h-full animate-shimmer" />
      </div>

      {/* Title skeleton */}
      <div className="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-3/4 animate-shimmer" />

      {/* Brand skeleton */}
      <div className="h-3 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-1/2 animate-shimmer" />

      {/* Price skeleton */}
      <div className="h-5 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-1/3 animate-shimmer" />

      {/* Rating skeleton */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded animate-shimmer" />
        ))}
      </div>
    </motion.div>
  );
};

export const ProductGridSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};
