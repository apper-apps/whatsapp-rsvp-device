import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
const variants = {
    primary: 'bg-basecamp-primary text-custom-text hover:bg-blue-700 focus:ring-basecamp-primary shadow-soft hover:shadow-medium',
    secondary: 'bg-white text-basecamp-dark border border-gray-300 hover:bg-gray-50 focus:ring-basecamp-primary shadow-sm hover:shadow-soft',
    outline: 'border-2 border-basecamp-primary text-basecamp-primary hover:bg-basecamp-primary hover:text-white focus:ring-basecamp-primary',
    ghost: 'text-custom-text hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
    danger: 'bg-basecamp-red text-white hover:bg-red-600 focus:ring-basecamp-red shadow-soft hover:shadow-medium'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSizes[size]} 
          className="animate-spin mr-2" 
        />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className="mr-2" 
        />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className="ml-2" 
        />
      )}
    </motion.button>
  )
}

export default Button