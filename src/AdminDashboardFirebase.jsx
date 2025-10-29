// Admin Dashboard with Firebase Integration
import React, { useState, useEffect } from 'react'
import './AdminDashboard.css'
import { useFirebasePortfolio, useFirebaseAbout, useFirebaseMessages } from './useFirebasePortfolio'
import { portfolioService } from './firebaseService'

const AdminDashboardFirebase = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('projects')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })

  // Firebase hooks
  const { portfolioData, loading, error, addProject, updateProject, deleteProject, updateSkills } = useFirebasePortfolio()
  const { aboutData, updateAbout } = useFirebaseAbout()
  const { messages, addMessage, deleteMessage } = useFirebaseMessages()

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    image: ''
  })
  const [editingProject, setEditingProject] = useState(null)

  const [skillForm, setSkillForm] = useState({
    category: 'frontend',
    name: '',
    level: 90
  })
  const [editingSkill, setEditingSkill] = useState(null)

  const [aboutForm, setAboutForm] = useState({
    title: '',
    description: ''
  })

  // Migration state
  const [migrationStatus, setMigrationStatus] = useState('')
  const [isMigrating, setIsMigrating] = useState(false)

  // Load about data when component mounts
  useEffect(() => {
    if (aboutData) {
      setAboutForm(aboutData)
    }
  }, [aboutData])

  // Authentication
  const handleLogin = (e) => {
    e.preventDefault()
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsAuthenticated(true)
    } else {
      alert('Invalid credentials! Use username: admin, password: admin123')
    }
  }

  // Project Management
  const handleAddProject = async (e) => {
    e.preventDefault()
    try {
      if (editingProject) {
        // Update existing project
        await updateProject(editingProject.id, {
          ...projectForm,
          technologies: projectForm.technologies.split(',').map(tech => tech.trim())
        })
        setEditingProject(null)
      } else {
        // Add new project
        await addProject({
          ...projectForm,
          technologies: projectForm.technologies.split(',').map(tech => tech.trim())
        })
      }
      
      setProjectForm({
        title: '',
        description: '',
        technologies: '',
        liveUrl: '',
        githubUrl: '',
        image: ''
      })
    } catch (error) {
      alert('Error saving project: ' + error.message)
    }
  }

  const editProject = (project) => {
    setEditingProject(project)
    setProjectForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      image: project.image || ''
    })
  }

  const cancelEditProject = () => {
    setEditingProject(null)
    setProjectForm({
      title: '',
      description: '',
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      image: ''
    })
  }

  const handleDeleteProject = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id)
      } catch (error) {
        alert('Error deleting project: ' + error.message)
      }
    }
  }

  // Skill Management
  const handleAddSkill = async (e) => {
    e.preventDefault()
    try {
      const newSkill = {
        id: Date.now(),
        name: skillForm.name,
        level: skillForm.level
      }

      if (editingSkill) {
        // Update existing skill
        const updatedSkills = {
          ...portfolioData.skills,
          [editingSkill.category]: portfolioData.skills[editingSkill.category].map(skill =>
            skill.id === editingSkill.id
              ? { ...skill, name: skillForm.name, level: skillForm.level }
              : skill
          )
        }
        await updateSkills(updatedSkills)
        setEditingSkill(null)
      } else {
        // Add new skill
        const updatedSkills = {
          ...portfolioData.skills,
          [skillForm.category]: [...(portfolioData.skills[skillForm.category] || []), newSkill]
        }
        await updateSkills(updatedSkills)
      }

      setSkillForm({
        category: 'frontend',
        name: '',
        level: 90
      })
    } catch (error) {
      alert('Error saving skill: ' + error.message)
    }
  }

  const editSkill = (skill, category) => {
    setEditingSkill({ ...skill, category })
    setSkillForm({
      category: category,
      name: skill.name,
      level: skill.level
    })
  }

  const cancelEditSkill = () => {
    setEditingSkill(null)
    setSkillForm({
      category: 'frontend',
      name: '',
      level: 90
    })
  }

  const handleDeleteSkill = async (category, id) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        const updatedSkills = {
          ...portfolioData.skills,
          [category]: portfolioData.skills[category].filter(skill => skill.id !== id)
        }
        await updateSkills(updatedSkills)
      } catch (error) {
        alert('Error deleting skill: ' + error.message)
      }
    }
  }

  // About Management
  const handleUpdateAbout = async (e) => {
    e.preventDefault()
    try {
      await updateAbout(aboutForm)
      alert('About section updated successfully!')
    } catch (error) {
      alert('Error updating about: ' + error.message)
    }
  }

  // Migration from localStorage
  const handleMigration = async () => {
    if (!confirm('This will migrate data from localStorage to Firebase. Continue?')) {
      return
    }

    setIsMigrating(true)
    setMigrationStatus('Starting migration...')

    try {
      await portfolioService.migrateFromLocalStorage()
      setMigrationStatus('Migration completed successfully!')
      
      // Refresh data
      window.location.reload()
    } catch (error) {
      setMigrationStatus('Migration failed: ' + error.message)
    } finally {
      setIsMigrating(false)
    }
  }

  // Export data
  const exportData = async () => {
    try {
      const data = {
        projects: portfolioData.projects,
        skills: portfolioData.skills,
        about: aboutData,
        messages: messages,
        exportDate: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Error exporting data: ' + error.message)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-overlay">
        <div className="admin-login">
          <div className="login-header">
            <h2>Admin Login</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-sign-in-alt"></i>
              Login
            </button>
          </form>
          <div className="login-info">
            <p><strong>Demo Credentials:</strong></p>
            <p>Username: admin</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-overlay">
      <div className="admin-dashboard">
        <div className="admin-header">
          <h2>
            <i className="fas fa-cog"></i>
            Portfolio Admin Dashboard
            {loading && <span className="loading-indicator">🔄</span>}
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && (
          <div className="error-banner">
            <i className="fas fa-exclamation-triangle"></i>
            Firebase Error: {error}. Using localStorage fallback.
          </div>
        )}

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <i className="fas fa-folder"></i>
            Projects
          </button>
          <button 
            className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <i className="fas fa-code"></i>
            Skills
          </button>
          <button 
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <i className="fas fa-user"></i>
            About
          </button>
          <button 
            className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <i className="fas fa-envelope"></i>
            Messages
          </button>
          <button 
            className={`tab-btn ${activeTab === 'migration' ? 'active' : ''}`}
            onClick={() => setActiveTab('migration')}
          >
            <i className="fas fa-database"></i>
            Migration
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <i className="fas fa-chart-bar"></i>
            Analytics
          </button>
        </div>

        <div className="admin-content">
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="projects-section">
              <div className="section-header">
                <h2>Manage Projects</h2>
                <span className="count">{portfolioData.projects.length} projects</span>
              </div>

              <div className="admin-grid">
                <div className="form-panel">
                  <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                  <form onSubmit={handleAddProject} className="admin-form">
                    <div className="form-group">
                      <label>Project Title</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                        placeholder="Enter project title"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                        placeholder="Project description"
                        rows="3"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Technologies (comma separated)</label>
                      <input
                        type="text"
                        value={projectForm.technologies}
                        onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                        placeholder="React, Node.js, MongoDB"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Live URL</label>
                        <input
                          type="url"
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({...projectForm, liveUrl: e.target.value})}
                          placeholder="https://project-demo.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>GitHub URL</label>
                        <input
                          type="url"
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm({...projectForm, githubUrl: e.target.value})}
                          placeholder="https://github.com/username/repo"
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        <i className={editingProject ? "fas fa-save" : "fas fa-plus"}></i>
                        {editingProject ? 'Update Project' : 'Add Project'}
                      </button>
                      {editingProject && (
                        <button type="button" className="btn btn-secondary" onClick={cancelEditProject}>
                          <i className="fas fa-times"></i>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="list-panel">
                  <h3>Current Projects</h3>
                  <div className="projects-list">
                    {portfolioData.projects.length === 0 ? (
                      <div className="empty-state">
                        <i className="fas fa-folder-open"></i>
                        <p>No projects added yet</p>
                      </div>
                    ) : (
                      portfolioData.projects.map(project => (
                        <div key={project.id} className="project-item">
                          <div className="project-info">
                            <h4>{project.title}</h4>
                            <p>{project.description}</p>
                            <div className="project-tech">
                              {project.technologies.map((tech, index) => (
                                <span key={index} className="tech-tag">{tech}</span>
                              ))}
                            </div>
                          </div>
                          <div className="project-actions">
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => editProject(project)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Migration Tab */}
          {activeTab === 'migration' && (
            <div className="migration-section">
              <div className="section-header">
                <h2>Data Migration</h2>
              </div>

              <div className="migration-panel">
                <div className="glass-card">
                  <h3>Migrate from localStorage to Firebase</h3>
                  <p>This will copy all your existing data from browser storage to Firebase cloud database.</p>
                  
                  {migrationStatus && (
                    <div className="migration-status">
                      <p>{migrationStatus}</p>
                    </div>
                  )}

                  <div className="migration-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={handleMigration}
                      disabled={isMigrating}
                    >
                      <i className={isMigrating ? "fas fa-spinner fa-spin" : "fas fa-upload"}></i>
                      {isMigrating ? 'Migrating...' : 'Start Migration'}
                    </button>
                    
                    <button 
                      className="btn btn-secondary"
                      onClick={exportData}
                    >
                      <i className="fas fa-download"></i>
                      Export Current Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would be similar to the original AdminDashboard */}
          {/* Skills, About, Messages, Analytics tabs... */}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardFirebase
