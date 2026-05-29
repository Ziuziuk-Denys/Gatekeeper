import { useState } from 'react'
import './App.css'

function App() {
  const [view, setView] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  if (view === 'dashboard') {
    return (
        <div className="gatekeeper-site">
          <nav className="navbar">
            <div className="nav-brand">Gatekeeper</div>
            <div className="nav-links">
              <button
                  onClick={() => setView('login')}
                  className="nav-btn"
              >
                Logout
              </button>
            </div>
          </nav>
          <main className="main-viewport">
            <div className="dashboard-card">
              <h1>Welcome to Gatekeeper {username}</h1>
              <p>You have successfully logged in</p>
              <button
                  onClick={() => {
                    setView('login');
                    setEmail('');
                    setPassword('');
                    setUsername('');
                    setError('');
                  }}
                  className="nav-btn"
              >
                Logout
              </button>
            </div>
          </main>
        </div>
    )
  }

  return (
      <div className="gatekeeper-site">
        <nav className="navbar">
          <div className="nav-brand">Gatekeeper</div>
          <div className="nav-links">
            <a href="#features" className="nav-item">Features</a>
            <a href="#docs" className="nav-item">Documentation</a>
          </div>
        </nav>

        <main className="main-viewport">
          <div className="auth-card">
            {view === 'login' ? (
                <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setError('')

                      try {
                        const response = await fetch('http://localhost:3000/login', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({email, password}),
                        })
                        const data = await response.json()

                        if (response.ok) {
                          setUsername(data.username)
                          setView('dashboard')
                        } else {
                          setError(data.message || 'Login failed')
                        }
                      } catch (error) {
                        setError('Connection lost')
                      }
                    }}
                >
                  <h1>Login</h1>

                  <input
                      type="email"
                      value={email}
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />

                  <input
                      type="password"
                      value={password}
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />

                  <button type="submit">Login</button>

                  <div className="auth-card">
                    {error && (
                        <p className="error-text">
                          {error}
                        </p>
                    )}
                  </div>

                  <p className="toggle-text">
                    Don't have an account?{' '}
                    <span onClick={() => setView('register')}>
                  Register
                </span>
                  </p>
                </form>
            ) : (
                <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setError('')
                      try {
                        const response = await fetch('http://localhost:3000/register', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({username, email, password}),
                        })
                        const data = await response.json()
                        console.log(data)
                        if (response.ok) {
                          setView('login')
                        } else {
                          setError(data.message || 'Login failed')
                        }
                      } catch (error) {
                        setError('Connection lost')
                      }
                    }}
                >
                  <h1>Register</h1>

                  <input
                      type="text"
                      value={username}
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
                      required
                  />

                  <input
                      type="email"
                      value={email}
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />

                  <input
                      type="password"
                      value={password}
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />

                  <button type="submit">Sign Up</button>

                  <div className="auth-card">
                    {error && (
                        <p className="error-text">
                          {error}
                        </p>
                    )}
                  </div>

                  <p className="toggle-text">
                    Already have an account?{' '}
                    <span onClick={() => setView('login')}>
                  Login
                </span>
                  </p>
                </form>
            )}
          </div>
        </main>
      </div>
  )
}

export default App