import { useState } from 'react'
import RoleSelection from './components/RoleSelection'
import FormScreen from './components/FormScreen'
import SuccessScreen from './components/SuccessScreen'

function App() {
  const [screen, setScreen] = useState('roles')
  const [selectedRole, setSelectedRole] = useState(null)

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setScreen('form')
  }

  const handleSubmit = () => {
    setScreen('success')
  }

  const handleBack = () => {
    setSelectedRole(null)
    setScreen('roles')
  }

  const handleReset = () => {
    setSelectedRole(null)
    setScreen('roles')
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        {/* Logo Strip */}
        <div className="header-logo-strip">
          <img
            src="/ieee-sou-logo-cropped.jpg"
            alt="IEEE SOU SB"
            className="header-logo-img"
          />
        </div>
        {/* Title Bar */}
        <div className="header-title-bar">
          <div className="header-inner">
            <div className="header-title-content">
              <h1>IEEE Workspace SOU SB</h1>
              <span className="header-subtitle-pill">Attendance Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {screen === 'roles' && (
          <RoleSelection onSelect={handleRoleSelect} />
        )}
        {screen === 'form' && (
          <FormScreen
            role={selectedRole}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        )}
        {screen === 'success' && (
          <SuccessScreen onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand">IEEE SOU SB</span>
          <span className="footer-divider">•</span>
          <span className="footer-copy">© {new Date().getFullYear()} All rights reserved</span>
        </div>
      </footer>
    </div>
  )
}

export default App
