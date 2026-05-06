import { useState } from 'react'
import BrandMark from '../components/BrandMark'

function SignupPage({ error, loading, onNavigate, onSignup }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  function submitForm(event) {
    event.preventDefault()
    onSignup(form)
  }

  return (
    <main className="auth-page split-auth">
      <section className="auth-card">
        <BrandMark />
        <div className="auth-heading">
          <h1>Create your account</h1>
          <p>Start managing your workflows with ease.</p>
        </div>

        {error && <div className="alert">{error}</div>}

        <form className="form-stack" onSubmit={submitForm}>
          <label>
            <span>Full Name</span>
            <input
              autoComplete="name"
              name="name"
              onChange={updateField}
              placeholder="John Doe"
              required
              type="text"
              value={form.name}
            />
          </label>

          <label>
            <span>Email Address</span>
            <input
              autoComplete="email"
              name="email"
              onChange={updateField}
              placeholder="name@example.com"
              required
              type="email"
              value={form.email}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              autoComplete="new-password"
              minLength="6"
              name="password"
              onChange={updateField}
              placeholder="Minimum 6 characters"
              required
              type="password"
              value={form.password}
            />
          </label>

          <label className="check-row">
            <input
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              required
              type="checkbox"
            />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>

          <button className="primary-button" disabled={loading || !acceptedTerms} type="submit">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="switch-copy">
          Already have an account?
          <button onClick={() => onNavigate('login')} type="button">
            Sign in
          </button>
        </p>
      </section>

      <aside className="auth-visual">
        <div>
          <span className="eyebrow">Serene productivity</span>
          <h2>Achieve more with calm, clear task planning.</h2>
          <p>TaskFlow keeps the work surface simple so your attention stays on the next useful step.</p>
        </div>
      </aside>
    </main>
  )
}

export default SignupPage
