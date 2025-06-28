import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const Settings = () => {
  const [whatsappSettings, setWhatsappSettings] = useState({
    businessApiToken: '',
    phoneNumberId: '',
    webhookUrl: '',
    isConnected: false
  })

  const [messageTemplates, setMessageTemplates] = useState([
    {
      id: 1,
      name: 'Default Invitation',
      content: 'Hi {Name}, you\'re invited to {Event}! RSVP here: {link}',
      isDefault: true
    },
    {
      id: 2,
      name: 'Formal Invitation',
      content: 'Dear {Name}, we cordially invite you to {Event}. Please confirm your attendance: {link}',
      isDefault: false
    }
  ])

const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    dailyReports: true,
    deliveryUpdates: true,
    rsvpAlerts: true
  })

  const [reminderSettings, setReminderSettings] = useState({
    maxReminders: 3,
    maxDurationValue: 7,
    maxDurationType: 'days'
  })
  const handleSaveWhatsAppSettings = () => {
    // Mock save functionality
    setWhatsappSettings(prev => ({ ...prev, isConnected: true }))
    toast.success('WhatsApp settings saved successfully!')
  }

  const handleTestConnection = () => {
    // Mock connection test
    setTimeout(() => {
      toast.success('WhatsApp connection test successful!')
    }, 1000)
  }

  const handleSaveTemplate = (template) => {
    setMessageTemplates(prev => 
      prev.map(t => t.id === template.id ? template : t)
    )
    toast.success('Template saved successfully!')
  }

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setMessageTemplates(prev => prev.filter(t => t.id !== templateId))
      toast.success('Template deleted successfully!')
    }
  }

const handleSaveNotifications = () => {
    toast.success('Notification settings saved successfully!')
  }

  const handleSaveReminders = () => {
    toast.success('Reminder settings saved successfully!')
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your WhatsApp RSVP Pro application</p>
      </div>

      {/* WhatsApp Business API Settings */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">WhatsApp Business API</h2>
              <p className="text-sm text-gray-600">Connect your WhatsApp Business account</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${whatsappSettings.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <Badge variant={whatsappSettings.isConnected ? 'success' : 'error'}>
                {whatsappSettings.isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Business API Token"
              type="password"
              value={whatsappSettings.businessApiToken}
              onChange={(e) => setWhatsappSettings(prev => ({ ...prev, businessApiToken: e.target.value }))}
              placeholder="Enter your WhatsApp Business API token"
              icon="Key"
            />
            
            <Input
              label="Phone Number ID"
              value={whatsappSettings.phoneNumberId}
              onChange={(e) => setWhatsappSettings(prev => ({ ...prev, phoneNumberId: e.target.value }))}
              placeholder="Phone number ID from Meta"
              icon="Phone"
            />
            
            <div className="md:col-span-2">
              <Input
                label="Webhook URL"
                value={whatsappSettings.webhookUrl}
                onChange={(e) => setWhatsappSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="https://your-domain.com/webhook"
                icon="Link"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleSaveWhatsAppSettings}
              icon="Save"
            >
              Save Settings
            </Button>
            <Button
              variant="outline"
              onClick={handleTestConnection}
              icon="Zap"
            >
              Test Connection
            </Button>
          </div>
        </div>
      </Card>

      {/* Message Templates */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Message Templates</h2>
              <p className="text-sm text-gray-600">Customize your invitation message templates</p>
            </div>
            <Button
              variant="outline"
              icon="Plus"
              size="sm"
            >
              Add Template
            </Button>
          </div>

          <div className="space-y-4">
            {messageTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    {template.isDefault && (
                      <Badge variant="whatsapp" size="sm">Default</Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                    >
                      Edit
                    </Button>
                    {!template.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{template.content}</p>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  Available placeholders: <code>{'{Name}'}</code>, <code>{'{Event}'}</code>, <code>{'{link}'}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-600">Configure your notification preferences</p>
          </div>

          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <ApperIcon 
                    name={
                      key === 'emailNotifications' ? 'Mail' :
                      key === 'dailyReports' ? 'BarChart3' :
                      key === 'deliveryUpdates' ? 'Check' : 'Bell'
                    } 
                    size={20} 
                    className="text-gray-400" 
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {key === 'emailNotifications' && 'Email Notifications'}
                      {key === 'dailyReports' && 'Daily Reports'}
                      {key === 'deliveryUpdates' && 'Delivery Updates'}
                      {key === 'rsvpAlerts' && 'RSVP Alerts'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {key === 'emailNotifications' && 'Receive notifications via email'}
                      {key === 'dailyReports' && 'Daily summary of RSVP activity'}
                      {key === 'deliveryUpdates' && 'Real-time message delivery status'}
                      {key === 'rsvpAlerts' && 'Instant alerts for new RSVPs'}
                    </div>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={value}
                    onChange={(e) => setNotificationSettings(prev => ({ 
                      ...prev, 
                      [key]: e.target.checked 
                    }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-primary peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-primary"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleSaveNotifications}
              icon="Save"
            >
              Save Notification Settings
            </Button>
          </div>
        </div>
</Card>

      {/* Reminders */}
      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Reminders</h2>
            <p className="text-sm text-gray-600">Configure global reminder settings for events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Number of Reminders
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
                Maximum Duration Between Reminders
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Info" size={20} className="text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Reminder Settings Info</h4>
                <p className="text-sm text-blue-700 mt-1">
                  These settings apply globally to all events. Individual events can set reminders within these limits.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleSaveReminders}
              icon="Save"
            >
              Save Reminder Settings
            </Button>
          </div>
        </div>
      </Card>

      {/* System Information */}
      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
            <p className="text-sm text-gray-600">Application details and status</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Version</span>
                <span className="text-sm text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Last Updated</span>
                <span className="text-sm text-gray-900">Jan 28, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Environment</span>
                <Badge variant="info" size="sm">Production</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Total Events</span>
                <span className="text-sm text-gray-900">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Total Contacts</span>
                <span className="text-sm text-gray-900">279</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Messages Sent</span>
                <span className="text-sm text-gray-900">1,247</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Settings