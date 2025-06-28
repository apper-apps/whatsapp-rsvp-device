import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import contactService from '@/services/api/contactService'

const ImportContactsModal = ({ isOpen, onClose, contactList, onContactsImported }) => {
  const [dragActive, setDragActive] = useState(false)
  const [csvData, setCsvData] = useState([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Upload, 2: Preview, 3: Import

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type !== 'text/csv') {
      alert('Please upload a CSV file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/"/g, '')))
      const headers = rows[0]
      const data = rows.slice(1).filter(row => row.length >= 2 && row[0] && row[1])

      const parsedData = data.map(row => ({
        name: row[0] || '',
        phone: row[1] || '',
        email: row[2] || '',
        tags: row[3] || ''
      }))

      setCsvData(parsedData)
      setStep(2)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!contactList) return

    setLoading(true)
    try {
      await contactService.importContacts(contactList.Id, csvData)
      onContactsImported()
      setStep(1)
      setCsvData([])
    } catch (error) {
      console.error('Failed to import contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      setCsvData([])
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
            className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Import Contacts</h2>
                <p className="text-sm text-gray-600">
                  {contactList ? `Import to "${contactList.name}"` : 'Upload your CSV file'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClose}
              />
            </div>

            <div className="p-6">
              {step === 1 && (
                <div className="space-y-6">
                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-whatsapp-primary bg-whatsapp-light'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <ApperIcon name="Upload" size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Upload CSV File
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Drag and drop your CSV file here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileInput}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload">
                      <Button variant="outline" icon="Upload">
                        Choose File
                      </Button>
                    </label>
                  </div>

                  {/* CSV Format Requirements */}
                  <Card>
                    <h4 className="font-medium text-gray-900 mb-3">CSV Format Requirements</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Your CSV file should have the following columns (in order):</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Name</strong> (required) - Contact's full name</li>
                        <li><strong>Phone</strong> (required) - Phone number with country code</li>
                        <li><strong>Email</strong> (optional) - Email address</li>
                        <li><strong>Tags</strong> (optional) - Comma-separated tags</li>
                      </ul>
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium mb-1">Example CSV format:</p>
                        <code className="text-xs text-gray-700">
                          John Smith,+60123456789,john@email.com,vip,client<br />
                          Sarah Johnson,+60123456790,sarah@media.com,press,journalist
                        </code>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Preview Import</h3>
                      <p className="text-sm text-gray-600">
                        Review {csvData.length} contacts before importing
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      icon="ArrowLeft"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </div>

                  {/* Preview Table */}
                  <Card padding="p-0">
                    <div className="overflow-x-auto max-h-96">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Phone</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Tags</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvData.slice(0, 10).map((contact, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="py-3 px-4">{contact.name}</td>
                              <td className="py-3 px-4 font-mono text-sm">{contact.phone}</td>
                              <td className="py-3 px-4 text-sm">{contact.email || '—'}</td>
                              <td className="py-3 px-4 text-sm">{contact.tags || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {csvData.length > 10 && (
                        <div className="p-4 text-center text-sm text-gray-500 border-t">
                          ... and {csvData.length - 10} more contacts
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                {step === 2 && (
                  <Button
                    onClick={handleImport}
                    loading={loading}
                    icon="Download"
                  >
                    Import {csvData.length} Contacts
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default ImportContactsModal