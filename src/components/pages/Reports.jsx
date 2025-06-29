import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import SearchBar from '@/components/molecules/SearchBar'
import FilterDropdown from '@/components/molecules/FilterDropdown'
import StatsCard from '@/components/molecules/StatsCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import eventService from '@/services/api/eventService'
import contactService from '@/services/api/contactService'
import messageService from '@/services/api/messageService'
import rsvpService from '@/services/api/rsvpService'
import { format } from 'date-fns'
import Papa from 'papaparse'

const Reports = () => {
  const [events, setEvents] = useState([])
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState([])
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
const [searchTerm, setSearchTerm] = useState('')
  const [eventFilter, setEventFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState('all')
  const [selectedRsvpStatus, setSelectedRsvpStatus] = useState([])

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [eventsData, contactsData, messagesData, rsvpsData] = await Promise.all([
        eventService.getAll(),
        contactService.getAllContacts(),
        messageService.getAll(),
        rsvpService.getAll()
      ])
      
      setEvents(eventsData)
      setContacts(contactsData)
      setMessages(messagesData)
      setRsvps(rsvpsData)
    } catch (err) {
      setError(err.message || 'Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  const eventOptions = [
    { value: 'all', label: 'All Events' },
    ...events.map(event => ({ value: event.Id.toString(), label: event.name }))
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'sent', label: 'Message Sent' },
    { value: 'delivered', label: 'Message Delivered' },
    { value: 'read', label: 'Message Read' },
    { value: 'responded', label: 'RSVP Responded' },
    { value: 'failed', label: 'Message Failed' }
]

  const rsvpStatusOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'maybe', label: 'Maybe' },
    { value: 'pending', label: 'Pending' }
  ]
  const generateReportData = () => {
    return contacts.map(contact => {
      const contactMessages = messages.filter(m => m.contactId === contact.Id.toString())
      const contactRsvps = rsvps.filter(r => r.phone === contact.phone)
      const latestMessage = contactMessages.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))[0]
      const latestRsvp = contactRsvps.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0]

      return {
        ...contact,
        messageStatus: latestMessage?.status || 'pending',
        rsvpStatus: latestRsvp?.response || 'pending',
        lastMessageAt: latestMessage?.sentAt,
        rsvpSubmittedAt: latestRsvp?.submittedAt,
        messageError: latestMessage?.error,
        eventId: latestMessage?.eventId
      }
    })
  }

  const reportData = generateReportData()

  const filteredData = reportData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.phone.includes(searchTerm) ||
                         (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesEvent = eventFilter === 'all' || item.eventId === eventFilter
    
    let matchesStatus = true
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'sent':
        case 'delivered':
        case 'read':
        case 'failed':
          matchesStatus = item.messageStatus === statusFilter
          break
        case 'responded':
          matchesStatus = item.rsvpStatus !== 'pending'
          break
      }
    }
    
    return matchesSearch && matchesEvent && matchesStatus
  })

  const getOverallStats = () => {
    const totalContacts = reportData.length
    const messagesSent = reportData.filter(item => ['sent', 'delivered', 'read'].includes(item.messageStatus)).length
    const messagesDelivered = reportData.filter(item => ['delivered', 'read'].includes(item.messageStatus)).length
    const messagesRead = reportData.filter(item => item.messageStatus === 'read').length
    const rsvpResponded = reportData.filter(item => item.rsvpStatus !== 'pending').length
    const rsvpYes = reportData.filter(item => item.rsvpStatus === 'yes').length

    return {
      totalContacts,
      messagesSent,
      messagesDelivered,
      messagesRead,
      rsvpResponded,
      rsvpYes,
      deliveryRate: totalContacts > 0 ? ((messagesDelivered / totalContacts) * 100).toFixed(1) : 0,
      responseRate: totalContacts > 0 ? ((rsvpResponded / totalContacts) * 100).toFixed(1) : 0
    }
  }

  const stats = getOverallStats()

  const getStatusBadge = (messageStatus, rsvpStatus, error) => {
    if (messageStatus === 'failed') {
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

    const messageVariants = {
      sent: 'sent',
      delivered: 'delivered',
      read: 'read',
      pending: 'pending'
    }

    return (
      <Badge variant={messageVariants[messageStatus]} icon={
        messageStatus === 'read' ? 'CheckCheck' : 
        messageStatus === 'delivered' ? 'Check' : 
        messageStatus === 'sent' ? 'Send' : 'Clock'
      }>
        {messageStatus.charAt(0).toUpperCase() + messageStatus.slice(1)}
      </Badge>
    )
  }

  const getRsvpBadge = (rsvpStatus) => {
    if (rsvpStatus === 'pending') {
      return <Badge variant="pending" icon="Clock">Pending</Badge>
    }

    const variants = {
      yes: 'yes',
      no: 'no',
      maybe: 'maybe'
    }

    const icons = {
      yes: 'Check',
      no: 'X',
      maybe: 'Clock'
    }

    return (
      <Badge variant={variants[rsvpStatus]} icon={icons[rsvpStatus]}>
        {rsvpStatus.charAt(0).toUpperCase() + rsvpStatus.slice(1)}
      </Badge>
    )
  }

const handleExportWithFilters = () => {
    setShowExportModal(true)
  }

  const handleExportData = async () => {
    try {
      let dataToExport = [...reportData]

      // Apply event filter
      if (selectedEventId !== 'all') {
        dataToExport = dataToExport.filter(item => item.eventId === selectedEventId)
      }

      // Apply RSVP status filter
      if (selectedRsvpStatus.length > 0) {
        dataToExport = dataToExport.filter(item => selectedRsvpStatus.includes(item.rsvpStatus))
      }

      const csvData = dataToExport.map(item => ({
        'Name': item.name,
        'Phone': item.phone,
        'Email': item.email || '',
        'Message Status': item.messageStatus,
        'RSVP Status': item.rsvpStatus,
        'Last Message': item.lastMessageAt ? format(new Date(item.lastMessageAt), 'yyyy-MM-dd HH:mm') : '',
        'RSVP Date': item.rsvpSubmittedAt ? format(new Date(item.rsvpSubmittedAt), 'yyyy-MM-dd HH:mm') : '',
        'Notes': item.messageError || ''
      }))

      const csv = Papa.unparse(csvData)
      
      // Create filename with filter context
      let filename = 'rsvp-report'
      if (selectedEventId !== 'all') {
        const selectedEvent = events.find(e => e.Id.toString() === selectedEventId)
        filename += `-${selectedEvent?.name.replace(/[^a-zA-Z0-9]/g, '-') || 'event'}`
      }
      if (selectedRsvpStatus.length > 0 && selectedRsvpStatus.length < 4) {
        filename += `-${selectedRsvpStatus.join('-')}`
      }
      filename += `-${Date.now()}.csv`

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      window.URL.revokeObjectURL(url)
      
      setShowExportModal(false)
      setSelectedEventId('all')
      setSelectedRsvpStatus([])
    } catch (err) {
      console.error('Failed to export data:', err)
    }
  }

  const toggleRsvpStatus = (status) => {
    setSelectedRsvpStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="stats" />
        <Loading type="table" />
      </div>
    )
  }

  if (error) {
    return <Error message={error} onRetry={loadReportData} />
  }

  if (reportData.length === 0) {
    return (
      <Empty
        title="No report data available"
        description="Start sending invitations to generate comprehensive reports"
        icon="BarChart3"
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
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Comprehensive RSVP and engagement analytics</p>
        </div>
<Button
          variant="outline"
          icon="Download"
          onClick={handleExportWithFilters}
        >
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon="Users"
          color="blue"
        />
        <StatsCard
          title="Messages Delivered"
value={`${stats.messagesDelivered} (${stats.deliveryRate}%)`}
          icon="Check"
          color="basecamp-green"
        />
        <StatsCard
          title="RSVP Responses"
          value={`${stats.rsvpResponded} (${stats.responseRate}%)`}
          icon="MessageCircle"
          color="purple"
        />
        <StatsCard
          title="Confirmed Attending"
          value={stats.rsvpYes}
          icon="UserCheck"
          color="orange"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts, phone numbers, or emails..."
          />
        </div>
<div className="flex space-x-4">
          <FilterDropdown
            label="Filter by event"
            options={eventOptions}
            value={eventFilter}
            onChange={setEventFilter}
            searchable={true}
          />
          <FilterDropdown
            label="Filter by status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Reports Table */}
      {filteredData.length === 0 ? (
        <Empty
          title="No data matches your filters"
          description="Try adjusting your search or filter criteria"
          icon="Search"
        />
      ) : (
        <Card padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full table-zebra">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Phone</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Message Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">RSVP Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Message</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">RSVP Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.Id} className="border-b border-gray-100">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex space-x-1 mt-1">
                          {item.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="default" size="sm">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-mono">{item.phone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">{item.email || '—'}</div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(item.messageStatus, item.rsvpStatus, item.messageError)}
                    </td>
                    <td className="py-4 px-6">
                      {getRsvpBadge(item.rsvpStatus)}
                    </td>
                    <td className="py-4 px-6">
                      {item.lastMessageAt ? (
                        <div className="text-sm text-gray-600">
                          {format(new Date(item.lastMessageAt), 'MMM dd, yyyy')}
                          <div className="text-xs text-gray-400">
                            {format(new Date(item.lastMessageAt), 'HH:mm')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {item.rsvpSubmittedAt ? (
                        <div className="text-sm text-gray-600">
                          {format(new Date(item.rsvpSubmittedAt), 'MMM dd, yyyy')}
                          <div className="text-xs text-gray-400">
                            {format(new Date(item.rsvpSubmittedAt), 'HH:mm')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
)}

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Export Report</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Event
                  </label>
                  <FilterDropdown
                    label="Choose event"
                    options={eventOptions}
                    value={selectedEventId}
                    onChange={setSelectedEventId}
                    searchable={true}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RSVP Status (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {rsvpStatusOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRsvpStatus.includes(option.value)}
                          onChange={() => toggleRsvpStatus(option.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {selectedRsvpStatus.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">All RSVP statuses will be included</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowExportModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleExportData}
                  icon="Download"
                  className="flex-1"
                >
                  Export
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Reports