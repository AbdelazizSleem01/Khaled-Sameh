'use client'

import { useEffect, useState } from 'react'
import { motion, easeOut } from 'framer-motion'
import * as FaIcons from 'react-icons/fa'

interface CareerItem {
  _id: string
  workplace: string
  position: string
  startDate: string
  endDate: string
  isCurrent: boolean
}

export default function Career() {
  const [career, setCareer] = useState<CareerItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCareer()
  }, [])

  const fetchCareer = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/career')
      if (response.ok) {
        const data = await response.json()
        // Sort by start date (newest first)
        const sortedData = data.sort((a: CareerItem, b: CareerItem) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        )
        setCareer(sortedData)
      }
    } catch (error) {
      console.error('Error fetching career:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const calculateDuration = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const start = new Date(startDate)
    // Use a fixed reference date for SSR consistency, only use current date on client
    const now = typeof window !== 'undefined' ? new Date() : new Date('2024-01-01')
    const end = isCurrent ? now : new Date(endDate || '')

    const years = end.getFullYear() - start.getFullYear()
    const months = end.getMonth() - start.getMonth()

    let totalMonths = years * 12 + months
    if (totalMonths < 0) totalMonths = 0

    const yearsPart = Math.floor(totalMonths / 12)
    const monthsPart = totalMonths % 12

    if (yearsPart === 0 && monthsPart === 0) return 'Less than 1 month'

    const parts = []
    if (yearsPart > 0) parts.push(`${yearsPart} yr${yearsPart > 1 ? 's' : ''}`)
    if (monthsPart > 0) parts.push(`${monthsPart} mo${monthsPart > 1 ? 's' : ''}`)

    return parts.join(' ')
  }

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
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easeOut
      }
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-linear-to-br from-coffee-light to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-coffee-brown mb-4"></div>
            <p className="text-coffee-dark text-lg">Loading Career...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="career" className="py-20 bg-linear-to-br from-white to-amber-50 relative overflow-hidden">
      {/* خلفية ديكورية */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">💼</div>
        <div className="absolute top-1/4 right-20 text-4xl">🚀</div>
        <div className="absolute bottom-20 left-20 text-5xl">✨</div>
        <div className="absolute bottom-10 right-10 text-6xl">⭐</div>
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
            <FaIcons.FaBriefcase className="text-white text-2xl" />
          </motion.div>

          <h2 className="text-5xl lg:text-6xl font-bold text-coffee-dark mb-6">
            Professional <span className="text-coffee-brown">Career</span>
          </h2>

          <p className="text-xl text-coffee-medium max-w-2xl mx-auto leading-relaxed">
            My journey through the coffee industry, from passionate beginnings to professional expertise.
            Each role has shaped my skills and deepened my love for the craft.
          </p>
        </motion.div>

        {/* Career Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-6xl mx-auto"
        >
          {career.length > 0 ? (
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-coffee-brown to-amber-700 transform lg:-translate-x-1/2"></div>

              {career.map((item, index) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  className={`flex flex-col lg:flex-row items-start gap-8 mb-12 last:mb-0 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                    }`}
                >
                  {/* Timeline Dot */}
                  <div className="flex items-center justify-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`w-6 h-6 rounded-full border-4 border-white shadow-lg ${item.isCurrent
                          ? 'bg-green-500 ring-4 ring-green-200 animate-pulse'
                          : 'bg-coffee-brown'
                        }`}
                    />
                  </div>

                  {/* Content Card */}
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`card bg-white/80 backdrop-blur-sm border-2 border-coffee-light shadow-coffee hover:shadow-coffee-lg transition-all duration-300 flex-1 ${index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'
                      }`}
                  >
                    <div className="card-body p-6 lg:p-8">
                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="card-title text-coffee-dark text-2xl lg:text-3xl mb-2"
                          >
                            {item.position}
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-coffee-brown text-xl font-semibold flex items-center gap-2"
                          >
                            <FaIcons.FaBuilding className="text-lg" />
                            {item.workplace}
                          </motion.p>
                        </div>

                        {/* Status Badge */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                          className="shrink-0"
                        >
                          <span className={`badge badge-lg ${item.isCurrent
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-coffee-light text-coffee-dark border-coffee-medium'
                            } border font-semibold`}>
                            {item.isCurrent ? (
                              <>
                                <FaIcons.FaPlayCircle className="mr-2" />
                                Current Role
                              </>
                            ) : (
                              <>
                                <FaIcons.FaCheckCircle className="mr-2" />
                                Completed
                              </>
                            )}
                          </span>
                        </motion.div>
                      </div>

                      {/* Timeline Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {/* Date Range */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-center gap-3 p-4 bg-coffee-light/30 rounded-xl"
                        >
                          <div className="w-12 h-12 bg-coffee-brown rounded-xl flex items-center justify-center shrink-0">
                            <FaIcons.FaCalendarAlt className="text-white text-lg" />
                          </div>
                          <div>
                            <p className="text-coffee-dark font-semibold">
                              {formatDate(item.startDate)} - {' '}
                              {item.isCurrent ? 'Present' : formatDate(item.endDate)}
                            </p>
                            <p className="text-coffee-medium text-sm">
                              Employment Period
                            </p>
                          </div>
                        </motion.div>

                        {/* Duration */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="flex items-center gap-3 p-4 bg-coffee-light/30 rounded-xl"
                        >
                          <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center shrink-0">
                            <FaIcons.FaClock className="text-white text-lg" />
                          </div>
                          <div>
                            <p className="text-coffee-dark font-semibold">
                              {calculateDuration(item.startDate, item.endDate, item.isCurrent)}
                            </p>
                            <p className="text-coffee-medium text-sm">
                              Total Duration
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Progress Bar */}
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        whileInView={{ opacity: 1, width: "100%" }}
                        transition={{ delay: 0.7, duration: 1 }}
                        className="mt-6"
                      >
                        <div className="w-full bg-coffee-light rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.isCurrent
                                ? 'bg-linear-to-r from-green-500 to-green-600'
                                : 'bg-linear-to-r from-coffee-brown to-amber-700'
                              } transition-all duration-1000`}
                            style={{
                              width: item.isCurrent ? '85%' : '100%',
                              animation: item.isCurrent ? 'pulse 2s infinite' : 'none'
                            }}
                          />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-2xl text-coffee-dark mb-4">Career Journey</h3>
              <p className="text-coffee-medium text-lg max-w-md mx-auto">
                Professional experience and career milestones will be showcased here.
                Each role tells a story of growth and dedication to the coffee craft.
              </p>
            </motion.div>
          )}
        </motion.div>

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
              Ready for the Next Chapter?
            </h3>
            <p className="text-coffee-medium mb-6">
              With years of dedicated experience in the coffee industry, I&apos;m always excited
              to take on new challenges and contribute to exceptional coffee experiences.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary bg-coffee-brown border-coffee-brown hover:bg-coffee-dark text-white px-3 py-3 text-lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <FaIcons.FaHandshake className="mr-2" />
              Let&apos;s Work Together
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
