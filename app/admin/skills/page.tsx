'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Swal from 'sweetalert2'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaCogs,
  FaListAlt,
  FaSortNumericDown,
  FaCheckCircle,
  FaCoffee,
  FaMugHot,
  FaSeedling,
  FaAward,
  FaFire,
  FaStar,
  FaChartLine,
  FaUsers,
  FaLightbulb,
  FaHeart,
  FaRocket,
  FaMagic,
  FaCrown,
  FaGraduationCap,
  FaBriefcase,
  FaCamera,
  FaVideo,
  FaMusic,
  FaPaintBrush,
  FaCode,
  FaMobile,
  FaLaptop,
  FaCloud,
  FaLeaf,
  FaSun,
  FaMoon,
  FaGlobe,
  FaToolbox,
  FaCog,
  FaWrench,
  FaBolt,
  FaShieldAlt,
  FaBook,
  FaCertificate,
  FaMedal,
  FaTrophy,
  FaGem,
  FaUserTie,
  FaUserGraduate,
  FaUserCog
} from 'react-icons/fa'

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  order: z.number().min(0).optional(),
  icon: z.string().min(1, 'Icon is required')
})

type Skill = z.infer<typeof skillSchema> & { _id?: string }

const availableIcons = [
  { name: 'FaCoffee', component: FaCoffee, label: 'Coffee' },
  { name: 'FaMugHot', component: FaMugHot, label: 'Mug' },
  { name: 'FaSeedling', component: FaSeedling, label: 'Seedling' },
  { name: 'FaAward', component: FaAward, label: 'Award' },
  { name: 'FaFire', component: FaFire, label: 'Fire' },
  { name: 'FaStar', component: FaStar, label: 'Star' },
  { name: 'FaChartLine', component: FaChartLine, label: 'Chart' },
  { name: 'FaUsers', component: FaUsers, label: 'Users' },
  { name: 'FaLightbulb', component: FaLightbulb, label: 'Lightbulb' },
  { name: 'FaHeart', component: FaHeart, label: 'Heart' },
  { name: 'FaRocket', component: FaRocket, label: 'Rocket' },
  { name: 'FaMagic', component: FaMagic, label: 'Magic' },
  { name: 'FaCrown', component: FaCrown, label: 'Crown' },
  { name: 'FaGraduationCap', component: FaGraduationCap, label: 'Graduation' },
  { name: 'FaBriefcase', component: FaBriefcase, label: 'Briefcase' },
  { name: 'FaCamera', component: FaCamera, label: 'Camera' },
  { name: 'FaVideo', component: FaVideo, label: 'Video' },
  { name: 'FaMusic', component: FaMusic, label: 'Music' },
  { name: 'FaPaintBrush', component: FaPaintBrush, label: 'Paint' },
  { name: 'FaCode', component: FaCode, label: 'Code' },
  { name: 'FaMobile', component: FaMobile, label: 'Mobile' },
  { name: 'FaLaptop', component: FaLaptop, label: 'Laptop' },
  { name: 'FaCloud', component: FaCloud, label: 'Cloud' },
  { name: 'FaLeaf', component: FaLeaf, label: 'Leaf' },
  { name: 'FaSun', component: FaSun, label: 'Sun' },
  { name: 'FaMoon', component: FaMoon, label: 'Moon' },
  { name: 'FaGlobe', component: FaGlobe, label: 'Globe' },
  { name: 'FaToolbox', component: FaToolbox, label: 'Toolbox' },
  { name: 'FaCog', component: FaCog, label: 'Cog' },
  { name: 'FaWrench', component: FaWrench, label: 'Wrench' },
  { name: 'FaBolt', component: FaBolt, label: 'Bolt' },
  { name: 'FaShieldAlt', component: FaShieldAlt, label: 'Shield' },
  { name: 'FaBook', component: FaBook, label: 'Book' },
  { name: 'FaCertificate', component: FaCertificate, label: 'Certificate' },
  { name: 'FaMedal', component: FaMedal, label: 'Medal' },
  { name: 'FaTrophy', component: FaTrophy, label: 'Trophy' },
  { name: 'FaGem', component: FaGem, label: 'Gem' },
  { name: 'FaUserTie', component: FaUserTie, label: 'Business' },
  { name: 'FaUserGraduate', component: FaUserGraduate, label: 'Graduate' },
  { name: 'FaUserCog', component: FaUserCog, label: 'Settings' }
]

export default function SkillsManager() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>([])
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIcon, setSelectedIcon] = useState('FaCoffee')
  const [showIconPicker, setShowIconPicker] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<Skill>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      order: 0,
      icon: 'FaCoffee'
    }
  })

  const watchedIcon = watch('icon')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchSkills()
    }
  }, [status, router])

  useEffect(() => {
    if (editingSkill) {
      setSelectedIcon(editingSkill.icon)
    }
  }, [editingSkill])

  const fetchSkills = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/skills')
      if (!response.ok) throw new Error('Failed to fetch skills')
      const data = await response.json()
      setSkills(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch skills',
        background: '#FAF3E4',
        color: '#6F4E37'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: Skill) => {
    try {
      if (editingSkill && editingSkill._id) {
        const response = await fetch(`/api/skills/${editingSkill._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to update skill')

        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Skill updated successfully',
          background: '#FAF3E4',
          color: '#6F4E37',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        const response = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to create skill')

        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Skill created successfully',
          background: '#FAF3E4',
          color: '#6F4E37',
          timer: 2000,
          showConfirmButton: false
        })
      }
      reset()
      setEditingSkill(null)
      setSelectedIcon('FaCoffee')
      setShowIconPicker(false)
      fetchSkills()
    } catch (error) {
      console.error('Error saving skill:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save skill',
        background: '#FAF3E4',
        color: '#6F4E37'
      })
    }
  }

  const deleteSkill = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6F4E37',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#FAF3E4',
      color: '#6F4E37'
    })

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/skills/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete skill')

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Skill has been deleted.',
          background: '#FAF3E4',
          color: '#6F4E37',
          timer: 2000,
          showConfirmButton: false
        })
        fetchSkills()
      } catch (error) {
        console.error('Error deleting skill:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete skill',
          background: '#FAF3E4',
          color: '#6F4E37'
        })
      }
    }
  }

  const handleIconSelect = (iconName: string) => {
    setValue('icon', iconName)
    setSelectedIcon(iconName)
    setShowIconPicker(false)
  }

  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find(icon => icon.name === iconName)
    return icon ? icon.component : FaCoffee
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-coffee-light to-amber-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="loading loading-spinner loading-lg text-coffee-brown mb-4"></div>
          <p className="text-coffee-dark text-lg">Loading Skills...</p>
        </motion.div>
      </div>
    )
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
    <div className="min-h-screen bg-linear-to-br from-coffee-light via-amber-50 to-coffee-light">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-md border-b border-coffee-light sticky top-0 z-30"
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">

            {/* الجزء الأيسر: زر الرجوع والعنوان */}
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/admin/dashboard')}
                className="btn btn-circle hover:bg-coffee-light text-coffee-dark shrink-0 w-10 h-10 sm:w-12 sm:h-12"
              >
                <FaArrowLeft className="text-sm sm:text-base" />
              </motion.button>

              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 bg-coffee-brown rounded-lg shrink-0">
                  <FaCogs className="text-white text-base sm:text-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-coffee-dark truncate">
                    Skills Management
                  </h1>
                  <p className="text-coffee-medium text-xs sm:text-sm truncate">
                    Manage your professional skills
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center sm:text-right w-full sm:w-auto mt-2 sm:mt-0"
            >
              <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-2">
                <div className="stat-value text-coffee-brown text-base sm:text-lg lg:text-xl">
                  {skills.length}
                </div>
                <div className="stat-desc text-coffee-medium text-xs sm:text-sm whitespace-nowrap">
                  Total Skills
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 sm:space-y-6 lg:space-y-8"
        >
          {/* Add/Edit Form */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="card bg-white shadow-lg border border-coffee-light rounded-xl sm:rounded-2xl"
          >
            <div className="card-body p-4 sm:p-6 lg:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-1.5 sm:p-2 bg-coffee-brown rounded-full shrink-0">
                  {editingSkill ? (
                    <FaEdit className="text-white text-sm sm:text-base" />
                  ) : (
                    <FaPlus className="text-white text-sm sm:text-base" />
                  )}
                </div>
                <h2 className="card-title text-lg sm:text-xl lg:text-2xl text-coffee-dark truncate">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Skill Name */}
                  <div className="form-control">
                    <label className="label p-0 mb-2 sm:mb-3">
                      <span className="label-text text-coffee-dark font-semibold text-base sm:text-lg">
                        Skill Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className={`input input-bordered w-full bg-coffee-light border-coffee-medium text-coffee-dark text-sm sm:text-base py-2 sm:py-3 rounded-lg ${errors.name ? 'input-error border-2' : ''
                        }`}
                      placeholder="e.g., Latte Art, Coffee Brewing"
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2"
                        >
                          <span className="shrink-0">⚠️</span>
                          {errors.name.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Display Order */}
                  <div className="form-control">
                    <label className="label p-0 mb-2 sm:mb-3">
                      <span className="label-text text-coffee-dark font-semibold text-base sm:text-lg flex items-center gap-1 sm:gap-2">
                        <FaSortNumericDown className="shrink-0" />
                        Display Order
                      </span>
                    </label>
                    <input
                      type="number"
                      {...register('order', { valueAsNumber: true })}
                      className="input input-bordered w-full bg-coffee-light border-coffee-medium text-coffee-dark text-sm sm:text-base py-2 sm:py-3 rounded-lg"
                      placeholder="0"
                      min="0"
                    />
                    <label className="label p-0 mt-1 sm:mt-2">
                      <span className="label-text-alt text-coffee-medium text-xs sm:text-sm">
                        Lower numbers appear first
                      </span>
                    </label>
                  </div>
                </div>

                {/* Icon Selection */}
                <div className="form-control">
                  <label className="label p-0 mb-2 sm:mb-3">
                    <span className="label-text text-coffee-dark font-semibold text-base sm:text-lg">
                      Select Icon *
                    </span>
                  </label>

                  {/* Selected Icon Preview */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-coffee-light rounded-lg sm:rounded-xl border-2 border-coffee-medium shrink-0">
                      {React.createElement(getIconComponent(selectedIcon), {
                        className: "text-xl sm:text-2xl text-coffee-brown"
                      })}
                    </div>
                    <div className="min-w-0">
                      <p className="text-coffee-dark font-medium text-sm sm:text-base truncate">
                        Current Icon: {selectedIcon}
                      </p>
                      <p className="text-coffee-medium text-xs sm:text-sm">
                        Click the button below to change
                      </p>
                    </div>
                  </div>

                  {/* Icon Picker Button */}
                  <motion.button
                    type="button"
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-outline border-coffee-medium text-coffee-dark hover:bg-coffee-light w-full py-2 sm:py-3 text-sm sm:text-base rounded-lg"
                  >
                    {showIconPicker ? 'Hide Icon Picker' : 'Choose Icon'}
                  </motion.button>

                  <input
                    type="hidden"
                    {...register('icon')}
                  />

                  {/* Icon Picker Grid */}
                  <AnimatePresence>
                    {showIconPicker && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 sm:mt-4 p-3 sm:p-4 bg-coffee-light rounded-lg sm:rounded-xl border border-coffee-medium overflow-hidden"
                      >
                        <h3 className="text-coffee-dark font-semibold text-sm sm:text-base mb-2 sm:mb-3">Choose an Icon:</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2 max-h-40 sm:max-h-48 overflow-y-auto">
                          {availableIcons.map((icon) => (
                            <motion.button
                              key={icon.name}
                              type="button"
                              onClick={() => handleIconSelect(icon.name)}
                              className={`p-1 sm:p-2 rounded transition-all duration-200 ${selectedIcon === icon.name
                                ? 'bg-coffee-brown text-white shadow-lg'
                                : 'bg-white text-coffee-dark hover:bg-coffee-medium hover:text-white'
                                }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title={icon.label}
                            >
                              <icon.component className="text-base sm:text-lg mx-auto" />
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {errors.icon && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2"
                      >
                        <span className="shrink-0">⚠️</span>
                        {errors.icon.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-3 sm:pt-4">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-primary flex items-center gap-1 sm:gap-2 bg-coffee-brown border-coffee-brown hover:bg-coffee-dark text-white text-sm sm:text-base py-2 sm:py-3 rounded-lg order-2 sm:order-1"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading loading-spinner loading-xs sm:loading-sm"></div>
                        <span className="truncate">Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="shrink-0" />
                        <span className="truncate">
                          {editingSkill ? 'Update Skill' : 'Add Skill'}
                        </span>
                      </>
                    )}
                  </motion.button>

                  {editingSkill && (
                    <motion.button
                      type="button"
                      onClick={() => {
                        setEditingSkill(null)
                        reset()
                        setSelectedIcon('FaCoffee')
                        setShowIconPicker(false)
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn btn-outline border-coffee-medium text-coffee-dark hover:bg-coffee-light flex items-center gap-1 sm:gap-2 text-sm sm:text-base py-2 sm:py-3 rounded-lg order-1 sm:order-2"
                    >
                      <FaTimes className="shrink-0" />
                      <span className="truncate">Cancel</span>
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>

          {/* Skills List */}
          <motion.div
            variants={itemVariants}
            className="card bg-white shadow-lg border border-coffee-light rounded-xl sm:rounded-2xl"
          >
            <div className="card-body p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                  <div className="p-1.5 sm:p-2 bg-coffee-brown rounded-full shrink-0">
                    <FaListAlt className="text-white text-sm sm:text-base" />
                  </div>
                  <h2 className="card-title text-lg sm:text-xl lg:text-2xl text-coffee-dark whitespace-nowrap">
                    Skills List
                  </h2>
                </div>
                <div className="badge bg-coffee-brown border-coffee-brown text-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm whitespace-nowrap">
                  {skills.length} {skills.length === 1 ? 'Skill' : 'Skills'}
                </div>
              </div>

              <div className="overflow-x-auto">
                <AnimatePresence>
                  {skills.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 sm:py-12"
                    >
                      <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📝</div>
                      <h3 className="text-lg sm:text-xl text-coffee-dark mb-1 sm:mb-2">No Skills Yet</h3>
                      <p className="text-coffee-medium text-sm sm:text-base">
                        Add your first skill using the form above
                      </p>
                    </motion.div>
                  ) : (
                    <div className="block sm:hidden">
                      {/* Mobile View - Cards */}
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                      >
                        {skills.map((skill, index) => {
                          const IconComponent = getIconComponent(skill.icon)
                          return (
                            <motion.div
                            key={`skill-mobile-${index}`}
                              variants={itemVariants}
                              whileHover={{ scale: 1.01 }}
                              className="bg-coffee-light/50 rounded-lg p-3 sm:p-4 border border-coffee-light"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-coffee-light rounded-lg shrink-0">
                                  <IconComponent className="text-coffee-brown text-lg" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <FaCheckCircle className="text-green-500 shrink-0" />
                                    <h3 className="font-bold text-coffee-dark text-sm sm:text-base truncate">
                                      {skill.name}
                                    </h3>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="badge badge-outline border-coffee-medium text-coffee-dark text-xs">
                                      Order: {skill.order || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <motion.button
                                  onClick={() => {
                                    setEditingSkill(skill)
                                    reset(skill)
                                    setSelectedIcon(skill.icon)
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="btn btn-xs sm:btn-sm btn-outline border-coffee-brown text-coffee-dark hover:bg-coffee-brown hover:text-white flex items-center gap-1"
                                >
                                  <FaEdit className="text-xs" />
                                  Edit
                                </motion.button>
                                <motion.button
                                  onClick={() => skill._id && deleteSkill(skill._id)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="btn btn-xs sm:btn-sm bg-red-500 border-red-500 hover:bg-red-600 text-white flex items-center gap-1"
                                >
                                  <FaTrash className="text-xs" />
                                  Delete
                                </motion.button>
                              </div>
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Desktop View - Table */}
                  {skills.length > 0 && (
                    <div className="hidden sm:block">
                      <motion.table
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="table table-zebra w-full"
                      >
                        <thead>
                          <tr className="bg-coffee-light">
                            <th className="text-coffee-dark font-bold text-base sm:text-lg">Icon</th>
                            <th className="text-coffee-dark font-bold text-base sm:text-lg">Skill Name</th>
                            <th className="text-coffee-dark font-bold text-base sm:text-lg">Order</th>
                            <th className="text-coffee-dark font-bold text-base sm:text-lg">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {skills.map((skill, index) => {
                            const IconComponent = getIconComponent(skill.icon)
                            return (
                              <motion.tr
                                key={`skill-desktop-${index}`}
                                variants={itemVariants}
                                whileHover={{
                                  backgroundColor: "rgba(250, 243, 228, 0.5)",
                                  scale: 1.01
                                }}
                                className="border-b border-coffee-light"
                              >
                                <td className="py-3 sm:py-4">
                                  <div className="flex justify-center">
                                    <div className="p-2 bg-coffee-light rounded-lg">
                                      <IconComponent className="text-coffee-brown text-lg sm:text-xl" />
                                    </div>
                                  </div>
                                </td>
                                <td className="font-semibold text-coffee-dark text-base sm:text-lg py-3 sm:py-4">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <FaCheckCircle className="text-green-500 shrink-0" />
                                    <span className="truncate">{skill.name}</span>
                                  </div>
                                </td>
                                <td className="text-coffee-medium text-base sm:text-lg py-3 sm:py-4">
                                  <span className="badge badge-outline border-coffee-medium text-coffee-dark p-2 sm:p-3 text-sm sm:text-base">
                                    {skill.order || 0}
                                  </span>
                                </td>
                                <td className="py-3 sm:py-4">
                                  <div className="flex gap-1 sm:gap-2">
                                    <motion.button
                                      onClick={() => {
                                        setEditingSkill(skill)
                                        reset(skill)
                                        setSelectedIcon(skill.icon)
                                      }}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="btn btn-sm btn-outline border-coffee-brown text-coffee-dark hover:bg-coffee-brown hover:text-white flex items-center gap-1 sm:gap-2"
                                    >
                                      <FaEdit className="text-xs sm:text-sm" />
                                      Edit
                                    </motion.button>
                                    <motion.button
                                      onClick={() => skill._id && deleteSkill(skill._id)}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="btn btn-sm bg-red-500 border-red-500 hover:bg-red-600 text-white flex items-center gap-1 sm:gap-2"
                                    >
                                      <FaTrash className="text-xs sm:text-sm" />
                                      Delete
                                    </motion.button>
                                  </div>
                                </td>
                              </motion.tr>
                            )
                          })}
                        </tbody>
                      </motion.table>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
