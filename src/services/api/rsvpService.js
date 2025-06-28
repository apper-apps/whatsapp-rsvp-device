import rsvpData from '@/services/mockData/rsvpResponses.json'
import { toast } from 'react-toastify'

class RsvpService {
  constructor() {
    this.responses = [...rsvpData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.responses]
  }

  async getByEventId(eventId) {
    await this.delay()
    return this.responses.filter(response => response.eventId === eventId.toString())
  }

  async getByPhone(phone) {
    await this.delay()
    return this.responses.filter(response => response.phone === phone)
  }

  async submitRsvp(rsvpData) {
    await this.delay(500)
    
    // Check if RSVP already exists for this phone/event combination
    const existingIndex = this.responses.findIndex(
      r => r.phone === rsvpData.phone && r.eventId === rsvpData.eventId
    )
    
    if (existingIndex !== -1) {
      // Update existing RSVP
      this.responses[existingIndex] = {
        ...this.responses[existingIndex],
        ...rsvpData,
        submittedAt: new Date().toISOString()
      }
      toast.success('RSVP updated successfully!')
      return { ...this.responses[existingIndex] }
    } else {
      // Create new RSVP
      const newRsvp = {
        Id: Math.max(...this.responses.map(r => r.Id), 0) + 1,
        ...rsvpData,
        submittedAt: new Date().toISOString()
      }
      
      this.responses.push(newRsvp)
      toast.success('RSVP submitted successfully!')
      return { ...newRsvp }
    }
  }

  async getRsvpStats(eventId) {
    await this.delay(200)
    
    const eventRsvps = this.responses.filter(r => r.eventId === eventId.toString())
    
    const stats = {
      total: eventRsvps.length,
      yes: eventRsvps.filter(r => r.response === 'yes').length,
      no: eventRsvps.filter(r => r.response === 'no').length,
      maybe: eventRsvps.filter(r => r.response === 'maybe').length,
      responseRate: 0 // This would be calculated against total invited
    }
    
    return stats
  }

  async exportRsvps(eventId, format = 'csv') {
    await this.delay(500)
    
    const eventRsvps = this.responses.filter(r => r.eventId === eventId.toString())
    
    if (format === 'csv') {
      const csvHeaders = ['Name', 'Phone', 'Response', 'Notes', 'Submitted At']
      const csvRows = eventRsvps.map(rsvp => [
        rsvp.name,
        rsvp.phone,
        rsvp.response,
        rsvp.notes || '',
        new Date(rsvp.submittedAt).toLocaleString()
      ])
      
      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `rsvp-export-${eventId}-${Date.now()}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('RSVP data exported successfully!')
      return { success: true, filename: link.download }
    }
    
    throw new Error('Unsupported export format')
  }
}

export default new RsvpService()