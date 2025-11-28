'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Swal from 'sweetalert2'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ReactPlayer from 'react-player'
import * as FaIcons from 'react-icons/fa'

const videoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Valid URL is required'),
  embedType: z.enum(['embed', 'link'])
})

type Video = z.infer<typeof videoSchema> & { _id?: string }

export default function VideosManager() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<Video>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      embedType: 'embed'
    }
  })

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return ReactPlayer.canPlay(url)
    } catch {
      return false
    }
  }

  const getPlatformName = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
    if (url.includes('vimeo.com')) return 'Vimeo'
    if (url.includes('dailymotion.com')) return 'Dailymotion'
    return 'Video'
  }

  const watchUrl = watch('url')
  const watchEmbedType = watch('embedType')
  const showPreview = watchUrl && isValidUrl(watchUrl)

  // عرض معاينة الفيديو فور إدخال الرابط
  useEffect(() => {
    if (watchUrl && isValidUrl(watchUrl)) {
      setPreviewUrl(watchUrl)
    } else {
      setPreviewUrl('')
    }
  }, [watchUrl])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchVideos()
    }
  }, [status, router])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      if (!response.ok) throw new Error('Failed to fetch videos')
      const data = await response.json()
      setVideos(data)
    } catch (error) {
      console.error('Error fetching videos:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch videos',
        icon: 'error',
        confirmButtonColor: '#d33'
      })
    }
  }

  const onSubmit = async (data: Video) => {
    try {
      setIsSubmitting(true)

      if (editingVideo && editingVideo._id) {
        const response = await fetch(`/api/videos/${editingVideo._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to update video')
        Swal.fire({
          title: 'Updated!',
          text: 'Video updated successfully',
          icon: 'success',
          confirmButtonColor: '#6F4E37'
        })
      } else {
        const response = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to create video')
        Swal.fire({
          title: 'Created!',
          text: 'Video created successfully',
          icon: 'success',
          confirmButtonColor: '#6F4E37'
        })
      }
      reset()
      setEditingVideo(null)
      setPreviewUrl('')
      fetchVideos()
    } catch (error) {
      console.error('Error saving video:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save video',
        icon: 'error',
        confirmButtonColor: '#d33'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteVideo = async (id: string) => {
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
        const response = await fetch(`/api/videos/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete video')
        Swal.fire({
          title: 'Deleted!',
          text: 'Video has been deleted.',
          icon: 'success',
          confirmButtonColor: '#6F4E37'
        })
        fetchVideos()
      } catch (error) {
        console.error('Error deleting video:', error)
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete video',
          icon: 'error',
          confirmButtonColor: '#d33'
        })
      }
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-coffee-light to-amber-50 p-4">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-coffee-brown mb-4"></div>
          <p className="text-coffee-dark text-lg">Loading Videos Manager...</p>
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
          {/* الجزء الأيسر: العنوان والوصف */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-coffee-dark mb-2 sm:mb-3 leading-tight">
              Videos Manager
            </h1>
            <p className="text-coffee-medium text-base sm:text-lg lg:text-xl leading-relaxed">
              Manage and organize your video content
            </p>
          </div>

          {/* الجزء الأيمن: زر الرجوع */}
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
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white/80 backdrop-blur-sm border-2 border-coffee-light shadow-coffee rounded-xl lg:rounded-2xl order-2 xl:order-1"
          >
            <div className="card-body p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-coffee-dark mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <FaIcons.FaVideo className="text-coffee-brown text-lg sm:text-xl lg:text-2xl" />
                {editingVideo ? 'Edit Video' : 'Add New Video'}
              </h2>

              <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-coffee-dark font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className={`input input-bordered w-full bg-white/50 backdrop-blur-sm text-sm sm:text-base ${errors.title ? 'input-error border-2' : 'border-coffee-light'
                      } rounded-lg sm:rounded-xl focus:border-coffee-brown focus:ring-2 focus:ring-coffee-brown/20`}
                    placeholder="e.g., Advanced Latte Art Techniques"
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

                {/* Description Input */}
                <div>
                  <label className="block text-coffee-dark font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    className={`textarea textarea-bordered w-full bg-white/50 backdrop-blur-sm text-sm sm:text-base ${errors.description ? 'textarea-error border-2' : 'border-coffee-light'
                      } rounded-lg sm:rounded-xl focus:border-coffee-brown focus:ring-2 focus:ring-coffee-brown/20 resize-none`}
                    placeholder="Describe the video content, techniques used, or key takeaways..."
                    rows={3}
                  />
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2"
                    >
                      <FaIcons.FaExclamationTriangle className="shrink-0" />
                      {errors.description.message}
                    </motion.p>
                  )}
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-coffee-dark font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Video URL *
                  </label>
                  <div className="relative">
                    <FaIcons.FaLink className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-coffee-medium z-10 text-sm sm:text-base" />
                    <input
                      type="url"
                      {...register('url')}
                      className={`input input-bordered w-full pl-9 sm:pl-12 bg-white/50 backdrop-blur-sm text-sm sm:text-base ${errors.url ? 'input-error border-2' : 'border-coffee-light'
                        } rounded-lg sm:rounded-xl focus:border-coffee-brown focus:ring-2 focus:ring-coffee-brown/20`}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  {errors.url && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2"
                    >
                      <FaIcons.FaExclamationTriangle className="shrink-0" />
                      {errors.url.message}
                    </motion.p>
                  )}
                  {watchUrl && !isValidUrl(watchUrl) && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-amber-600 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2"
                    >
                      <FaIcons.FaExclamationTriangle className="shrink-0" />
                      This URL may not be supported for embedding
                    </motion.p>
                  )}
                </div>

                {/* Embed Type */}
                <div>
                  <label className="block text-coffee-dark font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Display Type
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    {[
                      { value: 'embed', label: 'Embed Video', icon: FaIcons.FaPlay },
                      { value: 'link', label: 'External Link', icon: FaIcons.FaExternalLinkAlt }
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setValue('embedType', option.value as any)}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 text-xs sm:text-sm ${watchEmbedType === option.value
                          ? 'bg-coffee-brown border-coffee-brown text-white'
                          : 'bg-white/50 border-coffee-light text-coffee-dark hover:border-coffee-medium'
                          }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 justify-center">
                          <option.icon className="text-sm sm:text-lg shrink-0" />
                          <span className="font-semibold truncate">{option.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Video Preview */}
                <AnimatePresence>
                  {showPreview ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 sm:space-y-3"
                    >
                      <label className="block text-coffee-dark font-semibold text-sm sm:text-base">
                        Video Preview - {getPlatformName(previewUrl)}
                      </label>
                      <div className="relative rounded-lg sm:rounded-xl overflow-hidden border-2 border-coffee-light bg-black">
                        <ReactPlayer
                          url={previewUrl}
                          width="100%"
                          height="200px"
                          controls
                          light={true}
                        />
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="btn flex-1 bg-coffee-brown hover:bg-coffee-dark border-none text-white text-sm sm:text-base py-3 sm:py-4 rounded-lg sm:rounded-xl disabled:bg-coffee-medium transition-all duration-300 order-2 sm:order-1"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2 sm:gap-3 justify-center">
                        <div className="loading loading-spinner loading-xs sm:loading-sm"></div>
                        {editingVideo ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 sm:gap-3 justify-center">
                        <FaIcons.FaCheck className="shrink-0" />
                        {editingVideo ? 'Update Video' : 'Add Video'}
                      </div>
                    )}
                  </motion.button>

                  {editingVideo && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setEditingVideo(null)
                        reset()
                        setPreviewUrl('')
                      }}
                      className="btn btn-ghost text-coffee-dark border-coffee-light hover:bg-coffee-light hover:border-coffee-medium text-sm sm:text-base order-1 sm:order-2"
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>

          {/* Videos List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-white/80 backdrop-blur-sm border-2 border-coffee-light shadow-coffee rounded-xl lg:rounded-2xl order-1 xl:order-2"
          >
            <div className="card-body p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-coffee-dark flex items-center gap-2 sm:gap-3">
                  <FaIcons.FaList className="text-coffee-brown text-lg sm:text-xl lg:text-2xl" />
                  Videos Library
                </h2>
                <span className="badge bg-coffee-brown text-white px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm">
                  {videos.length} items
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto">
                <AnimatePresence>
                  {videos.map((video, index) => (
                    <motion.div
                      key={video._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white/50 rounded-lg sm:rounded-xl border border-coffee-light hover:shadow-coffee transition-all duration-300"
                    >
                      {/* Video Thumbnail */}
                      <div className="relative w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden bg-black shrink-0">
                        {isValidUrl(video.url) ? (
                          <ReactPlayer
                            url={video.url}
                            width="100%"
                            height="100%"
                            light={true}
                            playIcon={null}
                          />
                        ) : (
                          <div className="w-full h-full bg-coffee-brown flex items-center justify-center">
                            <FaIcons.FaVideo className="text-white text-xs sm:text-sm" />
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1">
                          <span className={`badge badge-xs ${video.embedType === 'embed'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-500 text-white'
                            }`}>
                            {video.embedType}
                          </span>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="grow min-w-0 space-y-1">
                        <h3 className="font-bold text-coffee-dark text-sm sm:text-base truncate">
                          {video.title}
                        </h3>
                        <p className="text-coffee-medium text-xs sm:text-sm line-clamp-2">
                          {video.description}
                        </p>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs text-coffee-light">
                          <FaIcons.FaLink className="shrink-0" />
                          <span className="truncate text-xs">{video.url}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 sm:gap-2 shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setEditingVideo(video)
                            reset(video)
                            setPreviewUrl(video.url)
                          }}
                          className="btn btn-xs sm:btn-sm bg-coffee-light border-coffee-light text-coffee-dark hover:bg-coffee-medium hover:border-coffee-medium"
                          title="Edit video"
                        >
                          <FaIcons.FaEdit className="text-xs sm:text-sm" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => video._id && deleteVideo(video._id)}
                          className="btn btn-xs sm:btn-sm btn-error text-white border-none"
                          title="Delete video"
                        >
                          <FaIcons.FaTrash className="text-xs sm:text-sm" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {videos.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 sm:py-12"
                  >
                    <FaIcons.FaVideo className="text-coffee-medium text-4xl sm:text-6xl mx-auto mb-3 sm:mb-4" />
                    <p className="text-coffee-medium text-base sm:text-lg">
                      No videos added yet
                    </p>
                    <p className="text-coffee-light text-xs sm:text-sm mt-1 sm:mt-2">
                      Add your first video using the form
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