import { useState } from 'react'
import BrandMark from '../components/BrandMark'

function LoginPage({ error, loading, onLogin, onNavigate }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  function submitForm(event) {
    event.preventDefault()
    onLogin(form)
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <BrandMark />
        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Please enter your details to sign in.</p>
        </div>

        {error && <div className="alert">{error}</div>}

        <form className="form-stack" onSubmit={submitForm}>
          <label>
            <span>Email Address</span>
            <input
              autoComplete="email"
              name="email"
              onChange={updateField}
              placeholder="name@company.com"
              required
              type="email"
              value={form.email}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              autoComplete="current-password"
              name="password"
              onChange={updateField}
              placeholder="Enter your password"
              required
              type="password"
              value={form.password}
            />
          </label>

          <label className="check-row">
            <input type="checkbox" />
            <span>Remember me for 30 days</span>
          </label>

          <button className="primary-button" disabled={loading} type="submit">
            {loading ? 'Signing in...' : 'Login'}
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="switch-copy">
          Do not have an account?
          <button onClick={() => onNavigate('signup')} type="button">
            Sign up for free
          </button>
        </p>
      </section>
    </main>
  )
}

export default LoginPage
