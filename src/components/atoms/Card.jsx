import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'p-6',
...props 
}) => {
  const baseClasses = 'rounded-xl shadow-sm border border-gray-100'
  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : ''
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`${baseClasses} ${hoverClasses} ${padding} ${className} transition-all duration-200`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card