import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import CreateListModal from '@/components/organisms/CreateListModal'
import ImportContactsModal from '@/components/organisms/ImportContactsModal'
import ApperIcon from '@/components/ApperIcon'
import contactService from '@/services/api/contactService'
import { format } from 'date-fns'

const ContactLists = () => {
  const [contactLists, setContactLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedList, setSelectedList] = useState(null)

  useEffect(() => {
    loadContactLists()
  }, [])

  const loadContactLists = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await contactService.getAllLists()
      setContactLists(data)
    } catch (err) {
      setError(err.message || 'Failed to load contact lists')
    } finally {
      setLoading(false)
    }
  }

  const filteredLists = contactLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreateList = () => {
    setShowCreateModal(true)
  }

  const handleImportContacts = (list) => {
    setSelectedList(list)
    setShowImportModal(true)
  }

  const handleListCreated = (newList) => {
    setContactLists(prev => [...prev, newList])
    setShowCreateModal(false)
  }

  const handleContactsImported = () => {
    loadContactLists() // Refresh to update contact counts
    setShowImportModal(false)
  }

  const handleDeleteList = async (listId) => {
    if (window.confirm('Are you sure you want to delete this contact list?')) {
      try {
        await contactService.deleteList(listId)
        setContactLists(prev => prev.filter(list => list.Id !== listId))
      } catch (err) {
        console.error('Failed to delete list:', err)
      }
    }
  }

  if (loading) {
    return <Loading type="cards" count={6} />
  }

  if (error) {
    return <Error message={error} onRetry={loadContactLists} />
  }

  if (contactLists.length === 0 && !searchTerm) {
    return (
      <Empty
        title="No contact lists yet"
        description="Create your first contact list to organize your event invitations"
        icon="Users"
        actionLabel="Create Contact List"
        onAction={handleCreateList}
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
          <h1 className="text-2xl font-bold text-gray-900">Contact Lists</h1>
          <p className="text-gray-600">Organize your contacts for targeted event invitations</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon="Upload"
            onClick={() => setShowImportModal(true)}
          >
            Import Contacts
          </Button>
          <Button
            onClick={handleCreateList}
            icon="Plus"
          >
            Create List
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contact lists..."
        />
      </div>

      {/* Contact Lists Grid */}
      {filteredLists.length === 0 ? (
        <Empty
          title="No contact lists found"
          description="Try adjusting your search criteria"
          icon="Search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map((list) => (
            <Card
              key={list.Id}
              hover={true}
              className="group cursor-pointer"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-whatsapp-primary transition-colors">
                      {list.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Created {format(new Date(list.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Upload"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleImportContacts(list)
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteList(list.Id)
                      }}
                      className="text-red-600 hover:text-red-700"
                    />
                  </div>
                </div>

                {/* Description */}
                {list.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {list.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <ApperIcon name="Users" size={16} className="mr-2" />
                    <span className="text-sm font-medium">
                      {list.contactCount} contacts
                    </span>
                  </div>
                  
                  {list.tags && list.tags.length > 0 && (
                    <div className="flex space-x-1">
                      {list.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="default" size="sm">
                          {tag}
                        </Badge>
                      ))}
                      {list.tags.length > 2 && (
                        <Badge variant="default" size="sm">
                          +{list.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Eye"
                    className="flex-1"
                  >
                    View Contacts
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon="Send"
                    className="flex-1"
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateListModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onListCreated={handleListCreated}
        />
      )}

      {showImportModal && (
        <ImportContactsModal
          isOpen={showImportModal}
          onClose={() => {
            setShowImportModal(false)
            setSelectedList(null)
          }}
          contactList={selectedList}
          onContactsImported={handleContactsImported}
        />
      )}
    </motion.div>
  )
}

export default ContactLists