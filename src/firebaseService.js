// Firebase Service - Portfolio Data Management
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'

// Portfolio Data Service
export class PortfolioFirebaseService {
  constructor() {
    this.portfolioCollection = 'portfolio'
    this.projectsCollection = 'projects'
    this.skillsCollection = 'skills'
    this.aboutCollection = 'about'
    this.messagesCollection = 'messages'
  }

  // Check if Firebase is available
  isAvailable() {
    return isFirebaseConfigured() && db !== null
  }

  // Projects Management
  async getProjects() {
    if (!this.isAvailable()) {
      throw new Error('Firebase not configured')
    }
    
    try {
      const querySnapshot = await getDocs(collection(db, this.projectsCollection))
      const projects = []
      querySnapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() })
      })
      return projects
    } catch (error) {
      console.error('Error getting projects:', error)
      throw error
    }
  }

  async addProject(projectData) {
    if (!this.isAvailable()) {
      throw new Error('Firebase not configured')
    }
    
    try {
      const docRef = await addDoc(collection(db, this.projectsCollection), {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { id: docRef.id, ...projectData }
    } catch (error) {
      console.error('Error adding project:', error)
      throw error
    }
  }

  async updateProject(projectId, projectData) {
    try {
      const projectRef = doc(db, this.projectsCollection, projectId)
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: serverTimestamp()
      })
      return { id: projectId, ...projectData }
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  async deleteProject(projectId) {
    try {
      await deleteDoc(doc(db, this.projectsCollection, projectId))
      return true
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  // Skills Management
  async getSkills() {
    try {
      const docRef = doc(db, this.skillsCollection, 'userSkills')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return docSnap.data().skills || { frontend: [], backend: [], tools: [] }
      } else {
        // Return default skills if no data exists
        return {
          frontend: [],
          backend: [],
          tools: []
        }
      }
    } catch (error) {
      console.error('Error getting skills:', error)
      return { frontend: [], backend: [], tools: [] }
    }
  }

  async updateSkills(skillsData) {
    try {
      const skillsRef = doc(db, this.skillsCollection, 'userSkills')
      await setDoc(skillsRef, {
        skills: skillsData,
        updatedAt: serverTimestamp()
      }, { merge: true })
      return skillsData
    } catch (error) {
      console.error('Error updating skills:', error)
      throw error
    }
  }

  // About Management
  async getAbout() {
    try {
      const docRef = doc(db, this.aboutCollection, 'userAbout')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        return { title: '', description: '' }
      }
    } catch (error) {
      console.error('Error getting about:', error)
      return { title: '', description: '' }
    }
  }

  async updateAbout(aboutData) {
    try {
      const aboutRef = doc(db, this.aboutCollection, 'userAbout')
      await setDoc(aboutRef, {
        ...aboutData,
        updatedAt: serverTimestamp()
      }, { merge: true })
      return aboutData
    } catch (error) {
      console.error('Error updating about:', error)
      throw error
    }
  }

  // Messages Management
  async getMessages() {
    try {
      const querySnapshot = await getDocs(collection(db, this.messagesCollection))
      const messages = []
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() })
      })
      return messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } catch (error) {
      console.error('Error getting messages:', error)
      return []
    }
  }

  async addMessage(messageData) {
    try {
      const docRef = await addDoc(collection(db, this.messagesCollection), {
        ...messageData,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      })
      return { id: docRef.id, ...messageData }
    } catch (error) {
      console.error('Error adding message:', error)
      throw error
    }
  }

  async deleteMessage(messageId) {
    try {
      await deleteDoc(doc(db, this.messagesCollection, messageId))
      return true
    } catch (error) {
      console.error('Error deleting message:', error)
      throw error
    }
  }

  // Real-time listeners
  onProjectsChange(callback) {
    return onSnapshot(collection(db, this.projectsCollection), (snapshot) => {
      const projects = []
      snapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() })
      })
      callback(projects)
    })
  }

  onMessagesChange(callback) {
    return onSnapshot(collection(db, this.messagesCollection), (snapshot) => {
      const messages = []
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() })
      })
      callback(messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
    })
  }

  // Migration helper - Import from localStorage
  async migrateFromLocalStorage() {
    try {
      // Migrate projects
      const localProjects = JSON.parse(localStorage.getItem('portfolioData') || '{"projects": []}').projects
      if (localProjects.length > 0) {
        for (const project of localProjects) {
          await this.addProject(project)
        }
      }

      // Migrate skills
      const localSkills = JSON.parse(localStorage.getItem('portfolioData') || '{"skills": {}}').skills
      if (Object.keys(localSkills).length > 0) {
        await this.updateSkills(localSkills)
      }

      // Migrate about
      const localAbout = JSON.parse(localStorage.getItem('aboutData') || '{}')
      if (Object.keys(localAbout).length > 0) {
        await this.updateAbout(localAbout)
      }

      // Migrate messages
      const localMessages = JSON.parse(localStorage.getItem('contactSubmissions') || '[]')
      if (localMessages.length > 0) {
        for (const message of localMessages) {
          await this.addMessage(message)
        }
      }

      console.log('Migration from localStorage completed successfully!')
      return true
    } catch (error) {
      console.error('Error during migration:', error)
      throw error
    }
  }
}

// Create singleton instance
export const portfolioService = new PortfolioFirebaseService()
