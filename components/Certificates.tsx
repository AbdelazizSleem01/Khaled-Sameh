'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, easeOut, easeIn } from 'framer-motion'
import * as FaIcons from 'react-icons/fa'

function ClientDate({ date }: { date: string }) {
  const [formatted, setFormatted] = useState<string>('')

  useEffect(() => {
    // eslint-disable-next-line -- Intentional: client-side date formatting to prevent hydration mismatch
    setFormatted(new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))
  }, [date])

  return <>{formatted || date}</>
}

interface Certificate {
  _id: string
  title: string
  imageUrl: string
  date: string
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [direction, setDirection] = useState(0) // 0: right, 1: left

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/certificates')
      if (response.ok) {
        const data = await response.json()
        setCertificates(data)
      }
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextCertificate = useCallback(() => {
    setDirection(0)
    setCurrentIndex((prevIndex) => 
      prevIndex === certificates.length - 1 ? 0 : prevIndex + 1
    )
  }, [certificates.length])

  const prevCertificate = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? certificates.length - 1 : prevIndex - 1
    )
  }, [certificates.length])

  // Auto-play
  useEffect(() => {
    if (certificates.length <= 1) return
    
    const interval = setInterval(() => {
      nextCertificate()
    }, 5000) // تغيير كل 5 ثواني

    return () => clearInterval(interval)
  }, [certificates.length, nextCertificate])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextCertificate()
      if (e.key === 'ArrowLeft') prevCertificate()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextCertificate, prevCertificate])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction === 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    },
    exit: (direction: number) => ({
      x: direction === 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: easeIn
      }
    })
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
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
            <p className="text-coffee-dark text-lg">Loading Certificates...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="certificates" className="py-20 bg-linear-to-br from-white to-amber-50 relative overflow-hidden">
      {/* خلفية ديكورية */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">🏆</div>
        <div className="absolute top-1/4 right-20 text-4xl">📜</div>
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
            <FaIcons.FaAward className="text-white text-2xl" />
          </motion.div>

          <h2 className="text-5xl lg:text-6xl font-bold text-coffee-dark mb-6">
            Professional <span className="text-coffee-brown">Certifications</span>
          </h2>

          <p className="text-xl text-coffee-medium max-w-2xl mx-auto leading-relaxed">
            Recognized qualifications and achievements that demonstrate our commitment 
            to excellence in the coffee industry.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {certificates.length > 0 ? (
            <div className="relative">
              {/* Carousel Content */}
              <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="card bg-white/80 backdrop-blur-sm border-2 border-coffee-light shadow-coffee rounded-2xl overflow-hidden w-full max-w-2xl mx-auto">
                      <figure className="relative h-80 lg:h-96 bg-white">
                        <Image
                          src={certificates[currentIndex].imageUrl}
                          alt={certificates[currentIndex].title}
                          fill
                          className="object-contain p-8"
                          priority
                        />
                      </figure>
                      <div className="card-body text-center p-6 lg:p-8">
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="card-title text-coffee-dark text-2xl lg:text-3xl justify-center mb-4"
                        >
                          {certificates[currentIndex].title}
                        </motion.h3>
                        {certificates[currentIndex].date && (
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-coffee-medium text-lg flex items-center justify-center gap-2"
                          >
                            <FaIcons.FaCalendarAlt className="text-coffee-brown" />
                            <ClientDate date={certificates[currentIndex].date} />
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {certificates.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevCertificate}
                      className="absolute left-4 lg:left-8 w-12 h-12 bg-coffee-brown/90 hover:bg-coffee-dark text-white rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-300"
                      aria-label="Previous certificate"
                    >
                      <FaIcons.FaChevronLeft className="text-lg" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextCertificate}
                      className="absolute right-4 lg:right-8 w-12 h-12 bg-coffee-brown/90 hover:bg-coffee-dark text-white rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-300"
                      aria-label="Next certificate"
                    >
                      <FaIcons.FaChevronRight className="text-lg" />
                    </motion.button>
                  </>
                )}
              </div>

              {/* Progress Dots */}
              {certificates.length > 1 && (
                <motion.div
                  variants={itemVariants}
                  className="flex justify-center items-center gap-3 mt-8"
                >
                  {certificates.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentIndex ? 0 : 1)
                        setCurrentIndex(index)
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-coffee-brown scale-125'
                          : 'bg-coffee-medium hover:bg-coffee-brown'
                      }`}
                      aria-label={`Go to certificate ${index + 1}`}
                    />
                  ))}
                </motion.div>
              )}

              {/* Certificate Counter */}
              {certificates.length > 1 && (
                <motion.div
                  variants={itemVariants}
                  className="text-center mt-4"
                >
                  <span className="text-coffee-medium bg-coffee-light/50 px-4 py-2 rounded-full text-sm">
                    {currentIndex + 1} / {certificates.length}
                  </span>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📜</div>
              <h3 className="text-2xl text-coffee-dark mb-4">Certificates Coming Soon</h3>
              <p className="text-coffee-medium text-lg max-w-md mx-auto">
                Professional certifications and achievements will be displayed here soon.
              </p>
            </motion.div>
          )}
        </motion.div>

       
      </div>
    </section>
  )
}
