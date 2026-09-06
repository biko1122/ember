import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout/AuthLayout'
import { FormField, CheckboxField } from '@/components/FormField/FormField'
import { Button } from '@/components/Button/Button'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { validateSignup } from '@/utils/validation'
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

export function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const { showToast } = useToast()

  useDocumentTitle('Create an account', 'Create an EMBER account to order faster next time.')

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFormError(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationErrors = validateSignup(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const result = signup(form)
    if (result.error) {
      setFormError(result.error)
      return
    }

    showToast(`Welcome to the table, ${result.user.firstName}`)
    navigate('/account', { replace: true })
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Save your details, keep your order history, and reorder your usual in seconds."
      image="/assets/images/restaurant/restaurant-dining.jpg"
      imageAlt="Guests eating in one of our dining rooms"
      footer={
        <p className={styles.switchPrompt}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
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

        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          error={errors.password}
          hint="At least 8 characters."
          autoComplete="new-password"
          required
        />

        <FormField
          label="Confirm password"
          name="confirmPassword"
          type="password"
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

        <Button type="submit" size="lg" fullWidth>
          Create account
        </Button>

        <p className={styles.demoHint}>
          Demo account: your details are stored in this browser only and never sent anywhere.
        </p>
      </form>
    </AuthLayout>
  )
}
