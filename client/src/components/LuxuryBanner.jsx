import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

export default function LuxuryBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #C9A050 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated Text Marquee */}
      <div className="mb-20 overflow-hidden">
        <motion.div style={{ x: x1 }} className="flex whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-[150px] font-bold text-white/5 mx-8">
              LUXURY
            </span>
          ))}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold text-gold" />
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">
              Experience
              <span className="block text-gold">Unparalleled</span>
              Craftsmanship
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg">
              Each piece in our collection represents the pinnacle of artisanal excellence, 
              meticulously crafted by master artisans using only the finest materials.
            </p>
            <Link to={createPageUrl('About')}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-black font-semibold tracking-wider hover:bg-[#E8D5A3] transition-colors"
              >
                DISCOVER MORE
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
                alt="Luxury Fashion"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-gold/20" />
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold rounded-full flex flex-col items-center justify-center text-black"
            >
              <span className="text-3xl font-bold">25+</span>
              <span className="text-xs tracking-wider">YEARS</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Marquee */}
      <div className="mt-20 overflow-hidden">
        <motion.div style={{ x: x2 }} className="flex whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-[150px] font-bold text-white/5 mx-8">
              STYLE
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}