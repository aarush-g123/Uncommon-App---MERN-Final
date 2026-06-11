import { useState } from 'react'

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const endpoint = mode === 'signup' ? '/api/users/signup' : '/api/users/login'
    const body = mode === 'signup' ? form : { email: form.email, password: form.password }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      onAuth(data.user, data.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode((m) => (m === 'signup' ? 'login' : 'signup'))
    setError('')
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
          <h2>{mode === 'signup' ? 'Create an account' : 'Log in'}</h2>
          <p>Track and manage every college on your list.</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === 'signup' && (
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Your name"
                autoComplete="name"
                required
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
              required
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
              required
            />
          </label>

          {error && <div className="error">{error}</div>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Working…' : mode === 'signup' ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <button className="text-button" type="button" onClick={switchMode}>
          {mode === 'signup'
            ? 'Already have an account? Log in'
            : "Don't have an account? Sign up"}
        </button>
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
