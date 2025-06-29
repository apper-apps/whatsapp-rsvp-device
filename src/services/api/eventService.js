import eventsData from '@/services/mockData/events.json'
import { toast } from 'react-toastify'

class EventService {
  constructor() {
    this.events = [...eventsData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.events]
  }

  async getById(id) {
    await this.delay()
    const event = this.events.find(event => event.Id === parseInt(id))
    if (!event) {
      throw new Error('Event not found')
    }
    return { ...event }
  }

  async create(eventData) {
    await this.delay(500)
    
const newEvent = {
      Id: Math.max(...this.events.map(e => e.Id), 0) + 1,
      ...eventData,
      eventName: eventData.eventName || eventData.name,
      websiteLink: eventData.websiteLink || '',
      createdAt: new Date().toISOString(),
      status: 'draft',
      rsvpFormUrl: `https://example.com/rsvp/${Math.max(...this.events.map(e => e.Id), 0) + 1}`
    }
    
    this.events.push(newEvent)
    toast.success('Event created successfully!')
    return { ...newEvent }
  }

  async update(id, eventData) {
    await this.delay(400)
    
    const index = this.events.findIndex(event => event.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Event not found')
    }
    
    this.events[index] = {
      ...this.events[index],
      ...eventData,
      updatedAt: new Date().toISOString()
    }
    
    toast.success('Event updated successfully!')
    return { ...this.events[index] }
  }

  async delete(id) {
    await this.delay(300)
    
    const index = this.events.findIndex(event => event.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Event not found')
    }
    
    this.events.splice(index, 1)
    toast.success('Event deleted successfully!')
    return true
  }

  async getEventStats(eventId) {
    await this.delay(200)
    
    // This would normally come from a separate analytics service
    // For demo purposes, we'll generate some mock stats
    const stats = {
      totalInvited: 120,
      delivered: 115,
      read: 95,
      responded: 78,
      attending: 65,
      notAttending: 13,
      responseRate: 65.0,
      deliveryRate: 95.8
    }
return stats
  }

  async getReminderSettings(eventId) {
    await this.delay(200)
    
    // Mock reminder settings for the event
    // In a real app, this would fetch from database
    const reminderSettings = {
      maxReminders: 3,
      maxDurationValue: 24,
      maxDurationType: 'hours',
      overrideGlobal: false
    }
    
    return reminderSettings
  }

  async saveReminderSettings(eventId, reminderData) {
    await this.delay(300)
    
    // In a real app, this would save to database
    // For now, we'll just simulate success
    toast.success('Event reminder settings saved successfully!')
    
    return { ...reminderData }
  }
}
export default new EventService()