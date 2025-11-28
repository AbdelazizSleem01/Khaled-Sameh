'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import * as FaIcons from 'react-icons/fa'

interface Message {
    _id: string
    name: string
    email: string
    message: string
    status: 'new' | 'read' | 'replied'
    reply?: string
    repliedAt?: string
    createdAt: string
    updatedAt: string
}

export default function MessagesPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([])
    const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
    const [replyText, setReplyText] = useState('')
    const [sendingReply, setSendingReply] = useState(false)
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            fetchMessages()
        }
    }, [status, router])

    useEffect(() => {
        filterMessages()
    }, [messages, filterStatus, searchQuery])

    const fetchMessages = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/messages')
            if (response.ok) {
                const data = await response.json()
                const sortedData = data.sort((a: Message, b: Message) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                setMessages(sortedData)
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
            showNotification('error', 'Failed to fetch messages')
        } finally {
            setLoading(false)
        }
    }

    const filterMessages = () => {
        let filtered = messages

        if (filterStatus !== 'all') {
            filtered = filtered.filter(msg => msg.status === filterStatus)
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(msg =>
                msg.name.toLowerCase().includes(query) ||
                msg.email.toLowerCase().includes(query) ||
                msg.message.toLowerCase().includes(query)
            )
        }

        setFilteredMessages(filtered)
    }

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 5000)
    }

    const handleMarkAsRead = async (messageId: string) => {
        try {
            const response = await fetch(`/api/messages/${messageId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'markAsRead' })
            })

            if (response.ok) {
                await fetchMessages()
                const updatedMessage = messages.find(m => m._id === messageId)
                if (updatedMessage) {
                    setSelectedMessage({ ...updatedMessage, status: 'read' })
                }
                showNotification('success', 'Message marked as read')
            }
        } catch (error) {
            console.error('Error marking as read:', error)
            showNotification('error', 'Failed to mark as read')
        }
    }

    const handleSendReply = async () => {
        if (!selectedMessage || !replyText.trim()) return

        try {
            setSendingReply(true)
            const response = await fetch(`/api/messages/${selectedMessage._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reply',
                    reply: replyText
                })
            })

            if (response.ok) {
                await fetchMessages()
                setReplyText('')
                setSelectedMessage(null)
                showNotification('success', 'Reply sent successfully!')
            } else {
                showNotification('error', 'Failed to send reply')
            }
        } catch (error) {
            console.error('Error sending reply:', error)
            showNotification('error', 'Failed to send reply')
        } finally {
            setSendingReply(false)
        }
    }

    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return

        try {
            const response = await fetch(`/api/messages/${messageId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                await fetchMessages()
                setSelectedMessage(null)
                showNotification('success', 'Message deleted successfully')
            }
        } catch (error) {
            console.error('Error deleting message:', error)
            showNotification('error', 'Failed to delete message')
        }
    }

    const getStatusBadge = (status: string) => {
        const badges = {
            new: { 
                color: 'bg-blue-100 text-blue-800 border-blue-200', 
                icon: FaIcons.FaEnvelope, 
                text: 'New' 
            },
            read: { 
                color: 'bg-cyan-100 text-cyan-800 border-cyan-200', 
                icon: FaIcons.FaEnvelopeOpen, 
                text: 'Read' 
            },
            replied: { 
                color: 'bg-green-100 text-green-800 border-green-200', 
                icon: FaIcons.FaCheckCircle, 
                text: 'Replied' 
            }
        }
        const badge = badges[status as keyof typeof badges]
        const Icon = badge.icon
        return (
            <span className={`badge border ${badge.color} gap-1 sm:gap-2 font-semibold text-xs sm:text-sm`}>
                <Icon className="text-xs sm:text-sm" /> {badge.text}
            </span>
        )
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-coffee-light to-amber-50 p-4">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-coffee-brown mb-4"></div>
                    <p className="text-coffee-dark text-lg">Loading Messages...</p>
                </div>
            </div>
        )
    }

    const stats = {
        total: messages.length,
        new: messages.filter(m => m.status === 'new').length,
        read: messages.filter(m => m.status === 'read').length,
        replied: messages.filter(m => m.status === 'replied').length
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
                            Contact Messages
                        </h1>
                        <p className="text-coffee-medium text-base sm:text-lg lg:text-xl leading-relaxed">
                            Manage and respond to messages from your visitors
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

                {/* Notification */}
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="fixed top-4 sm:top-6 right-3 sm:right-6 z-50 max-w-xs sm:max-w-sm mx-2"
                        >
                            <div className={`alert backdrop-blur-sm border-2 ${
                                notification.type === 'success' 
                                    ? 'bg-green-500/40 border-green-400/50 text-green-100' 
                                    : 'bg-red-500/40 border-red-400/50 text-red-100'
                            } shadow-lg rounded-lg sm:rounded-xl`}>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    {notification.type === 'success' ? (
                                        <FaIcons.FaCheckCircle className="text-lg sm:text-xl text-green-400 shrink-0" />
                                    ) : (
                                        <FaIcons.FaExclamationTriangle className="text-lg sm:text-xl text-red-400 shrink-0" />
                                    )}
                                    <span className="font-semibold text-sm sm:text-base">{notification.message}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8"
                >
                    {/* Total Messages */}
                    <motion.div
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="card bg-white/80 backdrop-blur-sm border-2 border-coffee-light shadow-coffee rounded-xl sm:rounded-2xl"
                    >
                        <div className="card-body p-3 sm:p-4 lg:p-6">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-coffee-medium text-xs sm:text-sm font-semibold truncate">Total Messages</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-coffee-dark">{stats.total}</p>
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-coffee-brown rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                    <FaIcons.FaEnvelope className="text-white text-sm sm:text-base lg:text-xl" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* New Messages */}
                    <motion.div
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="card bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-coffee rounded-xl sm:rounded-2xl"
                    >
                        <div className="card-body p-3 sm:p-4 lg:p-6">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-blue-600 text-xs sm:text-sm font-semibold truncate">New Messages</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{stats.new}</p>
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                    <FaIcons.FaEnvelope className="text-white text-sm sm:text-base lg:text-xl" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Read Messages */}
                    <motion.div
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="card bg-white/80 backdrop-blur-sm border-2 border-cyan-200 shadow-coffee rounded-xl sm:rounded-2xl"
                    >
                        <div className="card-body p-3 sm:p-4 lg:p-6">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-cyan-600 text-xs sm:text-sm font-semibold truncate">Read Messages</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-600">{stats.read}</p>
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                    <FaIcons.FaEnvelopeOpen className="text-white text-sm sm:text-base lg:text-xl" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Replied Messages */}
                    <motion.div
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="card bg-white/80 backdrop-blur-sm border-2 border-green-200 shadow-coffee rounded-xl sm:rounded-2xl"
                    >
                        <div className="card-body p-3 sm:p-4 lg:p-6">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-green-600 text-xs sm:text-sm font-semibold truncate">Replied</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{stats.replied}</p>
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                    <FaIcons.FaCheckCircle className="text-white text-sm sm:text-base lg:text-xl" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card bg-white/80 backdrop-blur-sm border-2 border-coffee-light shadow-coffee rounded-xl sm:rounded-2xl mb-6 sm:mb-8"
                >
                    <div className="card-body p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                            {/* Search */}
                            <div className="flex-1">
                                <label className="block text-coffee-dark font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Search Messages</label>
                                <div className="relative">
                                    <FaIcons.FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-coffee-medium z-10 text-sm sm:text-base" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or message content..."
                                        className="input input-bordered w-full pl-9 sm:pl-12 bg-white/50 backdrop-blur-sm border-coffee-medium text-sm sm:text-base rounded-lg sm:rounded-xl focus:border-coffee-brown focus:ring-2 focus:ring-coffee-brown/20"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-coffee-medium hover:text-coffee-dark"
                                            onClick={() => setSearchQuery('')}
                                        >
                                            <FaIcons.FaTimes />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="flex flex-col">
                                <label className="block text-coffee-dark font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Filter by Status</label>
                                <div className="flex gap-1 sm:gap-2 flex-wrap">
                                    {[
                                        { key: 'all', label: 'All', color: 'bg-coffee-light text-coffee-dark' },
                                        { key: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
                                        { key: 'read', label: 'Read', color: 'bg-cyan-100 text-cyan-800' },
                                        { key: 'replied', label: 'Replied', color: 'bg-green-100 text-green-800' }
                                    ].map((filter) => (
                                        <motion.button
                                            key={filter.key}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`btn btn-xs sm:btn-sm border-0 ${filter.key === filterStatus ? filter.color : 'bg-coffee-light text-coffee-dark'} rounded-lg`}
                                            onClick={() => setFilterStatus(filter.key)}
                                        >
                                            {filter.label}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Messages List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3 sm:space-y-4"
                >
                    {filteredMessages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card bg-white/80 backdrop-blur-sm border-2 border-coffee-light shadow-coffee rounded-xl sm:rounded-2xl"
                        >
                            <div className="card-body text-center py-8 sm:py-12 lg:py-16">
                                <FaIcons.FaEnvelope className="text-4xl sm:text-6xl text-coffee-light mx-auto mb-3 sm:mb-4" />
                                <h3 className="text-xl sm:text-2xl text-coffee-dark mb-1 sm:mb-2">No messages found</h3>
                                <p className="text-coffee-medium text-sm sm:text-base">
                                    {searchQuery || filterStatus !== 'all' 
                                        ? 'Try adjusting your search or filter criteria' 
                                        : 'No contact messages received yet'
                                    }
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        filteredMessages.map((message, index) => (
                            <motion.div
                                key={message._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -2, scale: 1.01 }}
                                className="card bg-white/80 backdrop-blur-sm border-2 border-coffee-light shadow-coffee hover:shadow-coffee-lg rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300"
                                onClick={() => setSelectedMessage(message)}
                            >
                                <div className="card-body p-4 sm:p-6">
                                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-3 sm:gap-4 mb-3">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-coffee-brown rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                                    <FaIcons.FaUser className="text-white text-xs sm:text-sm lg:text-lg" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 sm:gap-2 mb-2">
                                                        <h3 className="font-bold text-coffee-dark text-base sm:text-lg truncate">
                                                            {message.name}
                                                        </h3>
                                                        {getStatusBadge(message.status)}
                                                    </div>
                                                    <p className="text-coffee-dark font-semibold text-xs sm:text-sm mb-1 truncate">
                                                        {message.email}
                                                    </p>
                                                    <p className="text-coffee-brown line-clamp-2 text-sm sm:text-base mb-2 sm:mb-3">
                                                        {message.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-coffee-medium">
                                                        <span className="flex items-center gap-1">
                                                            <FaIcons.FaClock className="shrink-0" />
                                                            {formatDate(message.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Quick Actions */}
                                        <div className="flex gap-1 sm:gap-2 shrink-0 mt-1">
                                            {message.status === 'new' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="btn btn-xs sm:btn-sm bg-blue-100 border-blue-200 text-blue-800 hover:bg-blue-200"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleMarkAsRead(message._id)
                                                    }}
                                                    title="Mark as read"
                                                >
                                                    <FaIcons.FaEnvelopeOpen className="text-xs sm:text-sm" />
                                                </motion.button>
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="btn btn-xs sm:btn-sm bg-red-100 border-red-200 text-red-800 hover:bg-red-200"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteMessage(message._id)
                                                }}
                                                title="Delete message"
                                            >
                                                <FaIcons.FaTrash className="text-xs sm:text-sm" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>

            {/* Message Detail Modal */}
            <AnimatePresence>
                {selectedMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
                        onClick={() => setSelectedMessage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            className="card bg-white w-full max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden rounded-xl sm:rounded-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="card-body p-0">
                                {/* Header */}
                                <div className="bg-linear-to-r from-coffee-brown to-amber-700 p-4 sm:p-6 text-white">
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <FaIcons.FaEnvelope className="text-xl sm:text-2xl" />
                                            <h2 className="text-xl sm:text-2xl font-bold">Message Details</h2>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="btn btn-sm btn-circle bg-white/20 border-0 text-white hover:bg-white/30"
                                            onClick={() => setSelectedMessage(null)}
                                        >
                                            <FaIcons.FaTimes />
                                        </motion.button>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        {getStatusBadge(selectedMessage.status)}
                                        <span className="text-amber-100 text-sm sm:text-base">
                                            Received: {formatDate(selectedMessage.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto">
                                    {/* Sender Info */}
                                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-coffee-light/30 rounded-lg sm:rounded-xl">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-coffee-brown rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                            <FaIcons.FaUser className="text-white text-base sm:text-lg lg:text-xl" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-coffee-dark text-base sm:text-lg truncate">{selectedMessage.name}</p>
                                            <p className="text-coffee-brown font-semibold text-sm sm:text-base truncate">{selectedMessage.email}</p>
                                        </div>
                                    </div>

                                    {/* Message Content */}
                                    <div>
                                        <h3 className="font-bold text-coffee-dark mb-2 sm:mb-3 text-base sm:text-lg">Message Content</h3>
                                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-coffee-light">
                                            <p className="whitespace-pre-wrap text-coffee-dark leading-relaxed text-sm sm:text-base">
                                                {selectedMessage.message}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Previous Reply */}
                                    {selectedMessage.reply && (
                                        <div>
                                            <h3 className="font-bold text-coffee-dark mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-1 sm:gap-2">
                                                <FaIcons.FaCheckCircle className="text-green-500 shrink-0" />
                                                Your Reply
                                            </h3>
                                            <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                                                <p className="whitespace-pre-wrap text-green-800 leading-relaxed text-sm sm:text-base">
                                                    {selectedMessage.reply}
                                                </p>
                                                {selectedMessage.repliedAt && (
                                                    <p className="text-green-600 text-xs sm:text-sm mt-2 sm:mt-3">
                                                        Replied on: {formatDate(selectedMessage.repliedAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Reply Form */}
                                    {selectedMessage.status !== 'replied' && (
                                        <div>
                                            <h3 className="font-bold text-coffee-dark mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-1 sm:gap-2">
                                                <FaIcons.FaReply className="text-coffee-brown shrink-0" />
                                                Send Reply
                                            </h3>
                                            <textarea
                                                className="textarea textarea-bordered w-full h-24 sm:h-32 bg-white/50 border-coffee-light text-sm sm:text-base rounded-lg sm:rounded-xl focus:border-coffee-brown focus:ring-2 focus:ring-coffee-brown/20 resize-none"
                                                placeholder="Type your response here..."
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            ></textarea>
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end mt-3 sm:mt-4">
                                                {selectedMessage.status === 'new' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="btn bg-blue-100 border-blue-200 text-blue-800 hover:bg-blue-200 text-sm sm:text-base py-2 sm:py-3 rounded-lg sm:rounded-xl order-2 sm:order-1"
                                                        onClick={() => handleMarkAsRead(selectedMessage._id)}
                                                    >
                                                        <FaIcons.FaEnvelopeOpen className="mr-1 sm:mr-2 shrink-0" />
                                                        <span className="truncate">Mark as Read</span>
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="btn bg-coffee-brown border-coffee-brown hover:bg-coffee-dark text-white text-sm sm:text-base py-2 sm:py-3 rounded-lg sm:rounded-xl order-1 sm:order-2"
                                                    onClick={handleSendReply}
                                                    disabled={!replyText.trim() || sendingReply}
                                                >
                                                    {sendingReply ? (
                                                        <div className="flex items-center gap-1 sm:gap-2 justify-center">
                                                            <div className="loading loading-spinner loading-xs sm:loading-sm"></div>
                                                            <span className="truncate">Sending...</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 sm:gap-2 justify-center">
                                                            <FaIcons.FaPaperPlane className="shrink-0" />
                                                            <span className="truncate">Send Reply</span>
                                                        </div>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer Actions */}
                                    <div className="border-t border-coffee-light mt-4 sm:mt-6 pt-4 sm:pt-6">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                                            <p className="text-coffee-medium text-xs sm:text-sm truncate">
                                                Message ID: {selectedMessage._id}
                                            </p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="btn bg-red-100 border-red-200 text-red-800 hover:bg-red-200 text-sm sm:text-base py-2 sm:py-3 rounded-lg sm:rounded-xl"
                                                onClick={() => handleDeleteMessage(selectedMessage._id)}
                                            >
                                                <FaIcons.FaTrash className="mr-1 sm:mr-2 shrink-0" />
                                                <span className="truncate">Delete Message</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}