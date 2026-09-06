import { useState } from 'react'
import { Button } from '@/components/Button/Button'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import styles from './PromoCodeInput.module.css'

/**
 * Promo code entry. Valid codes live in config/restaurant.js — in a real build
 * this would ask the server instead.
 */
export function PromoCodeInput() {
  const { promo, applyPromoCode } = useCart()
  const { showToast } = useToast()
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()

    const failureMessage = applyPromoCode(code)
    if (failureMessage) {
      setError(failureMessage)
      return
    }

    setError(null)
    setCode('')
    showToast('Promo code applied')
  }

  if (promo) {
    return (
      <p className={styles.applied}>
        <strong>{promo.code}</strong> applied — {promo.description}.
      </p>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label htmlFor="promo-code" className="visually-hidden">
        Promo code
      </label>

      <div className={styles.field}>
        <input
          id="promo-code"
          className={styles.input}
          value={code}
          onChange={(event) => {
            setCode(event.target.value)
            setError(null)
          }}
          placeholder="Promo code"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'promo-code-error' : undefined}
        />
        <Button type="submit" variant="outline" disabled={!code.trim()}>
          Apply
        </Button>
      </div>

      {error && (
        <p id="promo-code-error" className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
