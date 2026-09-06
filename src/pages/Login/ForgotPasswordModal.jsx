import { useEffect, useState } from 'react'
import { Modal } from '@/components/Modal/Modal'
import { FormField } from '@/components/FormField/FormField'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { useAuth } from '@/context/AuthContext'
import { validatePasswordReset } from '@/utils/validation'
import styles from './Login.module.css'

/**
 * "Forgot your password?"
 *
 * DEMO NOTE: no email is sent. The flow exists so the client can see it, and
 * it deliberately gives the same answer whether or not the address is
 * registered — which is what the real one will do too, so that a stranger
 * cannot use it to discover who has an account.
 */
export function ForgotPasswordModal({ isOpen, onClose }) {
  const { requestPasswordReset } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('idle') // idle | submitting | sent

  // Start clean each time it opens, so a previous success is not still there.
  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setError(null)
      setStatus('idle')
    }
  }, [isOpen])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'submitting') return

    const errors = validatePasswordReset({ email })
    if (errors.email) {
      setError(errors.email)
      return
    }

    setStatus('submitting')
    const result = await requestPasswordReset(email)
    setStatus(result.error ? 'idle' : 'sent')
    if (result.error) setError(result.error)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset your password">
      {status === 'sent' ? (
        <div className={styles.resetDone}>
          <span className={styles.resetIcon}>
            <Icon name="mail" size={26} />
          </span>
          <h2 className={styles.resetTitle}>Check your inbox</h2>
          <p className={styles.resetCopy}>
            If <strong>{email}</strong> is registered with us, a link to choose a new password is
            on its way. It expires in an hour.
          </p>
          <p className={styles.resetDemoNote}>
            Prototype: no email is actually sent. This screen shows what the customer will see.
          </p>
          <Button fullWidth onClick={onClose}>
            Back to login
          </Button>
        </div>
      ) : (
        <form className={styles.resetForm} onSubmit={handleSubmit} noValidate>
          <h2 className={styles.resetTitle}>Forgot your password?</h2>
          <p className={styles.resetCopy}>
            Tell us the email on your account and we will send you a link to set a new one.
          </p>

          <FormField
            label="Email"
            name="resetEmail"
            type="email"
            value={email}
            onChange={(_, value) => {
              setEmail(value)
              setError(null)
            }}
            error={error}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <div className={styles.resetActions}>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={status === 'submitting'}>
              Send reset link
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
