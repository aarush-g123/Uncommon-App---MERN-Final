import { useState } from 'react'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'

export default function App() {
  const [user, setUser] = useState(null)

  const handleSignOut = () => {
    window.google?.accounts?.id?.disableAutoSelect()
    setUser(null)
  }

  if (user) return <Dashboard user={user} onSignOut={handleSignOut} />
  return <Landing onSignIn={setUser} />
}
