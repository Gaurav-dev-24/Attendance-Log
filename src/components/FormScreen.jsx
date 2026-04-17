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
      { name: 'contactNo', label: 'Contact No', type: 'tel', placeholder: '10-digit mobile number', required: true, pattern: '^[0-9]{10}$', maxLength: 10 },
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
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Software Engineer', required: false },
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverFormError, setServerFormError] = useState('') // New state for general API errors

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
    setServerFormError('') // Reset server error on new submission

    if (!hasErrors) {
      setIsSubmitting(true)
      try {
        if (SCRIPT_URL) {
          const payloadStr = JSON.stringify({ role: role.replace(/-/g, '_'), ...values });
          const url = `${SCRIPT_URL}?payload=${encodeURIComponent(payloadStr)}`;
          
          const res = await fetch(url, {
            method: 'GET',
          })
          const responseData = await res.json()
          
          if (responseData.status === 'error') {
            const errorMsg = responseData.message || 'Validation failed on server.';
            
            // Map known validation errors to their specific fields professionally
            if (role === 'ieee-student') {
              setErrors((prev) => ({ ...prev, membershipId: errorMsg }));
            } else if (role === 'ieee-faculty') {
              setErrors((prev) => ({ ...prev, contactNo: errorMsg }));
            } else {
              // Fallback for an unknown general server error
              setServerFormError(errorMsg);
            }
            
            setIsSubmitting(false);
            return;
          }
        }
        onSubmit(values)
      } catch (err) {
        console.error('Submission error:', err)
        setServerFormError('Failed to connect to the server. Please check your internet connection or try again.')
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

      <div className="form-card" style={{ position: 'relative', overflow: 'hidden' }}>
        {isSubmitting && (
          <div className="loader-overlay">
            <div className="spinner"></div>
            <p>Registering Log...</p>
          </div>
        )}

        <div className="form-role-badge">
          <IconComp size={15} />
          {config.label}
        </div>

        <h2 className="form-title">Register Log</h2>
        <p className="form-subtitle">Fill in your details below to log your visit.</p>

        {serverFormError && (
          <div className="error-message" role="alert" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #f87171', borderRadius: '0.375rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{serverFormError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate autoComplete="off">
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

          {/* Submit button — disables while submitting but relies on UI overlay for loading effect */}
          <button type="submit" className="submit-btn" id="submit-button" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}