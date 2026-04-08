'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FaIcons from 'react-icons/fa'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all fields')
      return
    }

    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', message: '' })

        setTimeout(() => {
          setSuccess(false)
        }, 5000)
      } else {
        setError(data.error || 'Failed to send message. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const socialLinks = [
    { icon: 'FaInstagram', label: 'Instagram', url: 'https://www.instagram.com/khaledsameh37', color: 'hover:bg-pink-500' },
    { icon: 'FaLinkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/khaled-sameh-16a3bb257', color: 'hover:bg-blue-600' },
    { icon: 'FaYoutube', label: 'YouTube', url: 'https://www.youtube.com/@khaledsameh1939', color: 'hover:bg-red-600' },
    { icon: 'FaTwitter', label: 'Twitter', url: 'https://www.instagram.com/khaledsameh37', color: 'hover:bg-blue-400' }
  ]

  const contactInfo = [
    { icon: 'FaEnvelope', label: 'Email', value: 'ksameh764@gmail.com', url: 'mailto:ksameh764@gmail.com' },
    { icon: 'FaPhone', label: 'Phone', value: '+201024529364', url: 'tel:+201024529364' },
    { icon: 'FaMapMarkerAlt', label: 'Location', value: 'Benha, Qalyubia, Egypt', url: 'https://www.google.com/maps/search/?api=1&query=Benha%2C%20Qalyubia%2C%20Egypt' }
  ]

  return (
    <section id="contact" className="py-20 bg-linear-to-br from-coffee-dark to-coffee-brown relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">📧</div>
        <div className="absolute top-1/4 right-20 text-4xl">💬</div>
        <div className="absolute bottom-20 left-20 text-5xl">✨</div>
        <div className="absolute bottom-10 right-10 text-6xl">🌟</div>
        
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-amber-500/30"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-amber-500/30"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-full mb-6"
          >
            <FaIcons.FaComments className="text-white text-2xl" />
          </motion.div>

          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Let's <span className="text-amber-300">Connect</span>
          </h2>

          <p className="text-xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
            Ready to brew something amazing together? Whether you're looking for collaboration, 
            consultation, or just want to talk coffee, I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => {
                const IconComponent = FaIcons[item.icon as keyof typeof FaIcons]
                return (
                  <motion.a
                    key={index}
                    href={item.url}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10, scale: 1.02 }}
                    className="flex items-center gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-amber-500/20 hover:bg-white/15 hover:border-amber-500/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-linear-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shrink-0 group-hover:from-amber-300 group-hover:to-amber-500 transition-all duration-300">
                      <IconComponent className="text-white text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="text-amber-200 text-sm font-semibold">{item.label}</p>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                    <FaIcons.FaArrowRight className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.a>
                )
              })}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaIcons.FaShareAlt className="text-amber-500" />
                Follow the Journey
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = FaIcons[social.icon as keyof typeof FaIcons]
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-amber-500/20 ${social.color} hover:shadow-lg transition-all duration-300 group`}
                    >
                      <IconComponent className="text-amber-500 group-hover:text-white text-lg transition-colors duration-300" />
                      <span className="text-white font-semibold text-sm">{social.label}</span>
                    </motion.a>
                  )
                })}
              </div>
            </div>

            {/* Quick Response Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-linear-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <FaIcons.FaClock className="text-amber-500 text-xl" />
                <h4 className="text-white font-bold text-lg">Quick Response</h4>
              </div>
              <p className="text-amber-100 text-sm">
                I typically respond to all messages within 24 hours. For urgent matters, 
                feel free to call or connect on social media.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card bg-white/10 backdrop-blur-sm border-2 border-amber-500/20 shadow-xl rounded-2xl"
          >
            <div className="card-body p-8">
              <h3 className="card-title text-2xl font-bold text-white mb-1 flex items-center gap-3">
                <FaIcons.FaPaperPlane className="text-amber-500" />
                Send a Message
              </h3>
              <p className="text-amber-100 mb-4">
                Fill out the form below and I'll get back to you as soon as possible.
              </p>

              <AnimatePresence>
                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="alert bg-green-500/20 border-green-400/30 text-green-100 mb-4 backdrop-blur-sm"
                  >
                    <FaIcons.FaCheckCircle className="text-xl text-green-400" />
                    <span className="font-semibold">Message sent successfully! I'll get back to you soon.</span>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="alert bg-red-500/20 border-red-400/30 text-red-100 mb-4 backdrop-blur-sm"
                  >
                    <FaIcons.FaExclamationTriangle className="text-xl text-red-400" />
                    <span className="font-semibold">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-amber-100 font-semibold">Your Name *</span>
                  </label>
                  <div className="relative">
                    <FaIcons.FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 z-10" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="input input-bordered w-full pl-12 bg-white/5 border-amber-500/30 text-white placeholder-amber-200/50 focus:bg-white/10 focus:border-amber-500 transition-all duration-300"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-amber-100 font-semibold">Email Address *</span>
                  </label>
                  <div className="relative">
                    <FaIcons.FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 z-10" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="input input-bordered w-full pl-12 bg-white/5 border-amber-500/30 text-white placeholder-amber-200/50 focus:bg-white/10 focus:border-amber-500 transition-all duration-300"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-amber-100 font-semibold">Your Message *</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, question, or just say hello..."
                    className="textarea textarea-bordered w-full h-32 bg-white/5 border-amber-500/30 text-white placeholder-amber-200/50 focus:bg-white/10 focus:border-amber-500 transition-all duration-300 resize-none"
                    disabled={loading}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="btn w-full bg-linear-to-r from-amber-500 to-amber-600 border-amber-500 hover:from-amber-600 hover:to-amber-700 text-white text-lg font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="loading loading-spinner loading-sm"></div>
                      Sending Message...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <FaIcons.FaPaperPlane />
                      Send Message
                    </div>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
