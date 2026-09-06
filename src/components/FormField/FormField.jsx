import styles from './FormField.module.css'

/**
 * One labelled form control with its error message.
 *
 * Every form on the site is built from these, so labels, focus rings, error
 * colours and spacing stay identical throughout.
 *
 *   as        'input' | 'textarea' | 'select'
 *   options   for selects: [{ value, label }]
 *   endSlot   a control pinned inside the right edge of the input — used by
 *             PasswordField for its show/hide button
 *   footer    extra content under the field, above the hint (the password
 *             strength meter lives here)
 */
export function FormField({
  label,
  name,
  as = 'input',
  type = 'text',
  value,
  onChange,
  error,
  hint,
  options = [],
  placeholder,
  required = false,
  autoComplete,
  rows = 3,
  className = '',
  endSlot = null,
  footer = null,
  ...rest
}) {
  const id = `field-${name}`
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  const sharedProps = {
    id,
    name,
    value,
    placeholder,
    required,
    autoComplete,
    className: styles.control,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy || undefined,
    onChange: (event) => onChange(name, event.target.value),
    ...rest,
  }

  return (
    <div className={`${styles.field} ${className}`} data-invalid={Boolean(error)}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {!required && <span className={styles.optional}>Optional</span>}
      </label>

      {as === 'textarea' && <textarea {...sharedProps} rows={rows} />}

      {as === 'select' && (
        <select {...sharedProps}>
          <option value="">{placeholder ?? 'Select an option'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {as === 'input' &&
        (endSlot ? (
          <div className={styles.controlWrap}>
            <input {...sharedProps} type={type} />
            <span className={styles.endSlot}>{endSlot}</span>
          </div>
        ) : (
          <input {...sharedProps} type={type} />
        ))}

      {footer}

      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/** Checkbox with an inline label — used for terms, "save address", and so on. */
export function CheckboxField({ label, name, checked, onChange, error, children }) {
  const id = `field-${name}`

  return (
    <div className={styles.field} data-invalid={Boolean(error)}>
      <label className={styles.checkboxRow} htmlFor={id}>
        <input
          id={id}
          name={name}
          type="checkbox"
          className={styles.checkbox}
          checked={checked}
          onChange={(event) => onChange(name, event.target.checked)}
          aria-invalid={error ? 'true' : undefined}
        />
        <span>{children ?? label}</span>
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
