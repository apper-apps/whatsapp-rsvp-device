import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import FilterDropdown from '@/components/molecules/FilterDropdown'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import messageService from '@/services/api/messageService'
import contactService from '@/services/api/contactService'
import eventService from '@/services/api/eventService'
import { format } from 'date-fns'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [contacts, setContacts] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'sent', label: 'Sent' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'read', label: 'Read' },
    { value: 'failed', label: 'Failed' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [messagesData, contactsData, eventsData] = await Promise.all([
        messageService.getAll(),
        contactService.getAllContacts(),
        eventService.getAll()
      ])
      
      setMessages(messagesData)
      setContacts(contactsData)
      setEvents(eventsData)
    } catch (err) {
      setError(err.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === parseInt(contactId))
    return contact ? contact.name : 'Unknown Contact'
  }

  const getEventName = (eventId) => {
    const event = events.find(e => e.Id === parseInt(eventId))
    return event ? event.name : 'Unknown Event'
  }

  const eventOptions = [
    { value: 'all', label: 'All Events' },
    ...events.map(event => ({ value: event.Id.toString(), label: event.name }))
  ]

  const filteredMessages = messages.filter(message => {
    const contactName = getContactName(message.contactId)
    const eventName = getEventName(message.eventId)
    
    const matchesSearch = contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter
    const matchesEvent = eventFilter === 'all' || message.eventId === eventFilter
    
    return matchesSearch && matchesStatus && matchesEvent
  })

  const getStatusBadge = (status, error) => {
    if (status === 'failed') {
      return (
        <div className="flex items-center space-x-1">
          <Badge variant="failed" icon="X">Failed</Badge>
          {error && (
            <div className="relative group">
              <ApperIcon name="Info" size={14} className="text-red-500 cursor-help" />
              <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {error}
              </div>
            </div>
          )}
        </div>
      )
    }
    
    const variants = {
      sent: 'sent',
      delivered: 'delivered',
      read: 'read'
    }
    
    const icons = {
      sent: 'Send',
      delivered: 'Check',
      read: 'CheckCheck'
    }
    
    return (
      <Badge variant={variants[status]} icon={icons[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'invitation': return 'Mail'
      case 'reminder': return 'Bell'
      default: return 'MessageSquare'
    }
  }

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  if (messages.length === 0) {
    return (
      <Empty
        title="No messages sent yet"
        description="Start sending WhatsApp invitations to collect RSVPs for your events"
        icon="MessageSquare"
        actionLabel="Go to Events"
        onAction={() => window.location.href = '/events'}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Track your WhatsApp invitation messages and delivery status</p>
        </div>
        <Button
          variant="outline"
          icon="Download"
        >
          Export Messages
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages, contacts, or events..."
          />
        </div>
        <div className="flex space-x-4">
          <FilterDropdown
            label="Filter by event"
            options={eventOptions}
            value={eventFilter}
            onChange={setEventFilter}
          />
          <FilterDropdown
            label="Filter by status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Messages Table */}
      {filteredMessages.length === 0 ? (
        <Empty
          title="No messages found"
          description="Try adjusting your search or filter criteria"
          icon="Search"
        />
      ) : (
        <Card padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full table-zebra">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Event</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Sent</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Message Preview</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message) => (
                  <tr key={message.Id} className="border-b border-gray-100">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {getContactName(message.contactId)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        {getEventName(message.eventId)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <ApperIcon 
                          name={getMessageTypeIcon(message.messageType)} 
                          size={16} 
                          className="mr-2 text-gray-400" 
                        />
                        <span className="text-sm capitalize">{message.messageType}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(message.status, message.error)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        {format(new Date(message.sentAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {format(new Date(message.sentAt), 'HH:mm')}
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="text-sm text-gray-600 truncate">
                        {message.content.substring(0, 80)}...
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Eye"
                        >
                          View
                        </Button>
                        {message.status === 'failed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon="RefreshCw"
                          >
                            Retry
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  )
}

export default Messages