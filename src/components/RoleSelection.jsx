import { useState } from 'react'
import { GraduationCap, BookOpen, UserCheck, Users } from 'lucide-react'

const ROLES = [
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student',
    description: 'IEEE or Non-IEEE student',
    subOptions: [
      { id: 'ieee-student', label: 'IEEE Student Member' },
      { id: 'non-ieee-student', label: 'Non-IEEE Student' },
    ],
  },
  {
    id: 'faculty',
    icon: BookOpen,
    title: 'Faculty',
    description: 'Advisor or Professor',
    subOptions: [
      { id: 'ieee-faculty', label: 'IEEE Faculty Advisor' },
      { id: 'sou-professor', label: 'SOU Professor' },
    ],
  },
  {
    id: 'visitor',
    icon: Users,
    title: 'Visitor',
    description: 'External guest or visitor',
    subOptions: null,
  },
]

export default function RoleSelection({ onSelect }) {
  const [expandedCard, setExpandedCard] = useState(null)

  const handleCardClick = (role) => {
    if (role.subOptions) {
      setExpandedCard(expandedCard === role.id ? null : role.id)
    } else {
      onSelect(role.id)
    }
  }

  const handleSubOptionClick = (e, subId) => {
    e.stopPropagation()
    onSelect(subId)
  }

  return (
    <div className="role-selection screen-enter">
      <div className="welcome-badge">
        <UserCheck size={16} />
        Mark Your Presence
      </div>
      <h2>Welcome to the IEEE Silver Oak University Student Branch Workspace</h2>
      <p className="subtitle-small">Please select who you are to continue.</p>

      <div className="role-grid">
        {ROLES.map((role) => {
          const IconComp = role.icon
          return (
            <div
              key={role.id}
              id={`role-card-${role.id}`}
              className={`role-card${expandedCard === role.id ? ' selected' : ''}`}
              onClick={() => handleCardClick(role)}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick(role)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${role.title}`}
            >
              <div className="role-card-icon-wrap">
                <IconComp size={32} strokeWidth={1.8} />
              </div>
              <div className="role-card-title">{role.title}</div>
              <div className="role-card-desc">{role.description}</div>

              {role.subOptions && expandedCard === role.id && (
                <div className="sub-options">
                  {role.subOptions.map((sub) => (
                    <button
                      key={sub.id}
                      id={`sub-option-${sub.id}`}
                      className="sub-option-btn"
                      onClick={(e) => handleSubOptionClick(e, sub.id)}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
