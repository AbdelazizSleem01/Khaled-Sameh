'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaHome,
  FaUser,
  FaGraduationCap,
  FaTrophy,
  FaVideo,
  FaImages,
  FaCertificate,
  FaBriefcase,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaCoffee,
  FaEllipsisH
} from 'react-icons/fa'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // تحديث القسم النشط
      const sections = ['home', 'skills', 'courses', 'achievements', 'videos', 'gallery', 'certificates', 'career', 'contact']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home', icon: FaHome, id: 'home', priority: true },
    { name: 'Skills', href: '#skills', icon: FaUser, id: 'skills', priority: true },
    { name: 'Courses', href: '#courses', icon: FaGraduationCap, id: 'courses', priority: true },
    { name: 'Achievements', href: '#achievements', icon: FaTrophy, id: 'achievements', priority: false },
    { name: 'Videos', href: '#videos', icon: FaVideo, id: 'videos', priority: false },
    { name: 'Gallery', href: '#gallery', icon: FaImages, id: 'gallery', priority: false },
    { name: 'Certificates', href: '#certificates', icon: FaCertificate, id: 'certificates', priority: false },
    { name: 'Career', href: '#career', icon: FaBriefcase, id: 'career', priority: false },
    { name: 'Contact', href: '#contact', icon: FaEnvelope, id: 'contact', priority: true },
  ]

  const priorityItems = navItems.filter(item => item.priority)
  const secondaryItems = navItems.filter(item => !item.priority)

  const socialLinks = [
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/khaledsameh37",
      color: "hover:bg-pink-500 hover:text-white",
      label: "Instagram"
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/in/khaled-sameh-16a3bb257",
      color: "hover:bg-blue-600 hover:text-white",
      label: "LinkedIn"
    },
    {
      icon: FaYoutube,
      href: "https://www.youtube.com/@khaledsameh1939",
      color: "hover:bg-red-600 hover:text-white",
      label: "YouTube"
    },
  ]

  const scrollToSection = (href: string, id: string) => {
    setIsOpen(false)
    setShowMoreMenu(false)
    setActiveSection(id)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-2xl shadow-coffee-brown/20 py-2 border-b border-coffee-light/30'
          : 'bg-transparent py-3'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-3">
          <div className="flex justify-between items-center h-14 lg:h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 cursor-pointer shrink-0"
              onClick={() => scrollToSection('#home', 'home')}
            >
              <div className="relative">
                <div className="w-16 h-16 lg:w-16 lg:h-16 bg-linear-to-br from-coffee-brown to-amber-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Image
                    src="/logo.png"
                    alt="Khaled Coffee Master Logo"
                    width={50}
                    height={50}
                    className="object-contain rounded-md"
                  />
                </div>
                <motion.div
                  className="absolute inset-0 border-2 border-coffee-brown/30 rounded-2xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div className="hidden sm:block">
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl lg:text-2xl font-bold bg-linear-to-r from-coffee-dark to-coffee-brown bg-clip-text text-transparent"
                >
                  Khaled
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xs text-coffee-medium -mt-1 font-medium"
                >
                  Coffee Master
                </motion.p>
              </div>
            </motion.div>

            {/* Desktop Navigation - Priority Items Only */}
            <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-2xl">
              {priorityItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href, item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 group relative shrink-0 ${activeSection === item.id
                    ? 'text-coffee-brown bg-coffee-light/50 shadow-inner'
                    : 'text-coffee-dark hover:text-coffee-brown hover:bg-coffee-light/30'
                    }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <item.icon className={`text-lg transition-colors ${activeSection === item.id ? 'text-coffee-brown' : 'text-coffee-medium group-hover:text-coffee-brown'
                    }`} />
                  <span className="font-semibold whitespace-nowrap">{item.name}</span>

                  {activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-coffee-brown rounded-full"
                      layoutId="activeSection"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}

              {/* More Menu Dropdown */}
              {secondaryItems.length > 0 && (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 group relative ${showMoreMenu
                      ? 'text-coffee-brown bg-coffee-light/50 shadow-inner'
                      : 'text-coffee-dark hover:text-coffee-brown hover:bg-coffee-light/30'
                      }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEllipsisH className="text-lg" />
                    <span className="font-semibold">More</span>
                  </motion.button>

                  <AnimatePresence>
                    {showMoreMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-coffee-light/30 py-2 z-50"
                      >
                        {secondaryItems.map((item, index) => (
                          <motion.button
                            key={item.name}
                            onClick={() => scrollToSection(item.href, item.id)}
                            className={`flex items-center space-x-3 w-full px-4 py-3 transition-all duration-200 group ${activeSection === item.id
                              ? 'text-coffee-brown bg-coffee-light/30'
                              : 'text-coffee-dark hover:text-coffee-brown hover:bg-coffee-light/20'
                              }`}
                            whileHover={{ x: 5 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <item.icon className={`text-lg transition-colors ${activeSection === item.id ? 'text-coffee-brown' : 'text-coffee-medium group-hover:text-coffee-brown'
                              }`} />
                            <span className="font-medium whitespace-nowrap">{item.name}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Social Links - Desktop */}
            <div className="hidden lg:flex items-center space-x-2 shrink-0">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-xl bg-coffee-light flex items-center justify-center text-coffee-dark transition-all duration-300 ${social.color} shadow-md hover:shadow-lg`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <social.icon className="text-lg" />
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-coffee-light rounded-xl text-coffee-dark hover:bg-coffee-medium hover:text-white transition-colors shadow-md shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </motion.button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-coffee-medium via-coffee-brown to-amber-700"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 max-w-full bg-linear-to-b from-white to-amber-50 shadow-2xl z-50 lg:hidden overflow-y-auto border-l border-coffee-light/30"
            >
              {/* Header */}
              <div className="p-6 border-b border-coffee-light/30 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 lg:w-16 lg:h-16 bg-linear-to-br from-coffee-brown to-amber-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className='relative'>

                        <Image
                          src="/logo.png"
                          alt="Khaled Coffee Master Logo"
                          width={50}
                          height={50}
                          className="object-contain rounded-md"
                        />
                      </div>
                    </div>
                    <motion.div
                      className="absolute inset-0  rounded-2xl"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />

                    <div>
                      <h2 className="text-xl font-bold bg-linear-to-r from-coffee-dark to-coffee-brown bg-clip-text text-transparent">
                        Khaled
                      </h2>
                      <p className="text-sm text-coffee-medium font-medium">Coffee Master</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-coffee-light text-coffee-dark hover:bg-coffee-medium hover:text-white transition-colors shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTimes />
                  </motion.button>
                </div>

                {/* Social Links - Mobile */}
                <div className="flex justify-center space-x-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`w-12 h-12 rounded-xl bg-coffee-light flex items-center justify-center text-coffee-dark transition-all duration-300 ${social.color} shadow-md`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <social.icon className="text-xl" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Navigation Items */}
              <div className="p-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href, item.id)}
                    className={`flex items-center space-x-4 w-full p-4 rounded-2xl transition-all duration-300 group mb-3 ${activeSection === item.id
                      ? 'bg-coffee-light/50 text-coffee-brown shadow-inner'
                      : 'text-coffee-dark hover:bg-coffee-light/30 hover:text-coffee-brown'
                      }`}
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <item.icon className={`text-xl transition-colors ${activeSection === item.id ? 'text-coffee-brown' : 'text-coffee-medium group-hover:text-coffee-brown'
                      }`} />
                    <span className="font-semibold text-lg">{item.name}</span>

                    {activeSection === item.id && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-coffee-brown rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Backdrop for More Menu */}
      <AnimatePresence>
        {showMoreMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:block hidden"
            onClick={() => setShowMoreMenu(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}