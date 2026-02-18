import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Globe, Heart, Code, GraduationCap, School, User } from 'lucide-react';

const stats = [
  { icon: Award, value: '25+', label: 'Years of Excellence' },
  { icon: Users, value: '100K+', label: 'Happy Customers' },
  { icon: Globe, value: '50+', label: 'Countries Worldwide' },
  { icon: Heart, value: '500+', label: 'Luxury Brands' }
];

const values = [
  {
    title: 'Quality',
    description: 'We source only the finest materials and work with master artisans to ensure every piece meets our exacting standards.'
  },
  {
    title: 'Authenticity',
    description: 'Every product is guaranteed authentic, with certificates of authenticity and full traceability.'
  },
  {
    title: 'Sustainability',
    description: 'We are committed to ethical sourcing and sustainable practices throughout our supply chain.'
  },
  {
    title: 'Service',
    description: 'Our dedicated team provides personalized service and support to ensure your complete satisfaction.'
  }
];

const developers = [
  {
    name: 'Harshdeep Bansal',
    classRoll: '23BCA105',
    uniRoll: '6231650043',
    role: 'Lead Developer',
    color: 'from-amber-500 to-orange-600'
  },
  {
    name: 'Sourav',
    classRoll: '23BCA068',
    uniRoll: '6231650098',
    role: 'Backend Developer',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    name: 'Amanpreet Singh',
    classRoll: '23BCA095',
    uniRoll: '6231650010',
    role: 'UI/UX Designer',
    color: 'from-purple-500 to-pink-600'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function About() {
  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Hero */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
          alt="About LUXE"
          className="w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
        >
          <span className="text-gold text-sm tracking-[0.4em] uppercase mb-4">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-light mb-6">About LUXE</h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Crafting luxury experiences since 2001
          </p>
        </motion.div>
      </div>

      {/* Mission */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-8">
              We believe luxury is more than just a product—
              <span className="block text-gold mt-2">it's an experience, a statement, a way of life.</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              For over two decades, LUXE has been at the forefront of luxury retail, curating the world's most 
              prestigious brands and creating unforgettable shopping experiences. Our commitment to excellence, 
              authenticity, and personalized service has made us a trusted destination for discerning customers worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 border border-gold/30 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-gold" />
                  </div>
                  <div className="text-4xl font-light text-gold mb-2">{stat.value}</div>
                  <div className="text-white/60">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold text-sm tracking-[0.3em] uppercase">Our Values</span>
            <h2 className="text-4xl md:text-5xl font-light mt-4">What We Stand For</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black border border-white/5 p-8 hover:border-gold/30 transition-colors"
              >
                <h3 className="text-2xl font-light text-gold mb-4">{value.title}</h3>
                <p className="text-white/60 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Image */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="text-gold text-sm tracking-[0.3em] uppercase">Join Us</span>
              <h2 className="text-4xl font-light mt-4 mb-6">
                Experience luxury redefined
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                Visit our flagship store or explore our collection online. Our expert stylists are 
                ready to help you find the perfect pieces that reflect your unique taste and style.
              </p>
              <p className="text-white/60 leading-relaxed">
                Whether you're looking for a timeless investment piece or the latest fashion-forward 
                design, LUXE offers an unparalleled selection of the world's most coveted luxury brands.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative aspect-square overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
                alt="LUXE Store"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-gold/20" />
            </motion.div>
          </div>
        </div>
      </section>

       </div>
  );
}