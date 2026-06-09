import { useEffect, useState } from 'react'
import './App.css'

const TOKEN_KEY = 'uncommon_token'

function App() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return

    fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
  }, [])

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const submitAuth = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage('')

    const endpoint = mode === 'signup' ? '/api/users/signup' : '/api/users/login'
    const body =
      mode === 'signup'
        ? form
        : { email: form.email, password: form.password }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      localStorage.setItem(TOKEN_KEY, data.token)
      setUser(data.user)
      setForm({ name: '', email: '', password: '' })
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    setMessage('')
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
        {user ? (
          <>
            <div>
              <h2>Welcome, {user.name}</h2>
              <p>You are signed in as {user.email}.</p>
            </div>
            <button className="primary-button" type="button" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <div>
              <h2>{mode === 'signup' ? 'Create an account' : 'Log in'}</h2>
              <p>
                This uses normal email/password authentication with PostgreSQL and a JWT token.
              </p>
            </div>

            <form className="auth-form" onSubmit={submitAuth}>
              {mode === 'signup' && (
                <label>
                  Name
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="Your Name"
                    autoComplete="name"
                  />
                </label>
              )}

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>

              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={updateField}
                  placeholder="At least 6 characters"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
              </label>

              {message && <div className="error">{message}</div>}

              <button className="primary-button" type="submit" disabled={isLoading}>
                {isLoading ? 'Working...' : mode === 'signup' ? 'Sign up' : 'Log in'}
              </button>
            </form>

            <button
              className="text-button"
              type="button"
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup')
                setMessage('')
              }}
            >
              {mode === 'signup'
                ? 'Already have an account? Log in'
                : "Don't have an account? Sign up"}
            </button>
          </>
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
