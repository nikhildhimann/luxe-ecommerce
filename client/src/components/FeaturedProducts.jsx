import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function FeaturedProducts({ products, title = "Featured Collection" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Group products by gender/category for display
  const groupedProducts = {
    boys: products.slice(0, 3),
    girls: products.slice(3, 6),
    shoes: products.slice(6, 8)
  };

  const getGroupLabel = (index) => {
    if (index < 3) return 'Boys Collection';
    if (index < 6) return 'Girls Collection';
    return 'Footwear';
  };

  return (
    <section ref={ref} className="py-24 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase">Curated Selection</span>
          <h2 className="text-4xl md:text-5xl font-light mt-4 mb-6">{title}</h2>
          <div className="w-24 h-[1px] bg-gold mx-auto" />
        </motion.div>

        {/* Boys Collection - 3 items */}
        {groupedProducts.boys.length > 0 && (
          <div className="mb-12">
            <h3 className="text-gold text-sm tracking-[0.2em] uppercase mb-6 font-semibold">Boys Collection</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {groupedProducts.boys.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Girls Collection - 3 items */}
        {groupedProducts.girls.length > 0 && (
          <div className="mb-12">
            <h3 className="text-gold text-sm tracking-[0.2em] uppercase mb-6 font-semibold">Girls Collection</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {groupedProducts.girls.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Footwear - 2 items */}
        {groupedProducts.shoes.length > 0 && (
          <div className="mb-12">
            <h3 className="text-gold text-sm tracking-[0.2em] uppercase mb-6 font-semibold">Footwear</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              {groupedProducts.shoes.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link to={createPageUrl('Shop')}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 px-8 py-4 border border-gold text-gold font-semibold tracking-wider hover:bg-gold hover:text-black transition-all"
            >
              VIEW ALL PRODUCTS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}