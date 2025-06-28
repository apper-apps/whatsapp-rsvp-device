import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import eventService from '@/services/api/eventService'

const CreateEventModal = ({ isOpen, onClose, onEventCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    eventName: '',
    websiteLink: '',
    date: '',
    location: '',
    description: '',
    messageTemplate: 'Hi {Name}, you\'re invited to {Event} on {Date} at {Location}! RSVP here: {link}'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Event name is required'
    if (!formData.eventName.trim()) newErrors.eventName = 'Display name is required'
    if (!formData.date) newErrors.date = 'Event date is required'
    if (!formData.location.trim()) newErrors.location = 'Event location is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const newEvent = await eventService.create(formData)
      onEventCreated(newEvent)
setFormData({
        name: '',
        eventName: '',
        websiteLink: '',
        date: '',
        location: '',
        description: '',
        messageTemplate: 'Hi {Name}, you\'re invited to {Event} on {Date} at {Location}! RSVP here: {link}'
      })
    } catch (error) {
      console.error('Failed to create event:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Create New Event</h2>
                <p className="text-sm text-gray-600">Set up your WhatsApp RSVP event</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClose}
              />
            </div>

            {/* Form */}
<form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Internal Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="company-gala-2024"
                  error={errors.name}
                  required
                />
                
                <Input
                  label="Event Name"
                  value={formData.eventName}
                  onChange={(e) => handleInputChange('eventName', e.target.value)}
                  placeholder="Annual Company Gala"
                  error={errors.eventName}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Website Link"
                  value={formData.websiteLink}
                  onChange={(e) => handleInputChange('websiteLink', e.target.value)}
                  placeholder="https://company.com/gala"
                  icon="Globe"
                />
                
                <Input
                  label="Event Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  error={errors.date}
                  required
                />
              </div>
              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Grand Ballroom, Hotel Marriott"
                icon="MapPin"
                error={errors.location}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your event..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Template
                </label>
                <textarea
                  value={formData.messageTemplate}
                  onChange={(e) => handleInputChange('messageTemplate', e.target.value)}
                  placeholder="Hi {Name}, you're invited to {Event}..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use placeholders: {'{Name}'}, {'{Event}'}, {'{Date}'}, {'{Location}'}, {'{link}'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  icon="Plus"
                >
                  Create Event
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default CreateEventModal