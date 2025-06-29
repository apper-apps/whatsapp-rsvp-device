import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import contactListService from '@/services/api/contactListService'
import eventService from '@/services/api/eventService'

const ManageContactListsModal = ({ event, onClose, onUpdated }) => {
  const [assignedLists, setAssignedLists] = useState([])
  const [availableLists, setAvailableLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadContactLists()
  }, [event])

  const loadContactLists = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [assigned, available] = await Promise.all([
        event.contactLists?.length > 0 
          ? Promise.all(event.contactLists.map(id => contactListService.getById(id)))
          : [],
        contactListService.getAvailableForEvent(event.Id, event.contactLists || [])
      ])
      
      setAssignedLists(assigned)
      setAvailableLists(available)
    } catch (err) {
      setError(err.message || 'Failed to load contact lists')
    } finally {
      setLoading(false)
    }
  }

  const handleAssignList = async (listId) => {
    try {
      setProcessing(true)
      await eventService.assignContactList(event.Id, listId)
      await loadContactLists()
      onUpdated && onUpdated()
    } catch (err) {
      console.error('Failed to assign contact list:', err)
    } finally {
      setProcessing(false)
    }
  }

  const handleUnassignList = async (listId) => {
    try {
      setProcessing(true)
      await eventService.unassignContactList(event.Id, listId)
      await loadContactLists()
      onUpdated && onUpdated()
    } catch (err) {
      console.error('Failed to unassign contact list:', err)
    } finally {
      setProcessing(false)
    }
  }

  const filteredAvailableLists = availableLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredAssignedLists = assignedLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Manage Contact Lists
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Assign or remove contact lists for "{event.name}"
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              />
            </div>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <Input
              type="text"
              placeholder="Search contact lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
              className="w-full"
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <Loading type="table" />
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadContactLists}
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assigned Lists */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Assigned Lists ({filteredAssignedLists.length})
                    </h3>
                    <Badge variant="whatsapp">
                      <ApperIcon name="Check" size={12} className="mr-1" />
                      Active
                    </Badge>
                  </div>
                  
                  {filteredAssignedLists.length === 0 ? (
                    <Empty
                      title="No assigned lists"
                      description={searchTerm ? "No assigned lists match your search" : "No contact lists are currently assigned to this event"}
                      icon="Users"
                    />
                  ) : (
                    <div className="space-y-3">
                      {filteredAssignedLists.map((list) => (
                        <div
                          key={list.Id}
                          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{list.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {list.contactCount} contacts
                            </p>
                            {list.description && (
                              <p className="text-xs text-gray-500 mt-1">
                                {list.description}
                              </p>
                            )}
                            {list.tags && list.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {list.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            icon="Minus"
                            onClick={() => handleUnassignList(list.Id)}
                            disabled={processing}
                            className="ml-3 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Available Lists */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Available Lists ({filteredAvailableLists.length})
                    </h3>
                    <Badge variant="secondary">
                      <ApperIcon name="Plus" size={12} className="mr-1" />
                      Available
                    </Badge>
                  </div>
                  
                  {filteredAvailableLists.length === 0 ? (
                    <Empty
                      title="No available lists"
                      description={searchTerm ? "No available lists match your search" : "All contact lists are already assigned to this event"}
                      icon="Users"
                    />
                  ) : (
                    <div className="space-y-3">
                      {filteredAvailableLists.map((list) => (
                        <div
                          key={list.Id}
                          className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{list.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {list.contactCount} contacts
                            </p>
                            {list.description && (
                              <p className="text-xs text-gray-500 mt-1">
                                {list.description}
                              </p>
                            )}
                            {list.tags && list.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {list.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            icon="Plus"
                            onClick={() => handleAssignList(list.Id)}
                            disabled={processing}
                            className="ml-3 text-whatsapp-primary border-whatsapp-primary hover:bg-whatsapp-primary hover:text-white"
                          >
                            Assign
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ManageContactListsModal