import { Icon } from '@/components/Icon/Icon'
import styles from './CheckoutStepper.module.css'

/**
 * Progress rail across the top of checkout.
 * Completed steps are clickable so people can go back and edit.
 */
export function CheckoutStepper({ steps, currentStepId, onStepClick }) {
  const currentIndex = steps.findIndex((step) => step.id === currentStepId)

  return (
    <ol className={styles.stepper}>
      {steps.map((step, index) => {
        const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming'
        const isClickable = state === 'done'

        return (
          <li key={step.id} className={styles.step} data-state={state}>
            <button
              type="button"
              className={styles.trigger}
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <span className={styles.marker}>
                {state === 'done' ? <Icon name="check" size={13} strokeWidth={3} /> : index + 1}
              </span>
              <span className={styles.label}>{step.label}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
