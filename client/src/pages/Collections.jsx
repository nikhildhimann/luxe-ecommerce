import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    id: 1,
    title: 'Fashion Collection',
    subtitle: 'Apparel',
    description: 'Discover our exclusive clothing collection featuring trendy tops, dresses, and bottoms',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
    category: 'clothing'
  },
  {
    id: 2,
    title: 'Footwear Collection',
    subtitle: 'Shoes',
    description: 'Step into style with our curated selection of casual shoes, sports shoes, and formal footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200',
    category: 'footwear'
  }
];

export default function Collections() {
  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
          alt="Collections"
          className="w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
        >
          <span className="text-gold text-sm tracking-[0.4em] uppercase mb-4">Curated</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6">Our Collections</h1>
          <p className="text-white/60 text-lg max-w-xl">
            Explore our carefully curated selections of luxury items
          </p>
        </motion.div>
      </div>

      {/* Collections */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="space-y-32">
          {collections.map((collection, index) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CollectionSection({ collection, index }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}
    >
      {/* Image */}
      <div className={`relative aspect-[4/5] overflow-hidden ${isEven ? '' : 'lg:col-start-2'}`}>
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          src={collection.image}
          alt={collection.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className={`${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase">
            {collection.subtitle}
          </span>
          <h2 className="text-4xl md:text-5xl font-light mt-4 mb-6">
            {collection.title}
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-8">
            {collection.description}
          </p>
          <Link to={createPageUrl(`Shop?category=${collection.category}`)}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-black font-semibold tracking-wider hover:bg-[#E8D5A3] transition-colors"
            >
              EXPLORE COLLECTION
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}