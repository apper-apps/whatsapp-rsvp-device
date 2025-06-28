import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import FilterDropdown from '@/components/molecules/FilterDropdown'
import StatsCard from '@/components/molecules/StatsCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import CreateEventModal from '@/components/organisms/CreateEventModal'
import ApperIcon from '@/components/ApperIcon'
import eventService from '@/services/api/eventService'
import { format } from 'date-fns'

const EventsDashboard = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const statusOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'completed', label: 'Completed' }
  ]

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await eventService.getAll()
      setEvents(data)
    } catch (err) {
      setError(err.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateEvent = () => {
    setShowCreateModal(true)
  }

  const handleEventCreated = (newEvent) => {
    setEvents(prev => [...prev, newEvent])
    setShowCreateModal(false)
  }

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'draft': return 'warning'
      case 'completed': return 'info'
      default: return 'default'
    }
  }

  const getRsvpProgress = (event) => {
    // Mock RSVP progress calculation
    const total = 120
    const responded = Math.floor(Math.random() * total)
    return { responded, total, percentage: (responded / total * 100).toFixed(1) }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="stats" />
        <Loading type="cards" count={6} />
      </div>
    )
  }

  if (error) {
    return <Error message={error} onRetry={loadEvents} />
  }

  if (events.length === 0 && !searchTerm && statusFilter === 'all') {
    return (
      <Empty
        title="No events yet"
        description="Create your first event to start collecting RSVPs through WhatsApp"
        icon="Calendar"
        actionLabel="Create Event"
        onAction={handleCreateEvent}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Events"
          value={events.length}
          icon="Calendar"
          color="whatsapp-primary"
        />
        <StatsCard
          title="Active Events"
          value={events.filter(e => e.status === 'active').length}
          icon="Play"
          color="blue"
        />
        <StatsCard
          title="Total Invites"
          value="1,247"
          change="+12%"
          trend="up"
          icon="Send"
          color="purple"
        />
        <StatsCard
          title="Response Rate"
          value="78.5%"
          change="+5.2%"
          trend="up"
          icon="TrendingUp"
          color="orange"
        />
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <p className="text-gray-600">Manage your WhatsApp RSVP events</p>
        </div>
        <Button
          onClick={handleCreateEvent}
          icon="Plus"
          size="lg"
        >
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
          />
        </div>
        <FilterDropdown
          label="Filter by status"
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Empty
          title="No events found"
          description="Try adjusting your search or filter criteria"
          icon="Search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const rsvpProgress = getRsvpProgress(event)
            
            return (
              <Card
                key={event.Id}
                hover={true}
                onClick={() => handleViewEvent(event.Id)}
                className="cursor-pointer group"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-whatsapp-primary transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(new Date(event.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-gray-600">
                    <ApperIcon name="MapPin" size={16} className="mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>

                  {/* RSVP Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">RSVP Progress</span>
                      <span className="font-medium">
                        {rsvpProgress.responded}/{rsvpProgress.total} ({rsvpProgress.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-whatsapp-primary to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${rsvpProgress.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Contact Lists */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Users" size={16} className="mr-2" />
                      <span>{event.contactLists?.length || 0} lists assigned</span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="ArrowRight"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewEvent(event.Id)
                      }}
                    />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </motion.div>
  )
}

export default EventsDashboard