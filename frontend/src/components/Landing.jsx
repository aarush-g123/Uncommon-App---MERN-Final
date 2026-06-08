import { useEffect, useRef, useState } from 'react'
import '../App.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) { resolve(); return }
    const existing = document.querySelector('script[data-google-identity="true"]')
    if (existing) {
      existing.addEventListener('load', resolve)
      existing.addEventListener('error', () => reject(new Error('Google Identity script failed to load.')))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleIdentity = 'true'
    script.onload = resolve
    script.onerror = () => reject(new Error('Google Identity script failed to load.'))
    document.head.appendChild(script)
  })

const decodeJwt = (token) => {
  try {
    const payload = token.split('.')[1]
    const norm = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = norm.padEnd(norm.length + ((4 - (norm.length % 4)) % 4), '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

export default function Landing({ onSignIn }) {
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !buttonRef.current) return
    let active = true
    setIsLoading(true)

    loadGoogleScript()
      .then(() => {
        if (!active) return
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            const profile = decodeJwt(response.credential)
            if (!profile) { setAuthError('Could not read the Google profile payload.'); return }
            setAuthError('')
            onSignIn({ name: profile.name, email: profile.email, picture: profile.picture })
          },
        })
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with', width: 320,
        })
        window.google.accounts.id.prompt()
        setIsLoading(false)
      })
      .catch((err) => {
        if (!active) return
        setAuthError(err.message)
        setIsLoading(false)
      })

    return () => { active = false }
  }, [onSignIn])

  return (
    <div className="page">
      <header className="hero-card">
        <span className="eyebrow">UncommonApp</span>
        <h1>College applications, finally organized.</h1>
        <p className="lede">
          Track deadlines, statuses, and requirements in a single place.
          Customize every detail and keep momentum all season.
        </p>
        <div className="hero-meta">
          <span>Fast filters</span>
          <span>Notes by school</span>
          <span>Progress at a glance</span>
        </div>
      </header>

      <section className="auth-card">
        <div>
          <h2>Get started</h2>
          <p>Sign in with your Google account to start tracking your applications.</p>
        </div>

        {!GOOGLE_CLIENT_ID ? (
          <div className="callout">
            Add <strong>VITE_GOOGLE_CLIENT_ID</strong> to a <code>frontend/.env</code> file to enable Google sign-in.
          </div>
        ) : (
          <div className="auth-actions">
            <div ref={buttonRef} className="google-button" />
            {isLoading && <span className="muted">Loading…</span>}
          </div>
        )}

        {authError && <div className="error">{authError}</div>}
      </section>

      <section className="feature-grid">
        <article>
          <div className="feature-icon">📅</div>
          <h3>Plan the timeline</h3>
          <p>Track EA, ED, and RD deadlines and never miss a submission window.</p>
        </article>
        <article>
          <div className="feature-icon">✏️</div>
          <h3>Stay on top of tasks</h3>
          <p>Log essay counts, testing needs, and fees — all in one view.</p>
        </article>
        <article>
          <div className="feature-icon">📊</div>
          <h3>See the big picture</h3>
          <p>Sort by status and instantly find the next action for every school.</p>
        </article>
      </section>
    </div>
  )
}
