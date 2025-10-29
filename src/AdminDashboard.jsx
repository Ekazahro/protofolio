import { useState, useEffect } from 'react'
import './AdminDashboard.css'

function AdminDashboard({ onClose }) {
  const [activeTab, setActiveTab] = useState('projects')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  
  // Portfolio data state
  const [portfolioData, setPortfolioData] = useState({
    projects: [],
    skills: {
      frontend: [],
      backend: [],
      tools: []
    },
    about: {
      title: '',
      description: '',
      expertise: []
    },
    contact: {
      email: '',
      phone: '',
      location: ''
    }
  })

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

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('portfolioData')
    if (savedData) {
      setPortfolioData(JSON.parse(savedData))
    }
    
    const savedAbout = localStorage.getItem('aboutData')
    if (savedAbout) {
      const aboutData = JSON.parse(savedAbout)
      setAboutForm(aboutData)
    }
  }, [])

  // Save data to localStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem('portfolioData', JSON.stringify(data))
  }

  // Authentication
  const handleLogin = (e) => {
    e.preventDefault()
    // Simple authentication (in real app, use proper auth)
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsAuthenticated(true)
    } else {
      alert('Invalid credentials! Use username: admin, password: admin123')
    }
  }

  // Project Management
  const addProject = (e) => {
    e.preventDefault()
    
    if (editingProject) {
      // Update existing project
      const updatedProjects = portfolioData.projects.map(project =>
        project.id === editingProject.id
          ? {
              ...project,
              ...projectForm,
              technologies: projectForm.technologies.split(',').map(tech => tech.trim())
            }
          : project
      )
      
      const updatedData = {
        ...portfolioData,
        projects: updatedProjects
      }
      
      setPortfolioData(updatedData)
      saveToLocalStorage(updatedData)
      setEditingProject(null)
    } else {
      // Add new project
      const newProject = {
        id: Date.now(),
        ...projectForm,
        technologies: projectForm.technologies.split(',').map(tech => tech.trim())
      }
      
      const updatedData = {
        ...portfolioData,
        projects: [...portfolioData.projects, newProject]
      }
      
      setPortfolioData(updatedData)
      saveToLocalStorage(updatedData)
    }
    
    setProjectForm({
      title: '',
      description: '',
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      image: ''
    })
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

  const deleteProject = (id) => {
    const updatedData = {
      ...portfolioData,
      projects: portfolioData.projects.filter(project => project.id !== id)
    }
    setPortfolioData(updatedData)
    saveToLocalStorage(updatedData)
  }

  // Skill Management
  const addSkill = (e) => {
    e.preventDefault()
    
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
      
      const updatedData = {
        ...portfolioData,
        skills: updatedSkills
      }
      
      setPortfolioData(updatedData)
      saveToLocalStorage(updatedData)
      setEditingSkill(null)
    } else {
      // Add new skill
      const newSkill = {
        id: Date.now(),
        name: skillForm.name,
        level: skillForm.level
      }
      
      const updatedData = {
        ...portfolioData,
        skills: {
          ...portfolioData.skills,
          [skillForm.category]: [...portfolioData.skills[skillForm.category], newSkill]
        }
      }
      
      setPortfolioData(updatedData)
      saveToLocalStorage(updatedData)
    }
    
    setSkillForm({
      category: 'frontend',
      name: '',
      level: 90
    })
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

  const deleteSkill = (category, id) => {
    const updatedData = {
      ...portfolioData,
      skills: {
        ...portfolioData.skills,
        [category]: portfolioData.skills[category].filter(skill => skill.id !== id)
      }
    }
    setPortfolioData(updatedData)
    saveToLocalStorage(updatedData)
  }

  // About Management
  const updateAbout = (e) => {
    e.preventDefault()
    localStorage.setItem('aboutData', JSON.stringify(aboutForm))
    alert('About section updated successfully!')
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
            <button type="submit" className="btn btn-primary">Login</button>
            <div className="login-hint">
              <small>Demo credentials: admin / admin123</small>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-overlay">
      <div className="admin-dashboard">
        <div className="admin-header">
          <h1>Portfolio Admin Dashboard</h1>
          <div className="admin-actions">
            <button className="btn btn-secondary" onClick={() => setIsAuthenticated(false)}>
              Logout
            </button>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

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
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <i className="fas fa-chart-bar"></i>
            Analytics
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'projects' && (
            <div className="projects-section">
              <div className="section-header">
                <h2>Manage Projects</h2>
                <span className="count">{portfolioData.projects.length} projects</span>
              </div>

              <div className="admin-grid">
                <div className="form-panel">
                  <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                  <form onSubmit={addProject} className="admin-form">
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
                        placeholder="Enter project description"
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
                    <div className="form-group">
                      <label>Project Image URL</label>
                      <input
                        type="url"
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
                        placeholder="https://example.com/project-image.jpg"
                      />
                      {projectForm.image && (
                        <div className="image-preview">
                          <img src={projectForm.image} alt="Project preview" />
                        </div>
                      )}
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
                      <button type="submit" className="btn btn-primary">
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
                          {project.image && (
                            <div className="project-thumbnail">
                              <img src={project.image} alt={project.title} />
                            </div>
                          )}
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
                              onClick={() => deleteProject(project.id)}
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

          {activeTab === 'skills' && (
            <div className="skills-section">
              <div className="section-header">
                <h2>Manage Skills</h2>
                <span className="count">
                  {Object.values(portfolioData.skills).flat().length} skills
                </span>
              </div>

              <div className="admin-grid">
                <div className="form-panel">
                  <h3>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
                  <form onSubmit={addSkill} className="admin-form">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={skillForm.category}
                        onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="tools">Tools & Others</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Skill Name</label>
                      <input
                        type="text"
                        value={skillForm.name}
                        onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                        placeholder="Enter skill name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Level ({skillForm.level}%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skillForm.level}
                        onChange={(e) => setSkillForm({...skillForm, level: parseInt(e.target.value)})}
                        className="skill-slider"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        <i className={editingSkill ? "fas fa-save" : "fas fa-plus"}></i>
                        {editingSkill ? 'Update Skill' : 'Add Skill'}
                      </button>
                      {editingSkill && (
                        <button type="button" className="btn btn-secondary" onClick={cancelEditSkill}>
                          <i className="fas fa-times"></i>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="list-panel">
                  <h3>Current Skills</h3>
                  <div className="skills-categories">
                    {Object.entries(portfolioData.skills).map(([category, skills]) => (
                      <div key={category} className="skill-category">
                        <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                        <div className="skills-list">
                          {skills.length === 0 ? (
                            <p className="empty-text">No skills in this category</p>
                          ) : (
                            skills.map(skill => (
                              <div key={skill.id} className="skill-item">
                                <div className="skill-info">
                                  <span className="skill-name">{skill.name}</span>
                                  <span className="skill-level">{skill.level}%</span>
                                </div>
                                <div className="skill-bar">
                                  <div 
                                    className="skill-progress" 
                                    style={{width: `${skill.level}%`}}
                                  ></div>
                                </div>
                                <div className="skill-actions">
                                  <button 
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => editSkill(skill, category)}
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteSkill(category, skill.id)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="about-section">
              <div className="section-header">
                <h2>Manage About Section</h2>
              </div>

              <div className="form-panel full-width">
                <form onSubmit={updateAbout} className="admin-form">
                  <div className="form-group">
                    <label>About Title</label>
                    <input
                      type="text"
                      value={aboutForm.title}
                      onChange={(e) => setAboutForm({...aboutForm, title: e.target.value})}
                      placeholder="Enter about title"
                    />
                  </div>
                  <div className="form-group">
                    <label>About Description</label>
                    <textarea
                      value={aboutForm.description}
                      onChange={(e) => setAboutForm({...aboutForm, description: e.target.value})}
                      placeholder="Enter about description"
                      rows="6"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save"></i>
                    Update About Section
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="messages-section">
              <div className="section-header">
                <h2>Contact Messages</h2>
                <span className="count">
                  {JSON.parse(localStorage.getItem('contactSubmissions') || '[]').length} messages
                </span>
              </div>

              <div className="messages-list">
                {JSON.parse(localStorage.getItem('contactSubmissions') || '[]').length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-inbox"></i>
                    <h3>No Messages Yet</h3>
                    <p>Contact form submissions will appear here.</p>
                  </div>
                ) : (
                  JSON.parse(localStorage.getItem('contactSubmissions') || '[]')
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map(message => (
                      <div key={message.id} className="message-item">
                        <div className="message-header">
                          <div className="message-info">
                            <h4>{message.name}</h4>
                            <span className="message-email">{message.email}</span>
                          </div>
                          <div className="message-date">
                            {new Date(message.timestamp).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className="message-subject">
                          <strong>Subject:</strong> {message.subject}
                        </div>
                        <div className="message-content">
                          {message.message}
                        </div>
                        <div className="message-actions">
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject}`)}
                          >
                            <i className="fas fa-reply"></i>
                            Reply
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]')
                              const filtered = submissions.filter(s => s.id !== message.id)
                              localStorage.setItem('contactSubmissions', JSON.stringify(filtered))
                              // Force re-render by updating a state or reloading
                              window.location.reload()
                            }}
                          >
                            <i className="fas fa-trash"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <div className="section-header">
                <h2>Portfolio Analytics</h2>
              </div>

              <div className="analytics-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-folder"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{portfolioData.projects.length}</h3>
                    <p>Total Projects</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-code"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{Object.values(portfolioData.skills).flat().length}</h3>
                    <p>Total Skills</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <div className="stat-info">
                    <h3>1,234</h3>
                    <p>Portfolio Views</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-download"></i>
                  </div>
                  <div className="stat-info">
                    <h3>56</h3>
                    <p>CV Downloads</p>
                  </div>
                </div>
              </div>

              <div className="data-management">
                <h3>Data Management</h3>
                <div className="data-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      const data = JSON.stringify(portfolioData, null, 2)
                      const blob = new Blob([data], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'portfolio-data.json'
                      a.click()
                    }}
                  >
                    <i className="fas fa-download"></i>
                    Export Data
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all data?')) {
                        localStorage.removeItem('portfolioData')
                        localStorage.removeItem('aboutData')
                        setPortfolioData({
                          projects: [],
                          skills: { frontend: [], backend: [], tools: [] },
                          about: { title: '', description: '', expertise: [] },
                          contact: { email: '', phone: '', location: '' }
                        })
                        alert('All data cleared!')
                      }
                    }}
                  >
                    <i className="fas fa-trash"></i>
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
