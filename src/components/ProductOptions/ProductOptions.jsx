import { formatSurcharge } from '@/utils/money'
import styles from './ProductOptions.module.css'

/**
 * Renders a product's customization groups as radio buttons (single choice) or
 * checkboxes (multiple choice), straight from the item's `customizations`
 * array in data/menu.js. Add a group there and it appears here — no changes
 * needed in this file.
 */
export function ProductOptions({ item, selectOption, isSelected }) {
  const groups = item.customizations ?? []
  if (groups.length === 0) return null

  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <fieldset key={group.id} className={styles.group}>
          <legend className={styles.legend}>
            {group.label}
            <span className={styles.requirement}>{group.required ? 'Required' : 'Optional'}</span>
          </legend>

          <div className={styles.options}>
            {group.options.map((option) => {
              const inputType = group.type === 'multiple' ? 'checkbox' : 'radio'
              const inputId = `${item.id}-${group.id}-${option.id}`

              return (
                <label key={option.id} className={styles.option} htmlFor={inputId}>
                  <input
                    id={inputId}
                    type={inputType}
                    name={`${item.id}-${group.id}`}
                    className={styles.input}
                    checked={isSelected(group, option.id)}
                    onChange={() => selectOption(group, option.id)}
                  />
                  <span className={styles.optionLabel}>{option.label}</span>
                  {option.price > 0 && (
                    <span className={styles.optionPrice}>{formatSurcharge(option.price)}</span>
                  )}
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
