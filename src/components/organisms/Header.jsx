import React from 'react'
import { useLocation } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/events':
        return 'Events Dashboard'
      case '/contact-lists':
        return 'Contact Lists'
      case '/messages':
        return 'Messages'
      case '/reports':
        return 'Reports'
      case '/settings':
        return 'Settings'
      default:
        if (location.pathname.includes('/events/')) {
          return 'Event Details'
        }
        return 'Dashboard'
    }
  }

return (
    <header className="bg-surface border-b border-border px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden"
          />
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{getPageTitle()}</h1>
            <p className="text-sm text-text-secondary">Manage your WhatsApp RSVP campaigns</p>
          </div>
        </div>
<div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Bell"
            className="relative"
          >
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-red rounded-full"></span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon="HelpCircle"
          />
        </div>
      </div>
    </header>
  )
}

export default Header