'use client'

import { motion } from 'framer-motion'
import { FaHeart } from 'react-icons/fa'

export default function Footer() {


    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-linear-to-t from-coffee-dark  to-coffee-dark text-white py-8 backdrop-blur-lg border-t border-coffee-light/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Content */}
                <div className="flex justify-center items-center gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center md:text-left"
                    >
                        <p className="text-coffee-light font-medium flex flex-col sm:flex-row items-center gap-2">
                            Made with 
                            <FaHeart className="text-red-500 mx-1 animate-pulse" />
                            by
                            <a
                                href="https://abdelaziz-sleem.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-500 hover:text-amber-400 font-bold transition-colors duration-300 relative group"
                            >
                                Abdelaziz Sleem
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        </p>
                        <p className="text-coffee-lighter text-sm mt-2 text-center">
                            © {currentYear} All rights reserved.
                        </p>
                    </motion.div>

                    
                </div>

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8 pt-6 border-t border-coffee-light/10 text-center"
                >
                   
                    <p className="text-coffee-light text-xs mt-2">
                        Last updated: {new Date().toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                        })}
                    </p>
                </motion.div>
            </div>
        </footer>
    )
}