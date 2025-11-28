'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FaEye,
  FaChartBar,
  FaVideo,
  FaImages,
  FaCertificate,
  FaBriefcase,
  FaGraduationCap,
  FaUserCog,
  FaChartLine,
  FaCogs,
  FaSignOutAlt,
} from 'react-icons/fa'
import { LuMessageCircle, LuSettings } from 'react-icons/lu'

interface Stats {
  visits: number
  videos: number
  images: number
  certificates: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    visits: 0,
    videos: 0,
    images: 0,
    certificates: 0
  })
  const [loading, setLoading] = useState(true)
const [openMenu, setOpenMenu] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchStats()
    }
  }, [status, router])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    router.push('/')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-coffee-light to-amber-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="loading loading-spinner loading-lg text-coffee-brown mb-4"></div>
          <p className="text-coffee-dark">Loading Dashboard...</p>
        </motion.div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Visits',
      value: stats.visits,
      icon: FaChartLine,
      color: 'from-amber-700 to-amber-500',
      bgColor: 'bg-coffee-light '
    },
    {
      title: 'Videos',
      value: stats.videos,
      icon: FaVideo,
      color: 'from-amber-700 to-amber-500',
      bgColor: 'bg-coffee-light '
    },
    {
      title: 'Images',
      value: stats.images,
      icon: FaImages,
      color: 'from-amber-700 to-amber-500',
      bgColor: 'bg-coffee-light '
    },
    {
      title: 'Certificates',
      value: stats.certificates,
      icon: FaCertificate,
      color: 'from-amber-700 to-amber-500',
      bgColor: 'bg-coffee-light '
    }
  ]

  const adminLinks = [
    {
      href: '/admin/skills',
      label: 'Skills Management',
      description: 'Manage your professional skills',
      icon: FaUserCog,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      href: '/admin/courses',
      label: 'Courses',
      description: 'Manage coffee courses & workshops',
      icon: FaGraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      href: '/admin/videos',
      label: 'Video Gallery',
      description: 'Manage your video content',
      icon: FaVideo,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      href: '/admin/gallery',
      label: 'Photo Gallery',
      description: 'Manage your photo gallery',
      icon: FaImages,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      href: '/admin/certificates',
      label: 'Certificates',
      description: 'Manage your certifications',
      icon: FaCertificate,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      href: '/admin/career',
      label: 'Career Timeline',
      description: 'Manage your professional journey',
      icon: FaBriefcase,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      href: '/admin/messages',
      label: 'Messages',
      description: 'Manage your messages',
      icon: LuMessageCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      description: 'Manage your settings',
      icon: LuSettings,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },


  ]

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-coffee-light via-amber-50 to-coffee-light ">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="navbar border-b border-coffee-light sticky top-0 z-40 px-4 sm:px-6 lg:px-10"
      >
        <div className="navbar-start">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl font-bold text-coffee-dark flex items-center gap-2 whitespace-nowrap"
          >
            <FaCogs className="text-coffee-brown" />
            Admin Dashboard
          </motion.h1>
        </div>

        <div className="navbar-end gap-2">

          {/* DESKTOP BUTTONS */}
          <div className="hidden md:flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="btn bg-coffee-brown hover:bg-coffee-brown text-white flex items-center gap-2"
            >
              <FaEye />
              View Site
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="btn btn-outline border-coffee-brown hover:border-coffee-brown text-coffee-dark hover:bg-coffee-light flex items-center gap-2"
            >
              <FaSignOutAlt />
              Sign Out
            </motion.button>
          </div>

          {/* MOBILE DROPDOWN */}
          <div className="dropdown dropdown-end md:hidden">
            <label tabIndex={0} className="btn bg-coffee-brown text-white">
              ☰
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-white rounded-box w-52 border border-coffee-light"
            >
              <li>
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 text-coffee-dark"
                >
                  <FaEye /> View Site
                </button>
              </li>

              <li>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-coffee-dark"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </motion.nav>


      {/* Main Content */}
      <div className="p-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl font-bold text-coffee-dark mb-2">
            Welcome back, {session?.user?.name || 'Admin'}! 👋
          </h2>
          <p className="text-coffee-medium text-lg">
            Manage your portfolio content and track your performance
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`card ${stat.bgColor} shadow-coffee-lg overflow-hidden border border-coffee-medium`}
            >
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-coffee-dark mb-1">
                      {stat.title}
                    </p>
                    <motion.p
                      className="text-3xl font-bold text-coffee-dark"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className={`p-3 rounded-full bg-linear-to-r ${stat.color} text-white`}
                  >
                    <stat.icon className="text-xl" />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: index * 0.1 + 0.7, duration: 0.5 }}
                  className="h-1 bg-linear-to-r from-transparent via-current to-transparent opacity-20 mt-2"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {adminLinks.map((link, index) => (
            <motion.div
              key={link.href}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={link.href}>
                <div className="card bg-white shadow-coffee hover:shadow-coffee-lg border border-coffee-light transition-all duration-300 cursor-pointer group h-full">
                  <div className="card-body p-6">
                    <div className="flex items-start space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`p-3 rounded-xl ${link.bgColor} ${link.color} group-hover:scale-110 transition-transform`}
                      >
                        <link.icon className="text-xl" />
                      </motion.div>

                      <div className="flex-1">
                        <h3 className="card-title text-coffee-dark group-hover:text-coffee-brown transition-colors mb-2">
                          {link.label}
                        </h3>
                        <p className="text-coffee-medium text-sm">
                          {link.description}
                        </p>
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="btn btn-sm btn-coffee btn-outline border-coffee-brown text-coffee-dark hover:bg-coffee-brown hover:text-white"
                      >
                        Manage
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <div className="card bg-white shadow-coffee border border-coffee-light">
            <div className="card-body">
              <h3 className="card-title text-coffee-dark mb-4 flex items-center gap-2">
                <FaChartBar className="text-coffee-brown" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-coffee-light rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-coffee-dark">Dashboard accessed</span>
                  </div>
                  <span className="text-coffee-medium text-sm">Just now</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-coffee-light rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-coffee-dark">Statistics updated</span>
                  </div>
                  <span className="text-coffee-medium text-sm">2 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
