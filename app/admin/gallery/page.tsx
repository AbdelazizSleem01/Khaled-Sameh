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

const addGallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  image: z.any().refine((files) => files?.length > 0, 'Image is required')
})

const editGallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  image: z.any().optional()
})

type GalleryItem = {
  _id?: string
  title: string
  imageUrl: string
  cloudinaryId: string
}

type FormData = {
  title: string
  image?: FileList
}

export default function GalleryManager() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(editingItem ? editGallerySchema : addGallerySchema)
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
      fetchGallery()
    }
  }, [status, router])

  useEffect(() => {
    if (editingItem) {
      setValue('title', editingItem.title)
      setPreviewImage(editingItem.imageUrl)
    } else {
      reset()
      setPreviewImage(null)
    }
  }, [editingItem, setValue, reset])

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (!response.ok) throw new Error('Failed to fetch gallery')
      const data = await response.json()
      setGallery(data)
    } catch (error) {
      console.error('Error fetching gallery:', error)
      Swal.fire('Error!', 'Failed to fetch gallery items', 'error')
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('title', data.title)
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0])
      }

      const url = editingItem ? `/api/gallery/${editingItem._id}` : '/api/gallery'
      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formData
      })

      if (!response.ok) throw new Error(`Failed to ${editingItem ? 'update' : 'upload'} image`)

      Swal.fire({
        title: 'Success!',
        text: `Image ${editingItem ? 'updated' : 'uploaded'} successfully`,
        icon: 'success',
        confirmButtonColor: '#6F4E37'
      })

      setEditingItem(null)
      reset()
      setPreviewImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      fetchGallery()
    } catch (error) {
      console.error('Error saving image:', error)
      Swal.fire({
        title: 'Error!',
        text: `Failed to ${editingItem ? 'update' : 'upload'} image`,
        icon: 'error',
        confirmButtonColor: '#d33'
      })
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (id: string) => {
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
        const response = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete image')
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Image has been deleted.',
          icon: 'success',
          confirmButtonColor: '#6F4E37'
        })
        fetchGallery()
      } catch (error) {
        console.error('Error deleting image:', error)
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete image',
          icon: 'error',
          confirmButtonColor: '#d33'
        })
      }
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-coffee-light to-amber-50 p-4">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-coffee-brown mb-4"></div>
          <p className="text-coffee-dark text-lg">Loading Gallery Manager...</p>
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
              Gallery Manager
            </h1>
            <p className="text-coffee-medium text-base sm:text-lg lg:text-xl leading-relaxed">
              Upload and manage your gallery images
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
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-coffee-dark mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <FaIcons.FaUpload className="text-coffee-brown text-lg sm:text-xl lg:text-2xl" />
                {editingItem ? 'Edit Image' : 'Add New Image'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-coffee-dark font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Image Title *
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className={`input input-bordered w-full bg-white/50 backdrop-blur-sm text-sm sm:text-base ${
                      errors.title ? 'input-error border-2' : 'border-coffee-light'
                    } rounded-lg sm:rounded-xl focus:border-coffee-brown focus:ring-2 focus:ring-coffee-brown/20`}
                    placeholder="e.g., Beautiful Latte Art"
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

                {/* Image Upload */}
                <div>
                  <label className="block text-coffee-dark font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Select Image {editingItem ? '(Optional - keep current image)' : '*'}
                  </label>
                  
                  {/* Custom File Upload */}
                  <div
                    onClick={handleFileClick}
                    className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center cursor-pointer transition-all duration-300 ${
                      errors.image 
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
                        <FaIcons.FaCloudUploadAlt className="text-white text-xl sm:text-2xl" />
                      </div>
                      
                      <div>
                        <p className="text-coffee-dark font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                          Click to upload your image
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

                {/* Image Preview */}
                <AnimatePresence>
                  {previewImage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 sm:space-y-3"
                    >
                      <label className="block text-coffee-dark font-semibold text-sm sm:text-base">
                        Image Preview
                      </label>
                      <div className="relative rounded-lg sm:rounded-xl overflow-hidden border-2 border-coffee-light bg-white/50">
                        <Image
                          src={previewImage}
                          alt="Preview"
                          width={400}
                          height={300}
                          className="w-full h-40 sm:h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                          <FaIcons.FaEye className="text-white text-xl sm:text-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={uploading}
                    className="btn flex-1 bg-coffee-brown hover:bg-coffee-dark border-none text-white text-sm sm:text-base py-3 sm:py-4 rounded-lg sm:rounded-xl disabled:bg-coffee-medium transition-all duration-300"
                  >
                    {uploading ? (
                      <div className="flex items-center gap-2 sm:gap-3 justify-center">
                        <div className="loading loading-spinner loading-xs sm:loading-sm"></div>
                        {editingItem ? 'Updating...' : 'Uploading Image...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 sm:gap-3 justify-center">
                        <FaIcons.FaCheck className="shrink-0" />
                        {editingItem ? 'Update Image' : 'Upload Image'}
                      </div>
                    )}
                  </motion.button>

                  {editingItem && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditingItem(null)}
                      className="btn btn-ghost text-coffee-dark border-coffee-light hover:bg-coffee-light text-sm sm:text-base py-3 sm:py-4 rounded-lg sm:rounded-xl"
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>

          {/* Gallery List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white/80 backdrop-blur-sm shadow-coffee border-2 border-coffee-light rounded-xl lg:rounded-2xl order-1 xl:order-2"
          >
            <div className="card-body p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-coffee-dark flex items-center gap-2 sm:gap-3">
                  <FaIcons.FaImages className="text-coffee-brown text-lg sm:text-xl lg:text-2xl" />
                  Gallery Images
                </h2>
                <span className="badge bg-coffee-brown text-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm">
                  {gallery.length} items
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto">
                <AnimatePresence>
                  {gallery.map((item, index) => (
                    <motion.div
                      key={item._id || `gallery-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/50 rounded-lg sm:rounded-xl border border-coffee-light hover:shadow-coffee transition-all duration-300"
                    >
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 48px, 64px"
                        />
                      </div>
                      
                      <div className="grow min-w-0 space-y-1">
                        <h3 className="font-semibold text-coffee-dark text-sm sm:text-base truncate">
                          {item.title}
                        </h3>
                        <p className="text-coffee-medium text-xs sm:text-sm truncate">
                          {item.imageUrl.split('/').pop()}
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingItem(item)}
                          className="btn btn-sm btn-outline border-coffee-brown text-coffee-dark hover:bg-coffee-brown hover:text-white"
                          title="Edit image"
                        >
                          <FaIcons.FaEdit className="text-xs sm:text-sm" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => item._id && deleteImage(item._id)}
                          className="btn btn-error btn-sm text-white border-none rounded-lg"
                          title="Delete image"
                        >
                          <FaIcons.FaTrash className="text-xs sm:text-sm" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {gallery.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 sm:py-12"
                  >
                    <FaIcons.FaImages className="text-coffee-medium text-4xl sm:text-6xl mx-auto mb-3 sm:mb-4" />
                    <p className="text-coffee-medium text-base sm:text-lg">
                      No images uploaded yet
                    </p>
                    <p className="text-coffee-light text-xs sm:text-sm mt-1 sm:mt-2">
                      Upload your first image using the form
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
