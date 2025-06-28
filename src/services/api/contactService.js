import contactsData from '@/services/mockData/contacts.json'
import contactListsData from '@/services/mockData/contactLists.json'
import { toast } from 'react-toastify'

class ContactService {
  constructor() {
    this.contacts = [...contactsData]
    this.contactLists = [...contactListsData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Contact List Methods
  async getAllLists() {
    await this.delay()
    return this.contactLists.filter(list => !list.isDeleted)
  }

  async getListById(id) {
    await this.delay()
    const list = this.contactLists.find(list => list.Id === parseInt(id))
    if (!list) {
      throw new Error('Contact list not found')
    }
    return { ...list }
  }

  async createList(listData) {
    await this.delay(400)
    
    const newList = {
      Id: Math.max(...this.contactLists.map(l => l.Id), 0) + 1,
      ...listData,
      contactCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString()
    }
    
    this.contactLists.push(newList)
    toast.success('Contact list created successfully!')
    return { ...newList }
  }

  async updateList(id, listData) {
    await this.delay(400)
    
    const index = this.contactLists.findIndex(list => list.Id === parseInt(id))
    if (index === -1) {
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

  async deleteList(id) {
    await this.delay(300)
    
    const index = this.contactLists.findIndex(list => list.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Contact list not found')
    }
    
    // Soft delete
    this.contactLists[index] = {
      ...this.contactLists[index],
      isDeleted: true,
      deletedAt: new Date().toISOString()
    }
    
    toast.success('Contact list moved to trash!')
    return true
  }

  // Contact Methods
  async getContactsByListId(listId) {
    await this.delay()
    return this.contacts.filter(contact => 
      contact.listId === listId.toString() && !contact.isDeleted
    )
  }

  async getAllContacts() {
    await this.delay()
    return this.contacts.filter(contact => !contact.isDeleted)
  }

  async getContactById(id) {
    await this.delay()
    const contact = this.contacts.find(contact => contact.Id === parseInt(id))
    if (!contact) {
      throw new Error('Contact not found')
    }
    return { ...contact }
  }

  async createContact(contactData) {
    await this.delay(400)
    
    const newContact = {
      Id: Math.max(...this.contacts.map(c => c.Id), 0) + 1,
      ...contactData,
      messageStatus: 'pending',
      rsvpStatus: 'pending',
      isDeleted: false,
      createdAt: new Date().toISOString()
    }
    
    this.contacts.push(newContact)
    
    // Update contact count in list
    const listIndex = this.contactLists.findIndex(list => list.Id === parseInt(contactData.listId))
    if (listIndex !== -1) {
      this.contactLists[listIndex].contactCount += 1
    }
    
    toast.success('Contact added successfully!')
    return { ...newContact }
  }

  async updateContact(id, contactData) {
    await this.delay(400)
    
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Contact not found')
    }
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...contactData,
      updatedAt: new Date().toISOString()
    }
    
    toast.success('Contact updated successfully!')
    return { ...this.contacts[index] }
  }

  async deleteContact(id) {
    await this.delay(300)
    
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Contact not found')
    }
    
    const contact = this.contacts[index]
    
    // Soft delete
    this.contacts[index] = {
      ...contact,
      isDeleted: true,
      deletedAt: new Date().toISOString()
    }
    
    // Update contact count in list
    const listIndex = this.contactLists.findIndex(list => list.Id === parseInt(contact.listId))
    if (listIndex !== -1) {
      this.contactLists[listIndex].contactCount -= 1
    }
    
    toast.success('Contact moved to trash!')
    return true
  }

  async importContacts(listId, csvData) {
    await this.delay(800)
    
    // Simulate CSV parsing and validation
    const contacts = csvData.map((row, index) => ({
      Id: Math.max(...this.contacts.map(c => c.Id), 0) + index + 1,
      name: row.name || `Contact ${index + 1}`,
      phone: row.phone,
      email: row.email || '',
      tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
      listId: listId.toString(),
      messageStatus: 'pending',
      rsvpStatus: 'pending',
      isDeleted: false,
      createdAt: new Date().toISOString()
    }))
    
    this.contacts.push(...contacts)
    
    // Update contact count in list
    const listIndex = this.contactLists.findIndex(list => list.Id === parseInt(listId))
    if (listIndex !== -1) {
      this.contactLists[listIndex].contactCount += contacts.length
    }
    
    toast.success(`${contacts.length} contacts imported successfully!`)
    return contacts
  }

  async getDeletedContacts() {
    await this.delay()
    return this.contacts.filter(contact => contact.isDeleted)
  }

  async restoreContact(id) {
    await this.delay(300)
    
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Contact not found')
    }
    
    const contact = this.contacts[index]
    this.contacts[index] = {
      ...contact,
      isDeleted: false,
      deletedAt: null,
      restoredAt: new Date().toISOString()
    }
    
    // Update contact count in list
    const listIndex = this.contactLists.findIndex(list => list.Id === parseInt(contact.listId))
    if (listIndex !== -1) {
      this.contactLists[listIndex].contactCount += 1
    }
    
    toast.success('Contact restored successfully!')
    return { ...this.contacts[index] }
  }
}

export default new ContactService()