'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaInstagram, FaLinkedin, FaYoutube, FaFileDownload, FaCoffee, FaAward, FaGraduationCap } from 'react-icons/fa'

export default function Hero() {
  const handleDownloadCV = () => {
    const cvUrl = '/cv/cv.pdf'
    const link = document.createElement('a')
    link.href = cvUrl
    link.download = 'Khaled_CoffeeMaster_CV.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const socialLinks = [
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/khaledsameh37",
      color: "hover:text-pink-600",
      bgColor: "hover:bg-pink-100"
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/in/khaled-sameh-16a3bb257",
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-100"
    },
    {
      icon: FaYoutube,
      href: "https://www.youtube.com/@khaledsameh1939",
      color: "hover:text-red-600",
      bgColor: "hover:bg-red-100"
    }
  ]

  const stats = [
    { icon: FaCoffee, number: "4+", label: "Years Experience" },
    { icon: FaAward, number: "5000+", label: "Cups Served" },
    { icon: FaGraduationCap, number: "8+", label: "Brewing Methods" }
  ]

  return (
    <section className="hero min-h-screen pb-16 relative overflow-hidden bg-linear-to-br from-coffee-light via-amber-50 to-coffee-light">
      {/* خلفية ديكورية */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-2 text-6xl">☕</div>
        <div className="absolute top-10 right-20 text-4xl">🌱</div>
        <div className="absolute bottom-10 left-5 text-5xl">✨</div>
        <div className="absolute bottom-10 right-10 text-6xl">💫</div>
      </div>

      <div className="hero-content flex-col lg:flex-row-reverse text-center lg:text-left relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative">
            <div className="w-80 h-80 lg:w-96 lg:h-96 relative rounded-full overflow-hidden border-8 border-coffee-brown shadow-2xl">
              <Image
                src="/barista-profile.webp"
                alt="Professional Barista - Khaled Coffee Master"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 768px) 320px, 384px"
              />
            </div>

            <motion.div
              className="absolute inset-0 rounded-full border-4 border-coffee-medium opacity-30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="flex justify-center mt-8 gap-6 lg:hidden">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-coffee-brown rounded-full mx-auto mb-2">
                  <stat.icon className="text-white text-lg" />
                </div>
                <div className="text-coffee-dark font-bold text-sm">{stat.number}</div>
                <div className="text-coffee-medium text-xs">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md lg:max-w-2xl order-1 lg:order-2 lg:pr-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl lg:text-6xl xl:text-7xl font-bold text-coffee-dark mb-4 leading-tight"
          >
            Khaled{" "}
            <motion.span
              className="text-coffee-brown bg-linear-to-r from-coffee-brown to-amber-700 bg-clip-text "
              whileHover={{ scale: 1.05 }}
            >
              Sameh{" "}
            </motion.span>

          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl lg:text-2xl text-coffee-medium mb-6 font-light"
          >
            Professional Barista
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-coffee-dark opacity-80 leading-relaxed mb-8"
          >
            Dedicated Barista with 4+ years of experience in specialty coffee,
            espresso preparation, and customer service. Skilled in operating
            and maintaining equipment, crafting high-quality beverages, and
            working efficiently under pressure. Passionate about delivering great
            customer experiences and continuously improving in the café industry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="hidden lg:flex gap-8 mb-8"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center w-14 h-14 bg-coffee-brown rounded-full mx-auto mb-3 shadow-lg">
                  <stat.icon className="text-white text-xl" />
                </div>
                <div className="text-coffee-dark font-bold text-lg">{stat.number}</div>
                <div className="text-coffee-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-lg bg-coffee-brown text-white shadow-lg flex items-center gap-2"
              href='/https://www.instagram.com/khaledsameh37'
              target="_blank"
            >
              <FaInstagram />
              View My Insta
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-outline btn-lg border-coffee-brown text-coffee-dark hover:bg-coffee-brown hover:text-white flex items-center gap-2"
              onClick={handleDownloadCV}
            >
              <FaFileDownload />
              Download CV
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center lg:justify-start gap-4"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 rounded-full bg-white border border-coffee-light shadow-md flex items-center justify-center text-coffee-dark transition-all duration-300 ${social.color} ${social.bgColor}`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <social.icon className="text-xl" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-coffee-brown rounded-full flex justify-center"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-coffee-brown rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}