import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const FilterDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  className = '',
  searchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const selectedOption = options.find(option => option.value === value)
  
  const filteredOptions = searchable && searchTerm 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-whatsapp-primary"
      >
        <span>{selectedOption?.label || label}</span>
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
          >
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <ApperIcon 
                    name="Search" 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-whatsapp-primary focus:border-whatsapp-primary"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            <div className="py-1 max-h-60 overflow-y-auto">
              {filteredOptions.map((option) => (
                <button
key={option.value}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FilterDropdown