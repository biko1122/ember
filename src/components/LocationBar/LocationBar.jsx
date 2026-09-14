import { useState } from 'react'
import { Modal } from '@/components/Modal/Modal'
import { Icon } from '@/components/Icon/Icon'
import { useCart } from '@/context/CartContext'
import { branches, getBranchById } from '@/data/branches'
import { orderTypes } from '@/data/orderTypes'
import styles from './LocationBar.module.css'

/**
 * The strip that sits above the main navigation: where the order is going, and
 * how it is getting there.
 *
 * This follows the pattern the big delivery chains use — the two decisions
 * that change prices and availability are settled before the customer browses,
 * rather than being discovered at checkout.
 *
 * It is pure presentation over state that already existed: `orderType` and
 * `branchId` both live in the cart, so nothing new is being stored here.
 */
export function LocationBar() {
  const { orderType, setOrderType, branchId, setBranchId } = useCart()
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const selectedBranch = branchId ? getBranchById(branchId) : null

  // Only offer branches that actually do what the customer picked.
  const availableBranches = branches.filter((branch) => branch.services.includes(orderType))

  const handleChooseBranch = (id) => {
    setBranchId(id)
    setIsPickerOpen(false)
  }

  return (
    <>
      <div className={styles.bar}>
        <div className={`page-container ${styles.inner}`}>
          <button
            type="button"
            className={styles.location}
            onClick={() => setIsPickerOpen(true)}
          >
            <Icon name="pin" size={20} className={styles.locationPin} />

            <span className={styles.locationText}>
              <span className={styles.locationLabel}>
                {selectedBranch ? selectedBranch.name : 'Select location'}
                <span className={styles.change}>Change</span>
                {/* Narrow screens have no room for the word; the chevron keeps
                    the control looking tappable. */}
                <Icon name="chevronDown" size={14} className={styles.changeChevron} />
              </span>
              <span className={styles.locationHint}>
                {selectedBranch
                  ? selectedBranch.address
                  : 'Get accurate pricing and delivery times'}
              </span>
            </span>
          </button>

          <div className={styles.modes} role="tablist" aria-label="Select order mode">
            {orderTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                role="tab"
                aria-selected={type.id === orderType}
                className={styles.mode}
                data-selected={type.id === orderType}
                onClick={() => setOrderType(type.id)}
              >
                <Icon name={type.icon} size={18} />
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        title="Choose your location"
      >
        <div className={styles.pickerBody}>
          <h2 className={styles.pickerTitle}>Choose your location</h2>
          <p className={styles.pickerHint}>
            Prices, delivery times and what is on the menu all depend on the branch serving you.
          </p>

          {availableBranches.length === 0 ? (
            <p className={styles.pickerEmpty}>
              No branch offers {orderTypes.find((type) => type.id === orderType)?.label} right now.
              Try another order type.
            </p>
          ) : (
            <ul className={styles.branchList}>
              {availableBranches.map((branch) => (
                <li key={branch.id}>
                  <button
                    type="button"
                    className={styles.branchOption}
                    data-selected={branch.id === branchId}
                    onClick={() => handleChooseBranch(branch.id)}
                  >
                    <span className={styles.branchText}>
                      <span className={styles.branchName}>{branch.name}</span>
                      <span className={styles.branchAddress}>{branch.address}</span>
                      <span className={styles.branchHours}>
                        <Icon name="clock" size={13} />
                        {branch.hours}
                      </span>
                    </span>

                    {branch.id === branchId && (
                      <span className={styles.branchCheck}>
                        <Icon name="check" size={16} strokeWidth={2.6} />
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </>
  )
}
