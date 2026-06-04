import { useEffect, useRef, useState } from 'react'
import './App.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const loadGoogleIdentityScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve()
      return
    }

    const existingScript = document.querySelector(
      'script[data-google-identity="true"]',
    )
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', () =>
        reject(new Error('Google Identity script failed to load.')),
      )
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleIdentity = 'true'
    script.onload = () => resolve()
    script.onerror = () =>
      reject(new Error('Google Identity script failed to load.'))
    document.head.appendChild(script)
  })

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    )
    const json = atob(padded)
    return JSON.parse(json)
  } catch (error) {
    return null
  }
}

function App() {
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !buttonRef.current) {
      return
    }

    let isActive = true
    setIsLoading(true)

    loadGoogleIdentityScript()
      .then(() => {
        if (!isActive) return

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            const profile = decodeJwtPayload(response.credential)
            if (!profile) {
              setAuthError('We could not read the Google profile payload.')
              return
            }
            setAuthError('')
            setUser({
              name: profile.name,
              email: profile.email,
              picture: profile.picture,
            })
          },
        })

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: 320,
        })

        window.google.accounts.id.prompt()
        setIsLoading(false)
      })
      .catch((error) => {
        if (!isActive) return
        setAuthError(error.message)
        setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  const handleSignOut = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
    setUser(null)
  }

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
          <h2>Sign in with Google</h2>
          <p>
            Use your Google account to start tracking applications. We will
            verify the token server-side later.
          </p>
        </div>

        {!GOOGLE_CLIENT_ID ? (
          <div className="callout">
            Add <strong>VITE_GOOGLE_CLIENT_ID</strong> in a frontend .env file
            to enable Google sign in.
          </div>
        ) : (
          <div className="auth-actions">
            <div ref={buttonRef} className="google-button" />
            {isLoading && <span className="muted">Loading Google...</span>}
          </div>
        )}

        {authError && <div className="error">{authError}</div>}

        {user && (
          <div className="profile">
            <div className="profile-details">
              <img src={user.picture} alt="" />
              <div>
                <p className="profile-name">{user.name}</p>
                <p className="muted">{user.email}</p>
              </div>
            </div>
            <button className="ghost" type="button" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        )}
      </section>

      <section className="feature-grid">
        <article>
          <h3>Plan the timeline</h3>
          <p>Track EA, ED, and RD deadlines with built-in reminders.</p>
        </article>
        <article>
          <h3>Stay on top of tasks</h3>
          <p>Keep essay counts, testing needs, and fees in one view.</p>
        </article>
        <article>
          <h3>See the big picture</h3>
          <p>Sort by status and find the next action for each school.</p>
        </article>
      </section>
    </div>
  )
}

export default App
