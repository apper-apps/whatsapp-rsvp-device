import React, { useState } from 'react'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import FilterDropdown from '@/components/molecules/FilterDropdown'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { format } from 'date-fns'

const ContactsTable = ({ contacts, eventId, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [rsvpFilter, setRsvpFilter] = useState('all')

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'sent', label: 'Sent' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'read', label: 'Read' },
    { value: 'failed', label: 'Failed' }
  ]

  const rsvpOptions = [
    { value: 'all', label: 'All RSVP' },
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'maybe', label: 'Maybe' },
    { value: 'pending', label: 'Pending' }
  ]

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm) ||
                         (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || contact.messageStatus === statusFilter
    const matchesRsvp = rsvpFilter === 'all' || contact.rsvpStatus === rsvpFilter
    
    return matchesSearch && matchesStatus && matchesRsvp
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
      read: 'read',
      pending: 'pending'
    }

    const icons = {
      sent: 'Send',
      delivered: 'Check',
      read: 'CheckCheck',
      pending: 'Clock'
    }

    return (
      <Badge variant={variants[status]} icon={icons[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getRsvpBadge = (rsvpStatus) => {
    const variants = {
      yes: 'yes',
      no: 'no',
      maybe: 'maybe',
      pending: 'pending'
    }

    const icons = {
      yes: 'Check',
      no: 'X',
      maybe: 'Clock',
      pending: 'Clock'
    }

    return (
      <Badge variant={variants[rsvpStatus]} icon={icons[rsvpStatus]}>
        {rsvpStatus.charAt(0).toUpperCase() + rsvpStatus.slice(1)}
      </Badge>
    )
  }

  if (contacts.length === 0) {
    return (
      <Empty
        title="No contacts assigned"
        description="Assign contact lists to this event to start sending invitations"
        icon="Users"
        actionLabel="Manage Contact Lists"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
          />
        </div>
        <div className="flex space-x-4">
          <FilterDropdown
            label="Message Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            label="RSVP Status"
            options={rsvpOptions}
            value={rsvpFilter}
            onChange={setRsvpFilter}
          />
        </div>
      </div>

      {/* Contacts Table */}
      {filteredContacts.length === 0 ? (
        <Empty
          title="No contacts found"
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
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.Id} className="border-b border-gray-100">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{contact.name}</div>
                      {contact.tags && contact.tags.length > 0 && (
                        <div className="flex space-x-1 mt-1">
                          {contact.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="default" size="sm">{tag}</Badge>
                          ))}
                          {contact.tags.length > 2 && (
                            <Badge variant="default" size="sm">+{contact.tags.length - 2}</Badge>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-mono">{contact.phone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">{contact.email || '—'}</div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(contact.messageStatus, contact.messageError)}
                    </td>
                    <td className="py-4 px-6">
                      {getRsvpBadge(contact.rsvpStatus)}
                    </td>
                    <td className="py-4 px-6">
                      {contact.lastMessageAt ? (
                        <div className="text-sm text-gray-600">
                          {format(new Date(contact.lastMessageAt), 'MMM dd, yyyy')}
                          <div className="text-xs text-gray-400">
                            {format(new Date(contact.lastMessageAt), 'HH:mm')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="MessageSquare"
                        >
                          Message
                        </Button>
                        {contact.messageStatus === 'failed' && (
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
    </div>
  )
}

export default ContactsTable