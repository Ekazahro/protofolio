import { useState, useEffect } from 'react'
import './App.css'
import AdminDashboard from './AdminDashboard'
import AdminDashboardFirebase from './AdminDashboardFirebase'
import { DynamicProjects, DynamicSkills, DynamicAbout } from './PortfolioDataHybrid'
import { isFirebaseConfigured } from './firebase'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  // Check for admin URL
  useEffect(() => {
    const checkAdminURL = () => {
      const currentPath = window.location.pathname
      const currentHash = window.location.hash
      
      // Check for /admin path or #admin hash
      if (currentPath === '/admin' || currentHash === '#admin') {
        setShowAdminDashboard(true)
      }
    }

    // Check on component mount
    checkAdminURL()

    // Listen for URL changes
    window.addEventListener('popstate', checkAdminURL)
    window.addEventListener('hashchange', checkAdminURL)

    return () => {
      window.removeEventListener('popstate', checkAdminURL)
      window.removeEventListener('hashchange', checkAdminURL)
    }
  }, [])

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
      setIsMenuOpen(false)
    }
  }

  // Handle contact form input changes
  const handleContactInputChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('')

    try {
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Save to localStorage for demo purposes
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]')
      const newSubmission = {
        ...contactForm,
        timestamp: new Date().toISOString(),
        id: Date.now()
      }
      submissions.push(newSubmission)
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions))

      setSubmitStatus('success')
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(''), 5000)
      
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus(''), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle scroll for active navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'portfolio', 'contact']
      const scrollPosition = window.scrollY + 100

      sections.forEach(section => {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-text">Portfolio</span>
          </div>
          
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <a 
              href="#home" 
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('home') }}
            >
              Home
            </a>
            <a 
              href="#about" 
              className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('about') }}
            >
              About
            </a>
            <a 
              href="#skills" 
              className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('skills') }}
            >
              Skills
            </a>
            <a 
              href="#portfolio" 
              className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('portfolio') }}
            >
              Portfolio
            </a>
            <a 
              href="#contact" 
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('contact') }}
            >
              Contact
            </a>
          </div>

          <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="title-line">Junior</span>
                <span className="title-line gradient-text">Developer</span>
              </h1>
              <p className="hero-description">
                Lulusan SMK Rekayasa Perangkat Lunak dengan passion dalam menciptakan website yang modern dan fungsional. 
                Siap membantu mewujudkan visi digital Anda dengan solusi web yang inovatif dan user-friendly.
              </p>
              <div className="hero-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => scrollToSection('portfolio')}
                >
                  <i className="fas fa-rocket"></i>
                  Lihat Portfolio
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => scrollToSection('contact')}
                >
                  <i className="fas fa-envelope"></i>
                  Hubungi Saya
                </button>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="floating-card">
                <div className="card-header">
                  <div className="card-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <span className="card-title">portfolio.jsx</span>
                </div>
                <div className="card-content">
                  <div className="code-line">
                    <span className="code-keyword">const</span>
                    <span className="code-variable"> learner</span>
                    <span className="code-operator"> = </span>
                    <span className="code-string">"eager"</span>
                  </div>
                  <div className="code-line">
                    <span className="code-keyword">const</span>
                    <span className="code-variable"> growth</span>
                    <span className="code-operator"> = </span>
                    <span className="code-string">"continuous"</span>
                  </div>
                  <div className="code-line">
                    <span className="code-keyword">return</span>
                    <span className="code-variable"> potential</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">2</div>
              <div className="stat-label">Proyek Selesai</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6</div>
              <div className="stat-label">Bulan Belajar</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Dedikasi</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tentang Saya</h2>
            <p className="section-subtitle">Kenali perjalanan saya dalam dunia web development</p>
          </div>
          <DynamicAbout />
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Keahlian Teknis</h2>
            <p className="section-subtitle">Teknologi yang saya kuasai dan terus pelajari</p>
          </div>
          
          <DynamicSkills />
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Portfolio Saya</h2>
            <p className="section-subtitle">Proyek-proyek yang telah saya kerjakan</p>
          </div>
          
          <DynamicProjects />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Mari Berkolaborasi</h2>
            <p className="section-subtitle">Hubungi saya untuk diskusi proyek atau peluang kerja sama</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="glass-card">
                <h3>Informasi Kontak</h3>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h4>Email</h4>
                    <p>haiiakueka@gmail.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <h4>Telepon</h4>
                    <p>+62 838 519 959 12</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h4>Lokasi</h4>
                    <p>Malang, Indonesia</p>
                  </div>
                </div>
                
                <div className="social-links">
                  <a href="#" className="social-link">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              <div className="glass-card">
                <h3>Kirim Pesan</h3>
                
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="form-status success">
                    <i className="fas fa-check-circle"></i>
                    Pesan berhasil dikirim! Saya akan segera membalasnya.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="form-status error">
                    <i className="fas fa-exclamation-circle"></i>
                    Terjadi kesalahan. Silakan coba lagi nanti.
                  </div>
                )}
                
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Nama Anda" 
                      value={contactForm.name}
                      onChange={handleContactInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Email Anda" 
                      value={contactForm.email}
                      onChange={handleContactInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="subject"
                      placeholder="Subjek" 
                      value={contactForm.subject}
                      onChange={handleContactInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <textarea 
                      name="message"
                      placeholder="Pesan Anda" 
                      rows="5" 
                      value={contactForm.message}
                      onChange={handleContactInputChange}
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Kirim Pesan
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-text">
              <p>&copy; Eka zahro Safitri 2024 </p>
            </div>
            <div className="footer-links">
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home') }}>Home</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about') }}>About</a>
              <a href="#portfolio" onClick={(e) => { e.preventDefault(); scrollToSection('portfolio') }}>Portfolio</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact') }}>Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Dashboard */}
      {showAdminDashboard && (
        <>
          {isFirebaseConfigured() ? (
            <AdminDashboardFirebase onClose={() => {
              setShowAdminDashboard(false)
              // Clear admin URL
              if (window.location.hash === '#admin') {
                window.location.hash = ''
              }
              if (window.location.pathname === '/admin') {
                window.history.pushState({}, '', '/')
              }
            }} />
          ) : (
            <AdminDashboard onClose={() => {
              setShowAdminDashboard(false)
              // Clear admin URL
              if (window.location.hash === '#admin') {
                window.location.hash = ''
              }
              if (window.location.pathname === '/admin') {
                window.history.pushState({}, '', '/')
              }
            }} />
          )}
        </>
      )}
    </div>
  )
}

export default App
