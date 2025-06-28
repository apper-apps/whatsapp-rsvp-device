import messagesData from '@/services/mockData/messages.json'
import { toast } from 'react-toastify'

class MessageService {
  constructor() {
    this.messages = [...messagesData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.messages]
  }

  async getByEventId(eventId) {
    await this.delay()
    return this.messages.filter(message => message.eventId === eventId.toString())
  }

  async getByContactId(contactId) {
    await this.delay()
    return this.messages.filter(message => message.contactId === contactId.toString())
  }

  async sendMessage(messageData) {
    await this.delay(1000) // Simulate API call delay
    
    const newMessage = {
      Id: Math.max(...this.messages.map(m => m.Id), 0) + 1,
      ...messageData,
      status: 'sent',
      sentAt: new Date().toISOString(),
      deliveredAt: null,
      readAt: null,
      error: null
    }
    
    this.messages.push(newMessage)
    
    // Simulate message delivery status updates
    setTimeout(() => {
      this.updateMessageStatus(newMessage.Id, 'delivered')
    }, 2000)
    
    setTimeout(() => {
      // Randomly decide if message gets read
      if (Math.random() > 0.3) {
        this.updateMessageStatus(newMessage.Id, 'read')
      }
    }, 5000)
    
    toast.success('Message sent successfully!')
    return { ...newMessage }
  }

  async sendBulkMessages(eventId, contactIds, template) {
    await this.delay(1500)
    
    const messages = contactIds.map(contactId => ({
      Id: Math.max(...this.messages.map(m => m.Id), 0) + this.messages.length + 1,
      contactId: contactId.toString(),
      eventId: eventId.toString(),
      content: template,
      status: 'sent',
      sentAt: new Date().toISOString(),
      deliveredAt: null,
      readAt: null,
      error: null,
      messageType: 'invitation'
    }))
    
    this.messages.push(...messages)
    
    // Simulate delivery status updates
    messages.forEach((message, index) => {
      setTimeout(() => {
        this.updateMessageStatus(message.Id, 'delivered')
        
        // Some messages get read
        if (Math.random() > 0.4) {
          setTimeout(() => {
            this.updateMessageStatus(message.Id, 'read')
          }, 3000)
        }
      }, (index + 1) * 500)
    })
    
    toast.success(`${messages.length} messages sent successfully!`)
    return messages
  }

  async updateMessageStatus(messageId, status) {
    const index = this.messages.findIndex(m => m.Id === parseInt(messageId))
    if (index !== -1) {
      this.messages[index] = {
        ...this.messages[index],
        status,
        [`${status}At`]: new Date().toISOString()
      }
    }
  }

  async getMessageStats(eventId) {
    await this.delay(200)
    
    const eventMessages = this.messages.filter(m => m.eventId === eventId.toString())
    
    const stats = {
      total: eventMessages.length,
      sent: eventMessages.filter(m => ['sent', 'delivered', 'read'].includes(m.status)).length,
      delivered: eventMessages.filter(m => ['delivered', 'read'].includes(m.status)).length,
      read: eventMessages.filter(m => m.status === 'read').length,
      failed: eventMessages.filter(m => m.status === 'failed').length,
      deliveryRate: eventMessages.length > 0 ? 
        (eventMessages.filter(m => ['delivered', 'read'].includes(m.status)).length / eventMessages.length * 100).toFixed(1) : 0,
      readRate: eventMessages.length > 0 ? 
        (eventMessages.filter(m => m.status === 'read').length / eventMessages.length * 100).toFixed(1) : 0
    }
    
    return stats
  }

  async sendReminder(eventId, contactIds, template) {
    await this.delay(800)
    
    const reminderMessages = contactIds.map(contactId => ({
      Id: Math.max(...this.messages.map(m => m.Id), 0) + this.messages.length + 1,
      contactId: contactId.toString(),
      eventId: eventId.toString(),
      content: template,
      status: 'sent',
      sentAt: new Date().toISOString(),
      deliveredAt: null,
      readAt: null,
      error: null,
      messageType: 'reminder'
    }))
    
    this.messages.push(...reminderMessages)
    
    toast.success(`${reminderMessages.length} reminder messages sent!`)
    return reminderMessages
  }
}

export default new MessageService()