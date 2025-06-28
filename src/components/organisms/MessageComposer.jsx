import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const MessageComposer = ({ event, contacts, onSendMessages }) => {
  const [message, setMessage] = useState(event?.messageTemplate || '')
  const [previewMode, setPreviewMode] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState([])
  const [sending, setSending] = useState(false)

  const placeholders = [
    { key: '{Name}', description: 'Contact name' },
    { key: '{Event}', description: 'Event name' },
    { key: '{Date}', description: 'Event date' },
    { key: '{Location}', description: 'Event location' },
    { key: '{link}', description: 'RSVP form link' }
  ]

  const handleInsertPlaceholder = (placeholder) => {
    setMessage(prev => prev + placeholder)
  }

  const generatePreview = () => {
    if (!contacts.length) return message

    const sampleContact = contacts[0]
    return message
      .replace(/{Name}/g, sampleContact.name)
      .replace(/{Event}/g, event.name)
      .replace(/{Date}/g, event.date)
      .replace(/{Location}/g, event.location)
      .replace(/{link}/g, event.rsvpFormUrl)
  }

  const handleSendMessages = async () => {
    if (!message.trim()) return

    setSending(true)
    try {
      await onSendMessages({
        content: message,
        eventId: event.Id,
        contactIds: selectedContacts.length > 0 ? selectedContacts : contacts.map(c => c.Id)
      })
      setMessage('')
      setSelectedContacts([])
    } finally {
      setSending(false)
    }
  }

  const getMessageStats = () => {
    const totalRecipients = selectedContacts.length > 0 ? selectedContacts.length : contacts.length
    const estimatedCost = (totalRecipients * 0.05).toFixed(2) // Mock cost calculation
    
    return {
      recipients: totalRecipients,
      estimatedCost,
      characterCount: message.length
    }
  }

  const stats = getMessageStats()

  return (
    <div className="space-y-6">
      {/* Message Composer */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Compose Message</h2>
              <p className="text-sm text-gray-600">Create personalized WhatsApp invitations</p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={previewMode ? 'primary' : 'outline'}
                size="sm"
                icon="Eye"
                onClick={() => setPreviewMode(!previewMode)}
              >
                Preview
              </Button>
            </div>
          </div>

          {!previewMode ? (
            <div className="space-y-4">
              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Template
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your invitation message here..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Use placeholders to personalize your messages
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.characterCount} characters
                  </p>
                </div>
              </div>

              {/* Placeholders */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insert Placeholders
                </label>
                <div className="flex flex-wrap gap-2">
                  {placeholders.map((placeholder) => (
                    <Button
                      key={placeholder.key}
                      variant="outline"
                      size="sm"
                      onClick={() => handleInsertPlaceholder(placeholder.key)}
                    >
                      {placeholder.key}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-whatsapp-light rounded-lg p-4 border-l-4 border-whatsapp-primary">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="MessageSquare" size={16} className="text-whatsapp-primary" />
                  <span className="text-sm font-medium text-whatsapp-dark">Message Preview</span>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {generatePreview()}
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                This is how your message will appear to recipients (using the first contact as an example)
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Message Statistics */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Sending Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Users" size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Recipients</p>
                  <p className="text-lg font-bold text-blue-600">{stats.recipients}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="DollarSign" size={20} className="text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Est. Cost</p>
                  <p className="text-lg font-bold text-green-600">${stats.estimatedCost}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Type" size={20} className="text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Characters</p>
                  <p className="text-lg font-bold text-purple-600">{stats.characterCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Send Actions */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">Ready to Send?</h3>
            <p className="text-sm text-gray-600">
              Your message will be sent to {stats.recipients} recipients
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              icon="Save"
            >
              Save Template
            </Button>
            <Button
              onClick={handleSendMessages}
              loading={sending}
              disabled={!message.trim() || sending}
              icon="Send"
              size="lg"
            >
              {sending ? 'Sending...' : 'Send Messages'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default MessageComposer