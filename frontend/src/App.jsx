import { useEffect, useState } from 'react'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import './App.css'

const TOKEN_KEY = 'uncommon_token'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) { setLoading(false); return }

    fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  const handleAuth = (userData, token) => {
    localStorage.setItem(TOKEN_KEY, token)
    setUser(userData)
  }

  const handleSignOut = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100svh' }}>
        <p className="muted">Loading…</p>
      </div>
    )
  }

  return user
    ? <Dashboard user={user} onSignOut={handleSignOut} />
    : <AuthPage onAuth={handleAuth} />
}

export default App
