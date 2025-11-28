'use client'

import { useEffect, useState } from 'react'
import { motion, easeOut } from 'framer-motion'
import { FaPlay, FaCoffee, FaEye, FaClock, FaExternalLinkAlt, FaYoutube, FaCameraRetro, FaVideoSlash, FaVideo, FaHandSparkles, FaClipboard } from 'react-icons/fa'
import Image from 'next/image'

interface Video {
  _id: string
  title: string
  description: string
  url: string
  embedType: string
}

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(youtubeRegex)
    if (match && match[1]) {
      const videoId = match[1]
      return `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&controls=1&fs=1&iv_load_policy=3&showinfo=0&color=white`
    }
    return url
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-linear-to-br from-coffee-light to-amber-50">
        <div className="container mx-auto px-4 text-center">
          <div className="loading loading-spinner loading-lg text-coffee-brown mb-4"></div>
          <p className="text-coffee-dark text-lg">Loading Videos...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="videos" className="py-20 bg-linear-to-br from-white to-amber-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl"><FaCameraRetro /></div>
        <div className="absolute top-1/4 right-20 text-4xl"><FaVideo /></div>
        <div className="absolute bottom-20 left-20 text-5xl"><FaHandSparkles /> </div>
        <div className="absolute bottom-10 right-10 text-6xl"><FaClipboard /></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Header */}
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
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-coffee-brown rounded-full mb-6 shadow-xl"
          >
            <FaPlay className="text-white text-3xl ml-1" />
          </motion.div>

          <h2 className="text-5xl lg:text-6xl font-bold text-coffee-dark mb-6">
            Video <span className="text-coffee-brown">Gallery</span>
          </h2>

          <p className="text-xl text-coffee-medium max-w-2xl mx-auto leading-relaxed">
            Explore our premium collection of coffee brewing tutorials, latte art masterpieces,
            and exclusive behind-the-scenes moments from the world of specialty coffee.
          </p>
        </motion.div>

        {/* Videos Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <motion.div
                key={video._id}
                variants={{
                  hidden: { y: 50, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: easeOut } }
                }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="card bg-white/90 backdrop-blur-sm border-2 border-coffee-light/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
                  <div className="relative">
                    <div className="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
                      <div className="absolute top-3 left-3 z-30 pointer-events-none">
                        <div className="bg-coffee-brown backdrop-blur-lg rounded-xl p-1 flex items-center gap-3 shadow-2xl border border-white/50">
                          <Image
                            src="/logo.png"
                            alt="logo"
                            width={45}
                            height={45}
                            className="rounded-md"
                          />
                        </div>
                      </div>

                      <iframe
                        src={getEmbedUrl(video.url)}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ border: 'none' }}
                      />

                      {/* Animated Bottom Bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-coffee-brown via-amber-600 to-coffee-brown transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                    </div>

                    {/* Video Info */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-bold text-coffee-dark group-hover:text-coffee-brown transition-colors duration-300 line-clamp-2">
                        {video.title}
                      </h3>

                      <p className="text-coffee-medium leading-relaxed line-clamp-3">
                        {video.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-coffee-light/50">
                        <div className="flex items-center  text-coffee-medium">
                          <div className="flex items-center gap-2">
                            <FaEye className="text-coffee-brown" />
                            <span className="text-sm font-medium  whitespace-nowrap">Watch Now</span>
                          </div>
                         
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open(video.url, '_blank')}
                          className="btn btn-sm bg-coffee-brown hover:bg-coffee-dark text-white border-none shadow-lg"
                        >
                          <FaExternalLinkAlt className="text-xs" />
                          <span className="ml-2">Watch Full</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 text-center py-20">
              <div className="text-8xl mb-6">Video Camera</div>
              <h3 className="text-3xl font-bold text-coffee-dark mb-4">Videos Coming Soon</h3>
              <p className="text-coffee-medium text-lg max-w-md mx-auto">
                Exciting coffee content is on the way: brewing guides, latte art tutorials,
                and behind-the-scenes from the specialty coffee world!
              </p>
            </div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-coffee-light/80 backdrop-blur-sm rounded-3xl p-10 max-w-3xl mx-auto border-2 border-coffee-brown/20 shadow-2xl">
            <h3 className="text-3xl font-bold text-coffee-dark mb-4">
              Want More Coffee Content?
            </h3>
            <p className="text-coffee-medium text-lg mb-8">
              Subscribe to our channel for exclusive tutorials, pro tips, and behind-the-scenes content.
            </p>
            <motion.a
              href="https://www.youtube.com/@khaledsameh1939"
              target="_blank"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-lg bg-coffee-brown hover:bg-coffee-dark text-white border-none shadow-xl text-xl px-3 whitespace-nowrap"
            >
              <FaYoutube className="text-2xl mr-2" />
              Subscribe on YouTube
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}