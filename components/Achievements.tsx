'use client'

import { motion, easeOut } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import * as FaIcons from 'react-icons/fa'

interface AchievementItem {
  number: string
  label: string
  icon: keyof typeof FaIcons
  suffix?: string
  duration?: number
}

export default function Achievements() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  const [counters, setCounters] = useState<number[]>([])

  const achievements: AchievementItem[] = [
    { number: '5000', label: 'Cups of Excellence Served', icon: 'FaCoffee', suffix: '+', duration: 2.5 },
    { number: '8', label: 'Brewing Methods Mastered', icon: 'FaMugHot', suffix: '+', duration: 2 },
    { number: '150', label: 'Specialty Recipes Created', icon: 'FaAward', suffix: '+', duration: 3 },
    { number: '4', label: 'Years of Passionate Service', icon: 'FaHeart', suffix: '+', duration: 2 }
  ]

  useEffect(() => {
    if (inView) {
      const initialValues = achievements.map(() => 0)
      setCounters(initialValues)

      achievements.forEach((achievement, index) => {
        const target = parseInt(achievement.number)
        const duration = achievement.duration || 2
        const steps = 60
        const increment = target / (steps * duration)
        let current = 0

        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          setCounters(prev => {
            const newCounters = [...prev]
            newCounters[index] = Math.floor(current)
            return newCounters
          })
        }, 1000 / steps)
      })
    }
  }, [inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: easeOut
      }
    }
  }

  const numberVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: easeOut
      }
    }
  }

  return (
    <section id="achievements" className="py-20 bg-linear-to-br from-coffee-brown to-amber-900 relative overflow-hidden">
      {/* خلفية ديكورية */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🏆</div>
        <div className="absolute top-1/4 right-20 text-4xl">⭐</div>
        <div className="absolute bottom-20 left-20 text-5xl">✨</div>
        <div className="absolute bottom-10 right-10 text-6xl">🎯</div>
        {/* خطوط ديكورية */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-amber-400/30"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-amber-400/30"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-amber-400/20 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border-2 border-amber-400/20 rounded-full"></div>
        </div>
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
            className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-full mb-6"
          >
            <FaIcons.FaTrophy className="text-white text-2xl" />
          </motion.div>

          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Milestones & <span className="text-amber-300">Achievements</span>
          </h2>

          <p className="text-xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
            Celebrating the numbers that tell our story of passion, dedication,
            and excellence in every cup we serve.
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {achievements.map((achievement, index) => {
            const IconComponent = FaIcons[achievement.icon]
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3, ease: easeOut }
                }}
                className="group relative"
              >
                <div className="relative bg-white/10 backdrop-blur-sm border-2 border-amber-400/20 rounded-2xl py-8 px-4 text-center hover:bg-white/15 hover:border-amber-400/30 transition-all duration-500 overflow-hidden">

                  <div className="absolute inset-0 bg-linear-to-br from-amber-400/10 to-coffee-brown/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute inset-0 rounded-2xl bg-amber-400/5 scale-0 group-hover:scale-100 transition-transform duration-500" />

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    className="relative z-10 w-20 h-20 bg-linear-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-amber-300 group-hover:to-amber-500 transition-all duration-500 shadow-lg"
                  >
                    <IconComponent className="text-white text-2xl" />
                  </motion.div>

                  <motion.div
                    variants={numberVariants}
                    className="relative z-10 text-4xl lg:text-5xl font-bold text-white mb-3"
                  >
                    {inView ? (
                      <span className="bg-linear-to-r from-amber-300 to-white bg-clip-text text-transparent">
                        {counters[index] || 0}{achievement.suffix}
                      </span>
                    ) : (
                      <span className="bg-linear-to-r from-amber-300 to-white bg-clip-text text-transparent">
                        0{achievement.suffix}
                      </span>
                    )}
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="relative z-10 text-amber-100 font-semibold text-lg leading-tight"
                  >
                    {achievement.label}
                  </motion.p>

                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-linear-to-r from-amber-400 to-amber-600 group-hover:w-3/4 transition-all duration-500 rounded-full"
                    whileInView={{ width: "50%" }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                  />
                </div>

                <div className="absolute inset-0 bg-amber-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 -z-10 opacity-0 group-hover:opacity-100" />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-amber-400/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Every Number Tells a Story
            </h3>
            <p className="text-amber-100 mb-6">
              Behind these statistics are countless hours of practice, dedication,
              and a genuine love for creating exceptional coffee experiences.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn whitespace-nowrap bg-amber-500 border-amber-500 hover:bg-amber-600 hover:border-amber-600 text-white px-3 py-3 text-lg font-semibold"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <FaIcons.FaStar className="mr-2" />
              Start Coffee Journey
            </motion.button>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute left-10 bottom-10 opacity-20">
          <div className="w-8 h-8 border-2 border-amber-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute right-10 top-10 opacity-20">
          <div className="w-6 h-6 border-2 border-amber-400 rounded-full animate-pulse delay-1000"></div>
        </div>
      </div>
    </section>
  )
}
