'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FaIcons from 'react-icons/fa'

interface Skill {
  _id: string
  name: string
  order: number
  icon: string
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/skills')
      if (response.ok) {
        const data = await response.json()
        const sortedSkills = data.sort((a: Skill, b: Skill) => (a.order || 0) - (b.order || 0))
        setSkills(sortedSkills)
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = (FaIcons as any)[iconName]
    return IconComponent || FaIcons.FaCoffee
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const
      }
    }
  }

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-linear-to-br from-coffee-light to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-coffee-brown mb-4"></div>
            <p className="text-coffee-dark text-lg">Loading Skills...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="py-20 bg-linear-to-br from-white to-amber-50 relative overflow-hidden">
      {/* خلفية ديكورية */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">☕</div>
        <div className="absolute top-1/4 right-20 text-4xl">🌱</div>
        <div className="absolute bottom-20 left-20 text-5xl">✨</div>
        <div className="absolute bottom-10 right-10 text-6xl">💫</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-coffee-brown rounded-full mb-6"
          >
            <FaIcons.FaAward className="text-white text-2xl" />
          </motion.div>

          <h2 className="text-5xl lg:text-6xl font-bold text-coffee-dark mb-6">
            Professional <span className="text-coffee-brown">Skills</span>
          </h2>

          <p className="text-xl text-coffee-medium max-w-2xl mx-auto leading-relaxed">
            Mastering the art of coffee with expertise in various brewing techniques,
            latte art, and customer service excellence.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <AnimatePresence>
          {skills.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {skills.map((skill, index) => {
                const IconComponent = getIconComponent(skill.icon)
                return (
                  <motion.div
                    key={skill._id}
                    variants={itemVariants}
                    whileHover="hover"
                    className="group cursor-pointer h-full"
                  >
                    <motion.div
                      variants={hoverVariants}
                      className="card h-full bg-white/80 backdrop-blur-sm border-2 border-coffee-light shadow-coffee hover:shadow-coffee-lg transition-all duration-500 group-hover:border-coffee-medium relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-coffee-brown to-amber-700 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                      <div className="card-body text-center p-8 relative z-10 flex flex-col justify-between h-full">
                        <motion.div
                          initial={{ scale: 0.8, rotate: -10 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1, type: "spring" }}
                          className="flex justify-center mb-4"
                        >
                          <div className="relative">
                            <div className="w-16 h-16 bg-linear-to-br from-coffee-brown to-amber-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                              <IconComponent className="text-white text-2xl" />
                            </div>
                            {/* تأثير دائري متحرك */}
                            <motion.div
                              className="absolute inset-0 border-2 border-coffee-brown rounded-2xl opacity-30"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                          </div>
                        </motion.div>

                        {/* اسم المهارة */}
                        <motion.h3
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                          className="card-title justify-center text-coffee-dark text-xl font-bold mb-2 group-hover:text-coffee-brown transition-colors duration-300"
                        >
                          {skill.name}
                        </motion.h3>

                        {/* ترتيب المهارة (اختياري) */}
                        {skill.order > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="flex justify-center items-center gap-1 text-coffee-medium text-sm"
                          >
                            <FaIcons.FaStar className="text-amber-500 text-xs" />
                            <span>Priority: {skill.order}</span>
                          </motion.div>
                        )}

                        {/* تأثير تحت الكارد */}
                        <motion.div
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-linear-to-r from-coffee-brown to-amber-700 group-hover:w-3/4 transition-all duration-500 rounded-full"
                          whileInView={{ width: "50%" }}
                          transition={{ delay: index * 0.1 + 0.4 }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">☕</div>
              <h3 className="text-2xl text-coffee-dark mb-4">Skills Coming Soon</h3>
              <p className="text-coffee-medium text-lg max-w-md mx-auto">
                Professional skills and expertise will be displayed here soon.
                Check back later to see the full range of coffee mastery!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-coffee-light rounded-2xl p-8 max-w-2xl mx-auto border border-coffee-light shadow-coffee">
            <h3 className="text-2xl font-bold text-coffee-dark mb-4">
              Ready to Brew Excellence?
            </h3>
            <p className="text-coffee-medium mb-6">
              Each skill represents years of practice and dedication to the craft of coffee making.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary bg-coffee-brown border-coffee-brown hover:bg-coffee-dark text-white px-3 py-3 text-lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Let's Work Together
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
