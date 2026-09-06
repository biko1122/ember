import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout/AuthLayout'
import { FormField } from '@/components/FormField/FormField'
import { Button } from '@/components/Button/Button'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { validateLogin } from '@/utils/validation'
import styles from './Login.module.css'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showToast } = useToast()

  useDocumentTitle('Log in', 'Sign in to your account to reorder faster and track your orders.')

  const [form, setForm] = useState({ identifier: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFormError(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationErrors = validateLogin(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const result = login(form)
    if (result.error) {
      setFormError(result.error)
      return
    }

    showToast(`Welcome back, ${result.user.firstName}`)
    navigate(location.state?.from ?? '/account', { replace: true })
  }

  /**
   * DEMO NOTE: real social sign-in needs a backend and provider credentials,
   * so these buttons say so rather than pretending to work.
   */
  const handleSocialSignIn = (provider) => {
    showToast(`${provider} sign-in is not part of this front-end demo.`, { variant: 'info' })
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to reorder in two taps and keep track of what you have ordered."
      image="/assets/images/restaurant/restaurant-counter.svg"
      imageAlt="The order counter at one of our branches"
      footer={
        <>
          <Button variant="outline" fullWidth onClick={() => handleSocialSignIn('Google')}>
            Continue with Google
          </Button>
          <Button variant="outline" fullWidth onClick={() => handleSocialSignIn('Apple')}>
            Continue with Apple
          </Button>
          <p className={styles.switchPrompt}>
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}

        <FormField
          label="Email or phone"
          name="identifier"
          value={form.identifier}
          onChange={updateField}
          error={errors.identifier}
          placeholder="you@example.com"
          autoComplete="username"
          required
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          error={errors.password}
          placeholder="Your password"
          autoComplete="current-password"
          required
        />

        <button
          type="button"
          className={styles.forgotLink}
          onClick={() =>
            showToast('Password resets need a backend — not part of this demo.', {
              variant: 'info',
            })
          }
        >
          Forgot your password?
        </button>

        <Button type="submit" size="lg" fullWidth>
          Log in
        </Button>

        <p className={styles.demoHint}>
          This is a demo. Accounts are stored in your browser only — create one and it will work
          straight away.
        </p>
      </form>
    </AuthLayout>
  )
}
