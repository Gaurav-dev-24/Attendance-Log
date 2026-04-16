import { useState } from 'react'
import { ArrowLeft, AlertCircle, GraduationCap, BookOpen, Users } from 'lucide-react'
import { SCRIPT_URL } from '../config'

const FORM_CONFIGS = {
  'ieee-student': {
    label: 'IEEE Student Member',
    icon: GraduationCap,
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
      { name: 'membershipId', label: 'IEEE Membership ID', type: 'text', placeholder: 'e.g., 12345678', required: true },
    ],
  },
  'non-ieee-student': {
    label: 'Non-IEEE Student',
    icon: GraduationCap,
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
      { name: 'enrollmentNo', label: 'Enrollment No', type: 'text', placeholder: 'Enter enrollment number', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'student@example.com', required: true },
      { name: 'contactNo', label: 'Contact No', type: 'tel', placeholder: '10-digit mobile number', required: true, pattern: '^[0-9]{10}$', maxLength: 10 },
      { name: 'college', label: 'College', type: 'text', placeholder: 'e.g., Silver Oak University', required: true },
      { name: 'branch', label: 'Branch', type: 'text', placeholder: 'e.g., Computer Science', required: true },
      { name: 'semester', label: 'Semester', type: 'select', required: true, options: ['', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'] },
      { name: 'division', label: 'Division', type: 'text', placeholder: 'e.g., A, B, C', required: true },
    ],
  },
  'ieee-faculty': {
    label: 'IEEE Faculty Advisor',
    icon: BookOpen,
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
      { name: 'membershipId', label: 'IEEE Membership ID', type: 'text', placeholder: 'e.g., 12345678', required: true },
    ],
  },
  'sou-professor': {
    label: 'SOU Professor',
    icon: BookOpen,
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'professor@sou.ac.in', required: true },
      { name: 'contactNo', label: 'Contact No', type: 'tel', placeholder: '10-digit mobile number', required: true },
      { name: 'branch', label: 'Branch / Department', type: 'text', placeholder: 'e.g., Computer Science', required: true },
    ],
  },
  'visitor': {
    label: 'Visitor',
    icon: Users,
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'visitor@example.com', required: true },
      { name: 'contactNo', label: 'Contact No', type: 'tel', placeholder: '10-digit mobile number', required: true },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Software Engineer', required: true },
    ],
  },
}

function validateField(field, value) {
  if (field.required && !value.trim()) {
    return `${field.label} is required`
  }
  if (field.type === 'email' && value.trim()) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(value)) return 'Enter a valid email address'
  }
  if (field.name === 'contactNo' && value.trim()) {
    if (!/^[0-9]{10}$/.test(value)) return 'Enter a valid 10-digit number'
  }
  return ''
}

export default function FormScreen({ role, onBack, onSubmit }) {
  const config = FORM_CONFIGS[role]
  const IconComp = config.icon
  const initialValues = {}
  config.fields.forEach((f) => (initialValues[f.name] = ''))
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false) // ✅ NEW

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const field = config.fields.find((f) => f.name === name)
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const field = config.fields.find((f) => f.name === name)
    const error = validateField(field, values[name])
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  // ✅ UPDATED handleSubmit — Google Sheets ko data bhejta hai
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    let hasErrors = false
    config.fields.forEach((field) => {
      const error = validateField(field, values[field.name])
      if (error) {
        newErrors[field.name] = error
        hasErrors = true
      }
    })
    setErrors(newErrors)
    setTouched(
      config.fields.reduce((acc, f) => ({ ...acc, [f.name]: true }), {})
    )

    if (!hasErrors) {
      setIsSubmitting(true)
      try {
        // Only POST if URL is a valid web app /exec endpoint
        if (SCRIPT_URL && SCRIPT_URL.includes('/exec')) {
          await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: role.replace(/-/g, '_'), ...values }),
          })
        }
        onSubmit(values)
      } catch (err) {
        console.error('Submission error:', err)
        onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="form-screen screen-enter">
      <button
        className="back-button"
        onClick={onBack}
        id="back-button"
        aria-label="Go back to role selection"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="form-card">
        <div className="form-role-badge">
          <IconComp size={15} />
          {config.label}
        </div>

        <h2 className="form-title">Register Attendance</h2>
        <p className="form-subtitle">Fill in your details below to log your visit.</p>

        <form onSubmit={handleSubmit} noValidate>
          {config.fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label className="form-label" htmlFor={`field-${field.name}`}>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  id={`field-${field.name}`}
                  className={`form-select${errors[field.name] ? ' error' : ''}`}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                >
                  <option value="" disabled>
                    Select {field.label}
                  </option>
                  {field.options
                    .filter((o) => o !== '')
                    .map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                </select>
              ) : (
                <input
                  id={`field-${field.name}`}
                  className={`form-input${errors[field.name] ? ' error' : ''}`}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  maxLength={field.maxLength}
                />
              )}

              {errors[field.name] && (
                <div className="error-message" role="alert">
                  <AlertCircle size={14} />
                  {errors[field.name]}
                </div>
              )}
            </div>
          ))}

          {/* ✅ UPDATED button — disabled while submitting */}
          <button type="submit" className="submit-btn" id="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
          </button>
        </form>
      </div>
    </div>
  )
}