import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import StatsCard from '@/components/molecules/StatsCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ContactsTable from '@/components/organisms/ContactsTable'
import MessageComposer from '@/components/organisms/MessageComposer'
import ApperIcon from '@/components/ApperIcon'
import eventService from '@/services/api/eventService'
import contactService from '@/services/api/contactService'
import messageService from '@/services/api/messageService'
import { format } from 'date-fns'

const EventDetail = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
const [event, setEvent] = useState(null)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [reminderSettings, setReminderSettings] = useState(null)
  const [isAdmin] = useState(true) // Mock admin check
  useEffect(() => {
    loadEventData()
  }, [eventId])

const loadEventData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [eventData, statsData, reminderData] = await Promise.all([
        eventService.getById(eventId),
        eventService.getEventStats(eventId),
        eventService.getReminderSettings(eventId)
      ])
      
      setEvent(eventData)
      setStats(statsData)
      setReminderSettings(reminderData)
      
      // Load contacts for assigned lists
      if (eventData.contactLists?.length > 0) {
        const allContacts = []
        for (const listId of eventData.contactLists) {
          const listContacts = await contactService.getContactsByListId(listId)
          allContacts.push(...listContacts)
        }
        setContacts(allContacts)
      }
    } catch (err) {
      setError(err.message || 'Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessages = async (messageData) => {
    try {
      const contactIds = contacts.map(c => c.Id)
      await messageService.sendBulkMessages(eventId, contactIds, messageData.content)
      loadEventData() // Refresh data
    } catch (err) {
      console.error('Failed to send messages:', err)
    }
}

  const handleSaveReminders = async (reminderData) => {
    try {
      await eventService.saveReminderSettings(eventId, reminderData)
      setReminderSettings(reminderData)
    } catch (err) {
      console.error('Failed to save reminder settings:', err)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'contacts', label: 'Contacts', icon: 'Users' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
    ...(isAdmin ? [{ id: 'reminders', label: 'Reminders', icon: 'Bell' }] : [])
  ]
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-200 rounded-xl animate-shimmer"></div>
        <Loading type="stats" />
        <Loading type="table" />
      </div>
    )
  }

  if (error) {
    return <Error message={error} onRetry={loadEventData} />
  }

  if (!event) {
    return <Error message="Event not found" />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Event Header */}
      <Card className="bg-gradient-to-r from-whatsapp-primary to-green-500 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-start space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon="ArrowLeft"
              onClick={() => navigate('/events')}
              className="text-white hover:bg-white hover:bg-opacity-20"
            />
<div>
              <h1 className="text-2xl font-bold">{event.name}</h1>
              <div className="flex items-center mt-2">
                <Badge variant="whatsapp" className="bg-white bg-opacity-20 text-white">
                  {event.status}
                </Badge>
              </div>
            </div>
</div>
          
<div className="flex space-x-3">
            <Button
              variant="secondary"
              size="sm"
              icon="Share"
            >
              Share
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Invited"
            value={stats.totalInvited}
            icon="Send"
            color="blue"
          />
          <StatsCard
            title="Messages Delivered"
            value={`${stats.delivered} (${stats.deliveryRate}%)`}
            icon="Check"
            color="whatsapp-primary"
          />
          <StatsCard
            title="RSVP Responses"
            value={stats.responded}
            icon="MessageCircle"
            color="purple"
          />
          <StatsCard
            title="Attending"
            value={stats.attending}
            icon="UserCheck"
            color="orange"
          />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-whatsapp-primary text-whatsapp-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Event Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900">{event.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">RSVP Form URL</label>
                  <p className="text-blue-600 hover:underline cursor-pointer">{event.rsvpFormUrl}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Lists</label>
                  <p className="text-gray-900">{event.contactLists?.length || 0} lists assigned</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  icon="Send"
                  className="w-full justify-center"
                  onClick={() => setActiveTab('messages')}
                >
                  Send Messages
                </Button>
                <Button
                  variant="outline"
                  icon="UserPlus"
                  className="w-full justify-center"
                >
                  Manage Contact Lists
                </Button>
                <Button
                  variant="outline"
                  icon="Download"
                  className="w-full justify-center"
                >
                  Export RSVP Data
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'contacts' && (
          <ContactsTable 
            contacts={contacts}
            eventId={eventId}
            onRefresh={loadEventData}
          />
        )}

        {activeTab === 'messages' && (
          <MessageComposer
            event={event}
            contacts={contacts}
            onSendMessages={handleSendMessages}
          />
)}

        {activeTab === 'reminders' && reminderSettings && (
          <Card>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Event Reminder Settings</h3>
                <p className="text-sm text-gray-600">Configure reminder settings specific to this event (overrides global settings)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Reminders
                  </label>
                  <select
                    value={reminderSettings.maxReminders}
                    onChange={(e) => setReminderSettings(prev => ({ ...prev, maxReminders: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration Between Reminders
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={reminderSettings.maxDurationValue}
                      onChange={(e) => setReminderSettings(prev => ({ ...prev, maxDurationValue: parseInt(e.target.value) }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent"
                    />
                    <select
                      value={reminderSettings.maxDurationType}
                      onChange={(e) => setReminderSettings(prev => ({ ...prev, maxDurationType: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="overrideGlobal"
                  checked={reminderSettings.overrideGlobal}
                  onChange={(e) => setReminderSettings(prev => ({ ...prev, overrideGlobal: e.target.checked }))}
                  className="h-4 w-4 text-whatsapp-primary focus:ring-whatsapp-primary border-gray-300 rounded"
                />
                <label htmlFor="overrideGlobal" className="text-sm font-medium text-gray-700">
                  Override global reminder settings for this event
                </label>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="AlertTriangle" size={20} className="text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-900">Event-Specific Settings</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      {reminderSettings.overrideGlobal 
                        ? 'This event will use these custom reminder settings instead of the global configuration.'
                        : 'Enable override to use custom settings for this event. Otherwise, global settings will apply.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  onClick={() => handleSaveReminders(reminderSettings)}
                  icon="Save"
                >
                  Save Reminder Settings
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  )
}

export default EventDetail