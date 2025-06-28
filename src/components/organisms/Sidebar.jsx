import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation()

  const menuItems = [
    { name: 'Events', icon: 'Calendar', path: '/events' },
    { name: 'Contact Lists', icon: 'Users', path: '/contact-lists' },
    { name: 'Messages', icon: 'MessageSquare', path: '/messages' },
    { name: 'Reports', icon: 'BarChart3', path: '/reports' },
    { name: 'Settings', icon: 'Settings', path: '/settings' }
  ]

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: isOpen ? 0 : -200 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-whatsapp-dark text-white w-64 flex flex-col shadow-2xl"
    >
      {/* Logo */}
      <div className="p-6 border-b border-whatsapp-teal">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-whatsapp-primary rounded-lg">
            <ApperIcon name="MessageCircle" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">RSVP Pro</h1>
            <p className="text-sm text-gray-300">WhatsApp Events</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path === '/events' && location.pathname === '/')
            
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-whatsapp-primary text-white shadow-lg'
                      : 'text-gray-300 hover:bg-whatsapp-teal hover:text-white'
                  }`}
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-whatsapp-teal">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-whatsapp-primary rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} />
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">Event Manager</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar