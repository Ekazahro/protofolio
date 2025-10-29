// Custom React Hook for Firebase Portfolio Data
import { useState, useEffect } from 'react'
import { portfolioService } from './firebaseService'

export const useFirebasePortfolio = () => {
  const [portfolioData, setPortfolioData] = useState({
    projects: [],
    skills: { frontend: [], backend: [], tools: [] }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load initial data
  useEffect(() => {
    loadPortfolioData()
  }, [])

  const loadPortfolioData = async () => {
    try {
      setLoading(true)
      const [projects, skills] = await Promise.all([
        portfolioService.getProjects(),
        portfolioService.getSkills()
      ])
      
      setPortfolioData({
        projects,
        skills
      })
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error loading portfolio data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Project operations
  const addProject = async (projectData) => {
    try {
      const newProject = await portfolioService.addProject(projectData)
      setPortfolioData(prev => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }))
      return newProject
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateProject = async (projectId, projectData) => {
    try {
      const updatedProject = await portfolioService.updateProject(projectId, projectData)
      setPortfolioData(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === projectId ? updatedProject : p)
      }))
      return updatedProject
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteProject = async (projectId) => {
    try {
      await portfolioService.deleteProject(projectId)
      setPortfolioData(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== projectId)
      }))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Skills operations
  const updateSkills = async (skillsData) => {
    try {
      const updatedSkills = await portfolioService.updateSkills(skillsData)
      setPortfolioData(prev => ({
        ...prev,
        skills: updatedSkills
      }))
      return updatedSkills
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    portfolioData,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    updateSkills,
    refreshData: loadPortfolioData
  }
}

// Hook for About data
export const useFirebaseAbout = () => {
  const [aboutData, setAboutData] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAboutData()
  }, [])

  const loadAboutData = async () => {
    try {
      setLoading(true)
      const data = await portfolioService.getAbout()
      setAboutData(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error loading about data:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateAbout = async (aboutData) => {
    try {
      const updatedData = await portfolioService.updateAbout(aboutData)
      setAboutData(updatedData)
      return updatedData
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    aboutData,
    loading,
    error,
    updateAbout,
    refreshData: loadAboutData
  }
}

// Hook for Messages
export const useFirebaseMessages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await portfolioService.getMessages()
      setMessages(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error loading messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const addMessage = async (messageData) => {
    try {
      const newMessage = await portfolioService.addMessage(messageData)
      setMessages(prev => [newMessage, ...prev])
      return newMessage
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteMessage = async (messageId) => {
    try {
      await portfolioService.deleteMessage(messageId)
      setMessages(prev => prev.filter(m => m.id !== messageId))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    messages,
    loading,
    error,
    addMessage,
    deleteMessage,
    refreshData: loadMessages
  }
}
