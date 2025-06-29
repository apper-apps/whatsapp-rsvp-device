import contactListsData from '@/services/mockData/contactLists.json'
import { toast } from 'react-toastify'

class ContactListService {
  constructor() {
    this.contactLists = [...contactListsData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.contactLists.filter(list => !list.isDeleted)]
  }

  async getById(id) {
    await this.delay()
    const contactList = this.contactLists.find(list => list.Id === parseInt(id) && !list.isDeleted)
    if (!contactList) {
      throw new Error('Contact list not found')
    }
    return { ...contactList }
  }

  async create(listData) {
    await this.delay(500)
    
    const newList = {
      Id: Math.max(...this.contactLists.map(l => l.Id), 0) + 1,
      ...listData,
      contactCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      tags: listData.tags || []
    }
    
    this.contactLists.push(newList)
    toast.success('Contact list created successfully!')
    return { ...newList }
  }

  async update(id, listData) {
    await this.delay(400)
    
    const index = this.contactLists.findIndex(list => list.Id === parseInt(id))
    if (index === -1 || this.contactLists[index].isDeleted) {
      throw new Error('Contact list not found')
    }
    
    this.contactLists[index] = {
      ...this.contactLists[index],
      ...listData,
      updatedAt: new Date().toISOString()
    }
    
    toast.success('Contact list updated successfully!')
    return { ...this.contactLists[index] }
  }

  async delete(id) {
    await this.delay(300)
    
    const index = this.contactLists.findIndex(list => list.Id === parseInt(id))
    if (index === -1 || this.contactLists[index].isDeleted) {
      throw new Error('Contact list not found')
    }
    
    this.contactLists[index].isDeleted = true
    this.contactLists[index].deletedAt = new Date().toISOString()
    
    toast.success('Contact list deleted successfully!')
    return true
  }

  async getByEventId(eventId) {
    await this.delay(200)
    
    return this.contactLists.filter(list => 
      list.eventId === eventId.toString() && !list.isDeleted
    )
  }

  async getAvailableForEvent(eventId, assignedListIds = []) {
    await this.delay(200)
    
    const assigned = assignedListIds.map(id => parseInt(id))
    return this.contactLists.filter(list => 
      !list.isDeleted && !assigned.includes(list.Id)
    )
  }
}

export default new ContactListService()