import { CheckCircle2, Home } from 'lucide-react'

export default function SuccessScreen({ onReset }) {
  return (
    <div className="success-screen screen-enter">
      <div className="success-card">
        <div className="success-icon">
          <CheckCircle2 size={52} strokeWidth={1.8} color="#10B981" />
        </div>

        <h2>Attendance Logged Successfully!</h2>
        <p>Thank you for registering your visit.</p>

        <button
          className="home-btn"
          onClick={onReset}
          id="back-to-home"
          aria-label="Go back to home screen"
        >
          <Home size={18} />
          Back to Home
        </button>
      </div>
    </div>
  )
}
