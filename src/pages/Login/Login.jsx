import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout/AuthLayout'
import { FormField } from '@/components/FormField/FormField'
import { PasswordField } from '@/components/PasswordField/PasswordField'
import { ForgotPasswordModal } from '@/pages/Login/ForgotPasswordModal'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { validateLogin } from '@/utils/validation'
import { DEMO_CREDENTIALS } from '@/services/authService'
import styles from './Login.module.css'

/**
 * Sign in.
 *
 * DEMO NOTE: nothing is sent anywhere — `useAuth().login` talks to
 * services/authService.js, which reads accounts held in this browser. The
 * loading and error states are real, so the flow feels like the finished site.
 */
export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showToast } = useToast()

  useDocumentTitle('Log in', 'Sign in to reorder faster, track orders and spend your points.')

  const [form, setForm] = useState({ identifier: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [isForgotOpen, setIsForgotOpen] = useState(false)

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // A second click while the first is in flight would sign in twice.
    if (status !== 'idle') return

    const validationErrors = validateLogin(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setStatus('submitting')
    setFormError(null)

    const result = await login(form)

    if (result.error) {
      setFormError(result.error)
      setErrors(result.fieldErrors ?? {})
      setStatus('idle')
      return
    }

    // Hold the success state for a beat so it is seen, then move on.
    setStatus('success')
    showToast(`Welcome back, ${result.user.firstName}`)
    setTimeout(() => navigate(location.state?.from ?? '/account', { replace: true }), 550)
  }

  const fillDemoAccount = () => {
    setForm({ identifier: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password })
    setErrors({})
    setFormError(null)
  }

  /** DEMO NOTE: real social sign-in needs a provider and a backend. */
  const handleSocialSignIn = (provider) => {
    showToast(`${provider} sign-in arrives with the real backend.`, { variant: 'info' })
  }

  const isBusy = status !== 'idle'

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to reorder in two taps, track your order and spend your points."
      image="/assets/images/restaurant/restaurant-counter.svg"
      imageAlt="The order counter at one of our branches"
      footer={
        <>
          <div className={styles.divider}>
            <span>or</span>
          </div>

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
            <Icon name="alert" size={17} />
            {formError}
          </p>
        )}

        {status === 'success' && (
          <p className={styles.formSuccess} role="status">
            <Icon name="check" size={17} strokeWidth={2.4} />
            Signed in — taking you to your account.
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

        <PasswordField
          label="Password"
          name="password"
          value={form.password}
          onChange={updateField}
          error={errors.password}
          placeholder="Your password"
          autoComplete="current-password"
          required
        />

        <button type="button" className={styles.forgotLink} onClick={() => setIsForgotOpen(true)}>
          Forgot your password?
        </button>

        <Button type="submit" size="lg" fullWidth isLoading={status === 'submitting'}>
          {status === 'success' ? 'Signed in' : 'Log in'}
        </Button>

        <div className={styles.demoPanel}>
          <p className={styles.demoTitle}>
            <Icon name="info" size={15} />
            Prototype — accounts live in this browser
          </p>
          <p className={styles.demoHint}>
            Use the sample account to look around, or create your own.
          </p>
          <button type="button" className={styles.demoFill} onClick={fillDemoAccount} disabled={isBusy}>
            Fill in the demo account
          </button>
        </div>
      </form>

      <ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
    </AuthLayout>
  )
}
