import { useState, useEffect } from 'react'

// Hook untuk mengelola data portfolio dari localStorage
export const usePortfolioData = () => {
  const [portfolioData, setPortfolioData] = useState({
    projects: [],
    skills: {
      frontend: [],
      backend: [],
      tools: []
    },
    about: {
      title: '',
      description: ''
    }
  })

  useEffect(() => {
    // Load data dari localStorage
    const savedData = localStorage.getItem('portfolioData')
    if (savedData) {
      setPortfolioData(JSON.parse(savedData))
    }

    // Listen untuk perubahan localStorage
    const handleStorageChange = () => {
      const updatedData = localStorage.getItem('portfolioData')
      if (updatedData) {
        setPortfolioData(JSON.parse(updatedData))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event untuk update internal
    window.addEventListener('portfolioDataUpdate', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('portfolioDataUpdate', handleStorageChange)
    }
  }, [])

  return portfolioData
}

// Komponen untuk menampilkan projects dari admin
export const DynamicProjects = () => {
  const portfolioData = usePortfolioData()

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
                <img 
                  src={project.image} 
                  alt={project.title}
                />
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

// Komponen untuk menampilkan skills dari admin
export const DynamicSkills = () => {
  const portfolioData = usePortfolioData()

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

  const skillsToShow = Object.keys(portfolioData.skills).some(category => 
    portfolioData.skills[category].length > 0
  ) ? portfolioData.skills : defaultSkills

  return (
    <div className="skills-grid">
      <div className="skill-category">
        <div className="glass-card">
          <div className="skill-header">
            <i className="fab fa-react"></i>
            <h3>Frontend</h3>
          </div>
          <div className="skill-list">
            {skillsToShow.frontend.map((skill, index) => (
              <div key={skill.id || index} className="skill-item">
                <span>{skill.name}</span>
                <div className="skill-bar">
                  <div className="skill-progress" style={{width: `${skill.level}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="skill-category">
        <div className="glass-card">
          <div className="skill-header">
            <i className="fas fa-server"></i>
            <h3>Backend</h3>
          </div>
          <div className="skill-list">
            {skillsToShow.backend.map((skill, index) => (
              <div key={skill.id || index} className="skill-item">
                <span>{skill.name}</span>
                <div className="skill-bar">
                  <div className="skill-progress" style={{width: `${skill.level}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="skill-category">
        <div className="glass-card">
          <div className="skill-header">
            <i className="fas fa-tools"></i>
            <h3>Tools & Others</h3>
          </div>
          <div className="skill-list">
            {skillsToShow.tools.map((skill, index) => (
              <div key={skill.id || index} className="skill-item">
                <span>{skill.name}</span>
                <div className="skill-bar">
                  <div className="skill-progress" style={{width: `${skill.level}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Komponen untuk menampilkan about dari admin
export const DynamicAbout = () => {
  const [aboutData, setAboutData] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    const savedAbout = localStorage.getItem('aboutData')
    if (savedAbout) {
      setAboutData(JSON.parse(savedAbout))
    }

    const handleAboutUpdate = () => {
      const updatedAbout = localStorage.getItem('aboutData')
      if (updatedAbout) {
        setAboutData(JSON.parse(updatedAbout))
      }
    }

    window.addEventListener('storage', handleAboutUpdate)
    window.addEventListener('portfolioDataUpdate', handleAboutUpdate)

    return () => {
      window.removeEventListener('storage', handleAboutUpdate)
      window.removeEventListener('portfolioDataUpdate', handleAboutUpdate)
    }
  }, [])

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
