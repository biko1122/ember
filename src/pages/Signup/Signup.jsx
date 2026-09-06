import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout/AuthLayout'
import { FormField, CheckboxField } from '@/components/FormField/FormField'
import { PasswordField } from '@/components/PasswordField/PasswordField'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { validateSignup, PASSWORD_RULES } from '@/utils/validation'
import { loyaltySettings } from '@/config/restaurant'
import { formatPoints } from '@/components/Loyalty/Loyalty'
import styles from './Signup.module.css'

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
}

/**
 * Create an account.
 *
 * DEMO NOTE: the account is written to this browser by
 * services/authService.js. No email is verified and nothing is sent anywhere.
 */
export function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const { showToast } = useToast()

  useDocumentTitle(
    'Create an account',
    `Join Ember Rewards and start with ${loyaltySettings.joiningBonus} points.`,
  )

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [status, setStatus] = useState('idle') // idle | submitting | success

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status !== 'idle') return

    const validationErrors = validateSignup(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setStatus('submitting')
    setFormError(null)

    const result = await signup(form)

    if (result.error) {
      setFormError(result.error)
      setErrors(result.fieldErrors ?? {})
      setStatus('idle')
      return
    }

    setStatus('success')
    showToast(`Welcome to the table, ${result.user.firstName}`)
    setTimeout(() => navigate('/account', { replace: true }), 650)
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Save your details, keep your order history, and start earning on every order."
      image="/assets/images/restaurant/restaurant-dining.svg"
      imageAlt="Guests eating in one of our dining rooms"
      footer={
        <p className={styles.switchPrompt}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      }
    >
      <p className={styles.bonus}>
        <Icon name="gift" size={18} />
        <span>
          <strong>{formatPoints(loyaltySettings.joiningBonus)} points</strong> land in your account
          the moment you join — that is a free portion of fries and a drink.
        </span>
      </p>

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
            Account created — setting up your rewards.
          </p>
        )}

        <div className={styles.row}>
          <FormField
            label="First name"
            name="firstName"
            value={form.firstName}
            onChange={updateField}
            error={errors.firstName}
            autoComplete="given-name"
            required
          />
          <FormField
            label="Last name"
            name="lastName"
            value={form.lastName}
            onChange={updateField}
            error={errors.lastName}
            autoComplete="family-name"
            required
          />
        </div>

        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <FormField
          label="Phone number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={updateField}
          error={errors.phone}
          placeholder="01012345678"
          autoComplete="tel"
          required
        />

        <PasswordField
          label="Password"
          name="password"
          value={form.password}
          onChange={updateField}
          error={errors.password}
          hint={PASSWORD_RULES.description}
          autoComplete="new-password"
          showStrength
          required
        />

        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={updateField}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />

        <CheckboxField
          name="acceptedTerms"
          checked={form.acceptedTerms}
          onChange={updateField}
          error={errors.acceptedTerms}
        >
          I agree to the <Link to="/about#terms">Terms &amp; Conditions</Link> and{' '}
          <Link to="/about#privacy">Privacy Policy</Link>.
        </CheckboxField>

        <Button type="submit" size="lg" fullWidth isLoading={status === 'submitting'}>
          {status === 'success' ? 'Account created' : 'Create account'}
        </Button>

        <p className={styles.demoHint}>
          Prototype: your account is stored in this browser only and never sent anywhere. Real
          sign-up arrives with the backend.
        </p>
      </form>
    </AuthLayout>
  )
}
