import { FormField, CheckboxField } from '@/components/FormField/FormField'
import { ChoiceList } from '@/components/ChoiceList/ChoiceList'
import { branches, getBranchesForOrderType } from '@/data/branches'
import { ORDER_TYPES } from '@/data/orderTypes'
import styles from './CheckoutSteps.module.css'

/**
 * Step 3 — where the order is going.
 *
 * Delivery asks for an address; pickup and dine-in ask which branch, with
 * dine-in also offering a table number.
 */
export function FulfilmentStep({ form, errors, onChange, orderType, branchId, onBranchChange }) {
  if (orderType === ORDER_TYPES.DELIVERY) {
    return <DeliveryFields form={form} errors={errors} onChange={onChange} />
  }

  const availableBranches = getBranchesForOrderType(orderType)
  const isDineIn = orderType === ORDER_TYPES.DINE_IN

  return (
    <div className={styles.step}>
      <h2 className={styles.title}>{isDineIn ? 'Which branch are you in?' : 'Where are you collecting from?'}</h2>
      <p className={styles.intro}>
        {isDineIn
          ? 'Tell us where you are sitting and we will bring your order over.'
          : 'Pick the branch closest to you and we will have it ready.'}
      </p>

      <ChoiceList
        name="branchId"
        label="Choose a branch"
        value={branchId ?? ''}
        onChange={onBranchChange}
        options={availableBranches.map((branch) => ({
          id: branch.id,
          label: branch.name,
          description: `${branch.address} · Open ${branch.hours}`,
          icon: 'pin',
        }))}
      />

      {errors.branchId && (
        <p className={styles.error} role="alert">
          {errors.branchId}
        </p>
      )}

      {isDineIn && (
        <FormField
          label="Table number"
          name="tableNumber"
          value={form.tableNumber}
          onChange={onChange}
          placeholder="e.g. 12"
          hint="Leave blank if you have not been seated yet."
        />
      )}
    </div>
  )
}

/** Delivery address form. Areas come from the branches we actually cover. */
function DeliveryFields({ form, errors, onChange }) {
  const areaOptions = collectDeliveryAreas().map((area) => ({ value: area, label: area }))

  return (
    <div className={styles.step}>
      <h2 className={styles.title}>Where are we delivering?</h2>
      <p className={styles.intro}>The more detail you give the driver, the faster it arrives.</p>

      <div className={styles.fields}>
        <FormField
          label="Area"
          name="area"
          as="select"
          value={form.area}
          onChange={onChange}
          error={errors.area}
          options={areaOptions}
          placeholder="Choose your area"
          required
        />

        <FormField
          label="Street"
          name="street"
          value={form.street}
          onChange={onChange}
          error={errors.street}
          placeholder="e.g. 18 Brazil Street"
          autoComplete="address-line1"
          required
        />

        <div className={`${styles.fieldRow} ${styles.fieldRowThirds}`}>
          <FormField
            label="Building"
            name="building"
            value={form.building}
            onChange={onChange}
            error={errors.building}
            placeholder="e.g. 24B"
            required
          />
          <FormField label="Floor" name="floor" value={form.floor} onChange={onChange} placeholder="e.g. 3" />
          <FormField
            label="Apartment"
            name="apartment"
            value={form.apartment}
            onChange={onChange}
            placeholder="e.g. 12"
          />
        </div>

        <FormField
          label="Delivery instructions"
          name="instructions"
          as="textarea"
          value={form.instructions}
          onChange={onChange}
          placeholder="Landmarks, gate codes, or anything else that helps."
        />

        <CheckboxField
          label="Save this address to my account"
          name="saveAddress"
          checked={form.saveAddress}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

/** Every neighbourhood covered by at least one branch, sorted and de-duped. */
function collectDeliveryAreas() {
  const areas = branches.flatMap((branch) => branch.deliveryAreas)
  return [...new Set(areas)].sort((a, b) => a.localeCompare(b))
}
