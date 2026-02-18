import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  {
    name: 'Watches',
    slug: 'watches',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
    description: 'Timeless Precision'
  },
  {
    name: 'Bags',
    slug: 'bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
    description: 'Crafted Excellence'
  },
  {
    name: 'Jewelry',
    slug: 'jewelry',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    description: 'Radiant Beauty'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800',
    description: 'Finishing Touches'
  }
];

export default function CategoryShowcase() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase">Explore</span>
          <h2 className="text-4xl md:text-5xl font-light mt-4 mb-6">Shop by Category</h2>
          <div className="w-24 h-[1px] bg-gold mx-auto" />
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.slug} 
              category={category} 
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category, index, scrollYProgress }) {
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? 50 : -50, index % 2 === 0 ? -50 : 50]
  );

  return (
    <Link to={createPageUrl(`Shop?category=${category.slug}`)}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: index * 0.15 }}
        viewport={{ once: true }}
        className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
      >
        <motion.div style={{ y }} className="absolute inset-0">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <motion.span 
            className="text-gold text-sm tracking-[0.2em] uppercase mb-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {category.description}
          </motion.span>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl md:text-4xl font-light group-hover:text-gold transition-colors">
              {category.name}
            </h3>
            <motion.div
              className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center group-hover:border-gold group-hover:bg-gold transition-all"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowUpRight className="w-5 h-5 group-hover:text-black transition-colors" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}