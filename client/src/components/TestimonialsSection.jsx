import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Alexandra Chen',
    title: 'Fashion Director',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    text: 'LUXE has completely transformed my wardrobe. The quality and attention to detail in every piece is simply unmatched. This is luxury redefined.',
    rating: 5
  },
  {
    id: 2,
    name: 'Marcus Sterling',
    title: 'Art Collector',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    text: 'The craftsmanship speaks for itself. Every item I\'ve purchased has become a treasured piece in my collection. Exceptional quality.',
    rating: 5
  },
  {
    id: 3,
    name: 'Isabella Romano',
    title: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    text: 'From the elegant packaging to the exquisite products, LUXE delivers an experience that goes beyond shopping. It\'s pure sophistication.',
    rating: 5
  }
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <Quote className="absolute top-20 left-20 w-64 h-64 text-gold" />
        <Quote className="absolute bottom-20 right-20 w-64 h-64 text-gold rotate-180" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-light mt-4 mb-6">What Our Clients Say</h2>
          <div className="w-24 h-[1px] bg-gold mx-auto" />
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              {/* Avatar */}
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gold">
                  <img
                    src={testimonials[current].image}
                    alt={testimonials[current].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xl md:text-2xl text-white/80 italic leading-relaxed mb-8">
                "{testimonials[current].text}"
              </p>

              {/* Author */}
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {testimonials[current].name}
                </h4>
                <p className="text-gold text-sm tracking-wider">
                  {testimonials[current].title}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prev}
              className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
              className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === current ? 'bg-gold w-8' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}