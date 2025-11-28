'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Swal from 'sweetalert2'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import * as FaIcons from 'react-icons/fa'

const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().optional(),
  image: z.any().optional()
})

type CertificateFormData = {
  title: string
  date?: string
  image?: FileList
}

interface Certificate {
  _id?: string
  title: string
  imageUrl: string
  cloudinaryId: string
  date?: string
}

export default function CertificatesManager() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema)
  })

  const watchImage = watch('image')

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0]
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)

      return () => {
        URL.revokeObjectURL(imageUrl)
      }
    } else {
      setPreviewImage(null)
    }
  }, [watchImage])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchCertificates()
    }
  }, [status, router])

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates')
      if (!response.ok) throw new Error('Failed to fetch certificates')
      const data = await response.json()
      setCertificates(data)
    } catch (error) {
      console.error('Error fetching certificates:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch certificates',
        icon: 'error',
        confirmButtonColor: '#d33'
      })
    }
  }

  const onSubmit = async (data: CertificateFormData) => {
    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('title', data.title)
      if (data.date) formData.append('date', data.date)

      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0])
      }

      const url = isEditMode && editingCertificate
        ? `/api/certificates/${editingCertificate._id}`
        : '/api/certificates'
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${isEditMode ? 'update' : 'upload'} certificate`)
      }

      Swal.fire({
        title: 'Success!',
        text: `Certificate ${isEditMode ? 'updated' : 'uploaded'} successfully`,
        icon: 'success',
        confirmButtonColor: '#6F4E37'
      })

      reset()
      setPreviewImage(null)
      setIsEditMode(false)
      setEditingCertificate(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      fetchCertificates()
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'uploading'} certificate:`, error)
      Swal.fire({
        title: 'Error!',
        text: `Failed to ${isEditMode ? 'update' : 'upload'} certificate`,
        icon: 'error',
        confirmButtonColor: '#d33'
      })
    } finally {
      setUploading(false)
    }
  }

  const deleteCertificate = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6F4E37',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#fff',
      color: '#333'
    })

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/certificates/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete certificate')

        Swal.fire({
          title: 'Deleted!',
          text: 'Certificate has been deleted.',
          icon: 'success',
          confirmButtonColor: '#6F4E37'
        })
        fetchCertificates()
      } catch (error) {
        console.error('Error deleting certificate:', error)
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete certificate',
          icon: 'error',
          confirmButtonColor: '#d33'
        })
      }
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const editCertificate = (cert: Certificate) => {
    setEditingCertificate(cert)
    setIsEditMode(true)
    setPreviewImage(cert.imageUrl)
    reset({
      title: cert.title,
      date: cert.date || '',
      image: undefined
    })
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setIsEditMode(false)
    setEditingCertificate(null)
    setPreviewImage(null)
    reset({
      title: '',
      date: '',
      image: undefined
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-coffee-light to-amber-50 p-4">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-coffee-brown mb-4"></div>
          <p className="text-coffee-dark text-lg">Loading Certificates Manager...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-coffee-light to-amber-50 p-3 sm:p-4 lg:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8"
        >
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-coffee-dark mb-2 sm:mb-3 leading-tight">
              Certificates Manager
            </h1>
            <p className="text-coffee-medium text-base sm:text-lg lg:text-xl leading-relaxed">
              Manage your professional certificates and achievements
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/admin/dashboard')}
            className="btn bg-coffee-brown hover:bg-coffee-dark text-white border-none w-full sm:w-auto flex items-center justify-center sm:justify-start text-sm sm:text-base"
          >
            <FaIcons.FaArrowLeft className="mr-2 shrink-0" />
            <span className="truncate">Back to Dashboard</span>
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Upload Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white/80 backdrop-blur-sm shadow-coffee border-2 border-coffee-light rounded-xl lg:rounded-2xl order-2 xl:order-1"
          >
            <div className="card-body p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-coffee-dark flex items-center gap-2 sm:gap-3">
                  <FaIcons.FaAward className="text-coffee-brown text-lg sm:text-xl lg:text-2xl" />
                  {isEditMode ? 'Edit Certificate' : 'Add New Certificate'}
                </h2>
                {isEditMode && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelEdit}
                    className="btn btn-ghost btn-sm text-coffee-medium text-xs sm:text-sm mt-2 sm:mt-0"
                  >
                    <FaIcons.FaTimes className="mr-1 shrink-0" />
                    Cancel
                  </motion.button>
                )}
              </div>

              <form onSubmit={handleSubmit(data => onSubmit(data as unknown as CertificateFormData))} className="space-y-4 sm:space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-coffee-dark font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Certificate Title *
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className={`input input-bordered w-full bg-white/50 backdrop-blur-sm text-sm sm:text-base ${errors.title ? 'input-error border-2' : 'border-coffee-light'
                      } rounded-lg sm:rounded-xl focus:border-coffee-brown focus:ring-2 focus:ring-coffee-brown/20`}
                    placeholder="e.g., Professional Barista Certification"
                  />
                  {errors.title && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2"
                    >
                      <FaIcons.FaExclamationTriangle className="shrink-0" />
                      {errors.title.message}
                    </motion.p>
                  )}
                </div>

                {/* Date Input */}
                <div>
                  <label className="block text-coffee-dark font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    {...register('date')}
                    className="input input-bordered w-full bg-white/50 backdrop-blur-sm border-coffee-light text-sm sm:text-base rounded-lg sm:rounded-xl focus:border-coffee-brown focus:ring-2 focus:ring-coffee-brown/20"
                  />
                </div>

                {/* Certificate Upload */}
                <div>
                  <label className="block text-coffee-dark font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Certificate Image {isEditMode ? '(Optional - leave empty to keep current)' : '*'}
                  </label>

                  {/* Custom File Upload */}
                  <div
                    onClick={handleFileClick}
                    className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center cursor-pointer transition-all duration-300 ${errors.image
                      ? 'border-red-300 bg-red-50'
                      : 'border-coffee-light bg-white/50 hover:border-coffee-brown hover:bg-coffee-light/30'
                      }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      {...register('image')}
                      ref={(e) => {
                        register('image').ref(e)
                        if (e) fileInputRef.current = e
                      }}
                      className="hidden"
                    />

                    <div className="space-y-3 sm:space-y-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-coffee-brown rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                        <FaIcons.FaCertificate className="text-white text-xl sm:text-2xl" />
                      </div>

                      <div>
                        <p className="text-coffee-dark font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                          Click to upload certificate
                        </p>
                        <p className="text-coffee-medium text-xs sm:text-sm">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {errors.image && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2"
                    >
                      <FaIcons.FaExclamationTriangle className="shrink-0" />
                      {errors.image.message as string}
                    </motion.p>
                  )}
                </div>

                {/* Certificate Preview */}
                <AnimatePresence>
                  {previewImage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 sm:space-y-3"
                    >
                      <label className="block text-coffee-dark font-semibold text-sm sm:text-base">
                        Certificate Preview
                      </label>
                      <div className="relative rounded-lg sm:rounded-xl overflow-hidden border-2 border-coffee-light bg-white/50">
                        <Image
                          src={previewImage}
                          alt="Certificate Preview"
                          width={400}
                          height={300}
                          className="w-full h-40 sm:h-48 object-contain bg-white"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                          <FaIcons.FaEye className="text-white text-xl sm:text-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={uploading}
                  className="btn w-full bg-coffee-brown hover:bg-coffee-dark border-none text-white text-sm sm:text-base py-3 sm:py-4 rounded-lg sm:rounded-xl disabled:bg-coffee-medium transition-all duration-300"
                >
                  {uploading ? (
                    <div className="flex items-center gap-2 sm:gap-3 justify-center">
                      <div className="loading loading-spinner loading-xs sm:loading-sm"></div>
                      <span className="truncate">
                        {isEditMode ? 'Updating...' : 'Uploading...'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 sm:gap-3 justify-center">
                      <FaIcons.FaAward className="shrink-0" />
                      <span className="truncate">
                        {isEditMode ? 'Update Certificate' : 'Upload Certificate'}
                      </span>
                    </div>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Certificates List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white/80 backdrop-blur-sm shadow-coffee border-2 border-coffee-light rounded-xl lg:rounded-2xl order-1 xl:order-2"
          >
            <div className="card-body p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-coffee-dark flex items-center gap-2 sm:gap-3">
                  <FaIcons.FaCertificate className="text-coffee-brown text-lg sm:text-xl lg:text-2xl" />
                  My Certificates
                </h2>
                <span className="badge bg-coffee-brown text-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm mt-2 sm:mt-0">
                  {certificates.length} items
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto">
                <AnimatePresence>
                  {certificates.map((cert, index) => (
                    <motion.div
                      key={cert._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/50 rounded-lg sm:rounded-xl border border-coffee-light hover:shadow-coffee transition-all duration-300"
                    >
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-white border border-coffee-light">
                        <Image
                          src={cert.imageUrl}
                          alt={cert.title}
                          fill
                          className="object-contain p-1"
                          sizes="(max-width: 640px) 48px, 64px"
                        />
                      </div>

                      <div className="grow min-w-0 space-y-1">
                        <h3 className="font-semibold text-coffee-dark text-sm sm:text-base truncate">
                          {cert.title}
                        </h3>
                        {cert.date && (
                          <p className="text-coffee-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 mt-1">
                            <FaIcons.FaCalendarAlt className="text-coffee-brown shrink-0" />
                            {new Date(cert.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-1 sm:gap-2 shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => editCertificate(cert)}
                          className="btn btn-info btn-xs sm:btn-sm text-white border-none rounded-lg"
                          title="Edit certificate"
                        >
                          <FaIcons.FaEdit className="text-xs sm:text-sm" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => cert._id && deleteCertificate(cert._id)}
                          className="btn btn-error btn-xs sm:btn-sm text-white border-none rounded-lg"
                          title="Delete certificate"
                        >
                          <FaIcons.FaTrash className="text-xs sm:text-sm" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {certificates.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 sm:py-12"
                  >
                    <FaIcons.FaCertificate className="text-coffee-medium text-4xl sm:text-6xl mx-auto mb-3 sm:mb-4" />
                    <p className="text-coffee-medium text-base sm:text-lg">
                      No certificates uploaded yet
                    </p>
                    <p className="text-coffee-light text-xs sm:text-sm mt-1 sm:mt-2">
                      Upload your first certificate using the form
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Certificates Grid View */}
        {certificates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 sm:mt-12"
          >
            <div className="card bg-white/80 backdrop-blur-sm shadow-coffee border-2 border-coffee-light rounded-xl lg:rounded-2xl">
              <div className="card-body p-4 sm:p-6 lg:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-coffee-dark mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <FaIcons.FaThLarge className="text-coffee-brown text-lg sm:text-xl" />
                  Certificates Gallery
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {certificates.map((cert, index) => (
                    <motion.div
                      key={cert._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="card bg-white/50 backdrop-blur-sm border-2 border-coffee-light rounded-lg sm:rounded-xl overflow-hidden hover:shadow-coffee-lg transition-all duration-300"
                    >
                      <figure className="relative h-40 sm:h-48 bg-white">
                        <Image
                          src={cert.imageUrl}
                          alt={cert.title}
                          fill
                          className="object-contain p-3 sm:p-4"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </figure>
                      <div className="card-body p-3 sm:p-4">
                        <h4 className="card-title text-coffee-dark text-base sm:text-lg font-bold line-clamp-2 min-h-[3rem]">
                          {cert.title}
                        </h4>
                        {cert.date && (
                          <p className="text-coffee-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                            <FaIcons.FaCalendarAlt className="shrink-0" />
                            {new Date(cert.date).toLocaleDateString()}
                          </p>
                        )}
                        <div className="card-actions justify-end mt-2 sm:mt-3 gap-1 sm:gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => editCertificate(cert)}
                            className="btn btn-info btn-xs sm:btn-sm text-white border-none"
                          >
                            <FaIcons.FaEdit className="mr-1 text-xs" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => cert._id && deleteCertificate(cert._id)}
                            className="btn btn-error btn-xs sm:btn-sm text-white border-none"
                          >
                            <FaIcons.FaTrash className="mr-1 text-xs" />
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}