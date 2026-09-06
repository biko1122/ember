import { FormField } from '@/components/FormField/FormField'
import styles from './CheckoutSteps.module.css'

/** Step 2 — who the order is for and how to reach them. */
export function CustomerDetailsStep({ form, errors, onChange }) {
  return (
    <div className={styles.step}>
      <h2 className={styles.title}>Your details</h2>
      <p className={styles.intro}>We only use these to get your order to you.</p>

      <div className={styles.fields}>
        <FormField
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          error={errors.fullName}
          placeholder="e.g. Ahmed Hassan"
          autoComplete="name"
          required
        />

        <div className={styles.fieldRow}>
          <FormField
            label="Phone number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            error={errors.phone}
            placeholder="01012345678"
            autoComplete="tel"
            required
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            error={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
            hint="For your order receipt."
          />
        </div>
      </div>
    </div>
  )
}
