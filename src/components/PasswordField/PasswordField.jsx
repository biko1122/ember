import { useId, useState } from 'react'
import { FormField } from '@/components/FormField/FormField'
import { Icon } from '@/components/Icon/Icon'
import { scorePassword } from '@/utils/validation'
import styles from './PasswordField.module.css'

/**
 * A password input with a show/hide toggle, and optionally a strength meter.
 *
 * Used by sign-up, login and the change-password form, so the reveal button
 * and the strength wording are identical everywhere they appear.
 *
 *   showStrength  draw the meter (sign-up and change-password, not login)
 */
export function PasswordField({ showStrength = false, value = '', ...props }) {
  const [isVisible, setIsVisible] = useState(false)
  const meterId = useId()

  const strength = showStrength && value ? scorePassword(value) : null

  return (
    <FormField
      {...props}
      value={value}
      type={isVisible ? 'text' : 'password'}
      endSlot={
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setIsVisible((current) => !current)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          // Keep the button off the tab order between the two password fields —
          // it is reachable, just not in the way of typing.
          tabIndex={-1}
        >
          <Icon name={isVisible ? 'eyeOff' : 'eye'} size={19} />
        </button>
      }
      footer={
        strength && (
          <div className={styles.meter} data-level={strength.level}>
            <div
              className={styles.track}
              role="progressbar"
              aria-labelledby={meterId}
              aria-valuenow={strength.score}
              aria-valuemin={0}
              aria-valuemax={4}
            >
              {[0, 1, 2, 3].map((segment) => (
                <span key={segment} className={styles.segment} data-filled={segment < strength.score} />
              ))}
            </div>
            <p id={meterId} className={styles.meterLabel}>
              {strength.label}
              {strength.advice && <span className={styles.advice}> — {strength.advice}</span>}
            </p>
          </div>
        )
      }
    />
  )
}
