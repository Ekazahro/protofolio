// Portfolio Data Components with Firebase Integration
import React, { useState, useEffect } from 'react'
import { useFirebasePortfolio, useFirebaseAbout, useFirebaseMessages } from './useFirebasePortfolio'

// Firebase-enabled Projects Component
export const DynamicProjectsFirebase = () => {
  const { portfolioData, loading, error } = useFirebasePortfolio()

  if (loading) {
    return (
      <div className="portfolio-grid">
        <div className="loading-state">
          <div className="glass-card">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading projects...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="portfolio-grid">
        <div className="error-state">
          <div className="glass-card">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Error Loading Projects</h3>
              <p>{error}</p>
              <p>Falling back to local storage...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (portfolioData.projects.length === 0) {
    return (
      <div className="portfolio-grid">
        <div className="empty-portfolio">
          <div className="glass-card">
            <div className="empty-state">
              <i className="fas fa-code-branch"></i>
              <h3>Sedang Membangun Portfolio</h3>
              <p>Saya sedang mengerjakan proyek-proyek menarik yang akan segera ditampilkan di sini. Pantau terus untuk update terbaru!</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-grid">
      {portfolioData.projects.map(project => (
        <div key={project.id} className="portfolio-item">
          <div className="glass-card">
            {project.image && (
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <div className="project-overlay-content">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="overlay-btn">
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="overlay-btn">
                        <i className="fab fa-github"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-links">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    <i className="fas fa-external-link-alt"></i>
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    <i className="fab fa-github"></i>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Firebase-enabled Skills Component
export const DynamicSkillsFirebase = () => {
  const { portfolioData, loading, error } = useFirebasePortfolio()

  // Default skills for fallback
  const defaultSkills = {
    frontend: [
      { name: 'HTML/CSS', level: 75 },
      { name: 'JavaScript', level: 65 },
      { name: 'React.js', level: 55 },
      { name: 'Bootstrap/Tailwind', level: 70 }
    ],
    backend: [
      { name: 'Node.js', level: 45 },
      { name: 'Express.js', level: 40 },
      { name: 'MySQL', level: 35 },
      { name: 'REST APIs', level: 50 }
    ],
    tools: [
      { name: 'Git/GitHub', level: 65 },
      { name: 'VS Code', level: 85 },
      { name: 'NPM/Yarn', level: 60 }
    ]
  }

  if (loading) {
    return (
      <div className="skills-grid">
        <div className="loading-state">
          <div className="glass-card">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading skills...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const skillsToShow = error || Object.keys(portfolioData.skills).every(category => 
    portfolioData.skills[category].length === 0
  ) ? defaultSkills : portfolioData.skills

  return (
    <div className="skills-grid">
      <div className="skill-category">
        <h3>Frontend</h3>
        <div className="skills-list">
          {skillsToShow.frontend.map((skill, index) => (
            <div key={skill.id || index} className="skill-item">
              <div className="skill-info">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percentage">{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <div 
                  className="skill-progress" 
                  style={{width: `${skill.level}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="skill-category">
        <h3>Backend</h3>
        <div className="skills-list">
          {skillsToShow.backend.map((skill, index) => (
            <div key={skill.id || index} className="skill-item">
              <div className="skill-info">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percentage">{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <div 
                  className="skill-progress" 
                  style={{width: `${skill.level}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="skill-category">
        <h3>Tools & Others</h3>
        <div className="skills-list">
          {skillsToShow.tools.map((skill, index) => (
            <div key={skill.id || index} className="skill-item">
              <div className="skill-info">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percentage">{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <div 
                  className="skill-progress" 
                  style={{width: `${skill.level}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Firebase-enabled About Component
export const DynamicAboutFirebase = () => {
  const { aboutData, loading, error } = useFirebaseAbout()

  if (loading) {
    return (
      <div className="about-content">
        <div className="loading-state">
          <div className="glass-card">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading about information...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="about-content">
      <div className="about-text">
        <div className="glass-card">
          <h3>{aboutData.title || "Cerita Saya"}</h3>
          <p>
            {aboutData.description || `Saya adalah lulusan SMK jurusan Rekayasa Perangkat Lunak yang memiliki passion besar di dunia pengembangan web. Saya sudah mengerjakan beberapa proyek menggunakan teknologi seperti HTML, CSS, JavaScript, dan React untuk membangun tampilan yang modern dan responsif.`}
          </p>
          <p>
            Saat ini saya fokus mengembangkan keterampilan sebagai Front-End Developer sekaligus memperluas kemampuan ke arah Fullstack Web Development dengan mempelajari teknologi backend secara bertahap. Saya senang belajar hal baru, berkomunikasi dengan baik, dan selalu berusaha memberikan hasil terbaik dalam setiap proyek.
          </p>
          <p>
            Sebagai pengembang yang sedang membangun portofolio, saya siap menerima peluang freelance untuk membantu bisnis dan individu memiliki website yang fungsional, menarik, dan mendukung kebutuhan digital mereka.
          </p>
          
          <div className="expertise-grid">
            <div className="expertise-item">
              <i className="fas fa-code"></i>
              <span>Frontend Development</span>
            </div>
            <div className="expertise-item">
              <i className="fas fa-mobile-alt"></i>
              <span>Responsive Design</span>
            </div>
            <div className="expertise-item">
              <i className="fas fa-git-alt"></i>
              <span>Version Control</span>
            </div>
            <div className="expertise-item">
              <i className="fas fa-lightbulb"></i>
              <span>Problem Solving</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hybrid Component that tries Firebase first, falls back to localStorage
export const HybridPortfolioData = ({ component: Component, fallbackComponent: FallbackComponent, ...props }) => {
  const [useFirebase, setUseFirebase] = useState(true)
  const [firebaseError, setFirebaseError] = useState(false)

  useEffect(() => {
    // Check if Firebase is available
    const checkFirebase = async () => {
      try {
        // Simple check to see if Firebase is configured
        if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
          setUseFirebase(false)
        }
      } catch (error) {
        console.warn('Firebase not available, using localStorage:', error)
        setUseFirebase(false)
        setFirebaseError(true)
      }
    }

    checkFirebase()
  }, [])

  if (!useFirebase || firebaseError) {
    return <FallbackComponent {...props} />
  }

  return (
    <Component 
      {...props} 
      onError={() => {
        setFirebaseError(true)
        setUseFirebase(false)
      }}
    />
  )
}
