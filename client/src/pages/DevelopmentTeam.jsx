import React from 'react';
import { motion } from 'framer-motion';
import { Code, GraduationCap, School, User, Github, Linkedin, Mail, Award, Zap, Target } from 'lucide-react';

const developers = [
  {
    name: 'Harshdeep Bansal',
    classRoll: '23BCA105',
    uniRoll: '6231650043',
    role: 'Lead Developer',
    color: 'from-amber-500 to-orange-600',
    specialization: 'Full-Stack Development',
    skills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'JavaScript'],
    bio: 'Passionate full-stack developer with expertise in modern web technologies. Led the architecture and implementation of the entire LUXE e-commerce platform.',
    achievements: [
      'Architected scalable MongoDB schema',
      'Implemented real-time cart management',
      'Optimized API performance by 40%'
    ]
  },
  {
    name: 'Sourav',
    classRoll: '23BCA068',
    uniRoll: '6231650098',
    role: 'Backend Developer',
    color: 'from-blue-500 to-cyan-600',
    specialization: 'Backend & Database',
    skills: ['Node.js', 'Express', 'MongoDB', 'RESTful APIs', 'Authentication'],
    bio: 'Expert backend developer focused on building robust APIs and database solutions. Implemented authentication, payment processing, and order management systems.',
    achievements: [
      'Designed secure authentication system',
      'Built order management pipeline',
      'Created product seeding from Fake Store API'
    ]
  },
  {
    name: 'Amanpreet Singh',
    classRoll: '23BCA095',
    uniRoll: '6231650010',
    role: 'UI/UX Designer',
    color: 'from-purple-500 to-pink-600',
    specialization: 'Frontend & Design',
    skills: ['React', 'Tailwind CSS', 'Framer Motion', 'UI/UX Design', 'Responsive Design'],
    bio: 'Creative designer and frontend developer specializing in beautiful, responsive interfaces. Crafted the entire LUXE brand identity and user experience.',
    achievements: [
      'Designed luxury-themed UI system',
      'Implemented advanced animations',
      'Ensured responsive design across all devices'
    ]
  }
];

const projectStats = [
  { label: 'Products', value: '50+' },
  { label: 'Features', value: '15+' },
  { label: 'Development Hours', value: '200+' },
  { label: 'Code Quality', value: '98%' }
];

const techStack = [
  {
    category: 'Frontend',
    technologies: ['React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Query', 'Axios']
  },
  {
    category: 'Backend',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT Auth', 'bcryptjs']
  },
  {
    category: 'Tools & Services',
    technologies: ['Fake Store API', 'Git', 'VS Code', 'Postman', 'npm', 'Vite']
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

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 }
  }
};

export default function DevelopmentTeam() {
  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
        <img
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920"
          alt="Development Team"
          className="w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Code className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm tracking-wider uppercase">Our Team</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-light mb-4">Development Team</h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Meet the talented developers and designers behind LUXE
          </p>
        </motion.div>
      </div>

      {/* Project Stats */}
      <section className="py-20 bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {projectStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-light text-gold mb-2">{stat.value}</p>
                <p className="text-white/60 text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Team Section */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-4">
              Crafted with <span className="text-gold">Passion</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              This project was conceptualized, designed, and developed by talented BCA students 
              bringing innovation and excellence to luxury e-commerce
            </p>
          </motion.div>

          {/* Developer Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-20"
          >
            {developers.map((dev, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group relative h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 overflow-hidden h-full flex flex-col">
                  {/* Gradient Border Effect */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${dev.color}`} />
                  
                  {/* Avatar Placeholder */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${dev.color} p-[2px]`}>
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <User className="w-10 h-10 text-white/80" />
                      </div>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                      className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${dev.color} text-black text-xs font-bold px-3 py-1 rounded-full`}
                    >
                      {dev.role}
                    </motion.div>
                  </div>

                  {/* Info */}
                  <div className="text-center space-y-4 flex-grow">
                    <h3 className="text-2xl font-light text-white group-hover:text-gold transition-colors">
                      {dev.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2 text-white/60">
                        <GraduationCap className="w-4 h-4 text-gold" />
                        <span>Class Roll: <span className="text-white font-mono">{dev.classRoll}</span></span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-white/60">
                        <School className="w-4 h-4 text-gold" />
                        <span>Uni Roll: <span className="text-white font-mono">{dev.uniRoll}</span></span>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-white/60 pt-2">
                        <Zap className="w-4 h-4 text-gold" />
                        <span className="text-gold">{dev.specialization}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-white/50 text-sm leading-relaxed">
                      {dev.bio}
                    </p>

                    {/* Skills */}
                    <div className="space-y-3 pt-4">
                      <p className="text-gold text-xs uppercase tracking-wider font-semibold">Key Skills</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {dev.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <p className="text-gold text-xs uppercase tracking-wider font-semibold">Achievements</p>
                      <ul className="space-y-2 text-xs text-white/60">
                        {dev.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Award className="w-3 h-3 text-gold flex-shrink-0 mt-0.5" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-gold/10 to-transparent rounded-full blur-2xl group-hover:from-gold/20 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tech Stack Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-20"
          >
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16">
              Technology <span className="text-gold">Stack</span>
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {techStack.map((stack, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-gold/50 transition-colors duration-300"
                >
                  <h3 className="text-xl font-light text-gold mb-6">{stack.category}</h3>
                  <div className="space-y-3">
                    {stack.technologies.map((tech, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gold rounded-full" />
                        <span className="text-white/80">{tech}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Project Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-20 mt-20"
          >
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16">
              Project <span className="text-gold">Highlights</span>
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {[
                {
                  title: '50+ Luxury Products',
                  description: 'Curated collection of premium items across multiple categories, sourced from Fake Store API with intelligent variant generation.',
                  icon: Target
                },
                {
                  title: 'Secure Authentication',
                  description: 'JWT-based authentication system with bcrypt password hashing, ensuring user data security and privacy.',
                  icon: Code
                },
                {
                  title: 'Real-time Cart Management',
                  description: 'Responsive cart system with instant updates, utilizing React Query for efficient state management.',
                  icon: Zap
                },
                {
                  title: 'Beautiful UI/UX',
                  description: 'Luxury-themed interface with smooth animations, responsive design, and premium gold accent color scheme.',
                  icon: Award
                }
              ].map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    className="bg-gradient-to-br from-gold/10 to-transparent border border-white/10 rounded-2xl p-8 hover:border-gold/50 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-gold" />
                      </div>
                    </div>
                    <h3 className="text-xl font-light text-white mb-3 group-hover:text-gold transition-colors">
                      {highlight.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {highlight.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-24 pt-8 border-t border-white/10"
          >
            <p className="text-white/40 text-sm">
              Project developed as part of BCA Curriculum • 2026 • Shri Vishnu SD Post Graduate College, Bhatoli
            </p>
            <p className="text-white/30 text-xs mt-4">
              © 2026 LUXE E-Commerce. All rights reserved.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
