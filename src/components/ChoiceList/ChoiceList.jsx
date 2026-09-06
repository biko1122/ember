import { Icon } from '@/components/Icon/Icon'
import styles from './ChoiceList.module.css'

/**
 * A list of selectable cards behaving like radio buttons — used for payment
 * methods and for picking a branch at checkout.
 *
 *   label    describes the group for screen readers
 *   options  [{ id, label, description, icon, disabled }]
 */
export function ChoiceList({ name, label, value, onChange, options, columns = 1 }) {
  return (
    <div className={styles.list} data-columns={columns} role="radiogroup" aria-label={label ?? name}>
      {options.map((option) => {
        const id = `${name}-${option.id}`

        return (
          <label key={option.id} className={styles.option} htmlFor={id} data-disabled={option.disabled}>
            <input
              id={id}
              type="radio"
              name={name}
              className={styles.input}
              value={option.id}
              checked={value === option.id}
              disabled={option.disabled}
              onChange={() => onChange(option.id)}
            />

            {option.icon && (
              <span className={styles.icon}>
                <Icon name={option.icon} size={20} />
              </span>
            )}

            <span className={styles.text}>
              <span className={styles.label}>{option.label}</span>
              {option.description && (
                <span className={styles.description}>{option.description}</span>
              )}
            </span>

            <span className={styles.check} aria-hidden="true">
              <Icon name="check" size={14} strokeWidth={3} />
            </span>
          </label>
        )
      })}
    </div>
  )
}
