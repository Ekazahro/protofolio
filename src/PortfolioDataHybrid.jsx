// Hybrid Portfolio Data - Firebase + localStorage Fallback
import React from 'react'
import { DynamicProjects, DynamicSkills, DynamicAbout } from './PortfolioData'
import { DynamicProjectsFirebase, DynamicSkillsFirebase, DynamicAboutFirebase } from './PortfolioDataFirebase'
import { isFirebaseConfigured } from './firebase'

// Hybrid Projects Component
export const HybridProjects = () => {
  if (isFirebaseConfigured()) {
    return (
      <ErrorBoundary fallback={<DynamicProjects />}>
        <DynamicProjectsFirebase />
      </ErrorBoundary>
    )
  }
  return <DynamicProjects />
}

// Hybrid Skills Component
export const HybridSkills = () => {
  if (isFirebaseConfigured()) {
    return (
      <ErrorBoundary fallback={<DynamicSkills />}>
        <DynamicSkillsFirebase />
      </ErrorBoundary>
    )
  }
  return <DynamicSkills />
}

// Hybrid About Component
export const HybridAbout = () => {
  if (isFirebaseConfigured()) {
    return (
      <ErrorBoundary fallback={<DynamicAbout />}>
        <DynamicAboutFirebase />
      </ErrorBoundary>
    )
  }
  return <DynamicAbout />
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Firebase component error, falling back to localStorage:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

// Export hybrid components as default
export { HybridProjects as DynamicProjects }
export { HybridSkills as DynamicSkills }
export { HybridAbout as DynamicAbout }
