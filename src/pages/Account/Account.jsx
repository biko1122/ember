import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { FormField } from '@/components/FormField/FormField'
import { PasswordField } from '@/components/PasswordField/PasswordField'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { Avatar } from '@/components/Avatar/Avatar'
import { ProductGrid } from '@/components/ProductGrid/ProductGrid'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import {
  LoyaltyBalanceCard,
  PointsHistory,
  RewardsGrid,
  TierBadge,
  formatPoints,
} from '@/components/Loyalty/Loyalty'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useLoyalty } from '@/context/LoyaltyContext'
import { useOrders } from '@/hooks/useOrders'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getItemById } from '@/data/menu'
import { formatOrderDate } from '@/utils/orders'
import { formatPrice } from '@/utils/money'
import {
  validateCustomerDetails,
  validatePasswordChange,
  PASSWORD_RULES,
} from '@/utils/validation'
import styles from './Account.module.css'

const SECTIONS = [
  { id: 'rewards', label: 'Rewards', icon: 'gift' },
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'addresses', label: 'Saved addresses', icon: 'pin' },
  { id: 'favorites', label: 'Favourites', icon: 'heart' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

/** Customer dashboard. Wrapped in <ProtectedRoute> so only members reach it. */
export function Account() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const { orders } = useOrders()
  const { balance, tier, isLoading: isLoyaltyLoading } = useLoyalty()

  useDocumentTitle('My account')

  const [activeSection, setActiveSection] = useState('rewards')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    showToast('You have been logged out.')
    navigate('/')
  }

  return (
    <>
      <PageHeader eyebrow="My account" title={`Hello, ${user.firstName}`} />

      <div className={`page-container ${styles.layout}`}>
        <nav className={styles.sidebar} aria-label="Account sections">
          <div className={styles.identity}>
            <Avatar user={user} size="lg" />
            <div className={styles.identityText}>
              <p className={styles.identityName}>
                {user.firstName} {user.lastName}
              </p>
              <p className={styles.identityEmail}>{user.email}</p>
              {!isLoyaltyLoading && (
                <div className={styles.identityMeta}>
                  <TierBadge tier={tier} />
                  <span className={styles.identityPoints}>{formatPoints(balance)} pts</span>
                </div>
              )}
            </div>
          </div>

          <ul className={styles.sectionList}>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  className={styles.sectionButton}
                  data-active={section.id === activeSection}
                  onClick={() => setActiveSection(section.id)}
                  aria-current={section.id === activeSection ? 'true' : undefined}
                >
                  <Icon name={section.icon} size={18} />
                  {section.label}
                </button>
              </li>
            ))}

            <li>
              <Link to="/orders" className={styles.sectionButton}>
                <Icon name="bag" size={18} />
                My orders
                <span className={styles.badge}>{orders.length}</span>
              </Link>
            </li>
          </ul>

          <Button variant="danger" fullWidth onClick={handleLogout} isLoading={isLoggingOut}>
            Log out
          </Button>
        </nav>

        <div className={styles.content}>
          {activeSection === 'rewards' && <RewardsSection />}
          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'addresses' && <AddressesSection />}
          {activeSection === 'favorites' && <FavoritesSection />}
          {activeSection === 'settings' && <SettingsSection onLogout={handleLogout} />}

          {activeSection !== 'settings' && <RecentOrdersPreview orders={orders} />}
        </div>
      </div>
    </>
  )
}

/* -- Rewards --------------------------------------------------------------- */

function RewardsSection() {
  const { redeem } = useLoyalty()
  const { showToast } = useToast()

  const handleRedeem = async (reward) => {
    const result = await redeem(reward.id)

    if (result.error) {
      showToast(result.error, { variant: 'error' })
      return
    }

    showToast(`${reward.name} is yours — we will apply it to your next order.`)
  }

  return (
    <>
      <LoyaltyBalanceCard />

      <section className={styles.card} aria-labelledby="redeem-title">
        <div className={styles.cardHeader}>
          <h2 id="redeem-title" className={styles.cardTitle}>
            Spend your points
          </h2>
          <Link to="/rewards" className={styles.viewAll}>
            How it works
          </Link>
        </div>

        <RewardsGrid onRedeem={handleRedeem} />
      </section>

      <section className={styles.card} aria-labelledby="points-history-title">
        <h2 id="points-history-title" className={styles.cardTitle}>
          Points history
        </h2>
        <PointsHistory limit={8} />
      </section>
    </>
  )
}

/* -- Profile --------------------------------------------------------------- */

/** Editable personal information. */
function ProfileSection() {
  const { user, updateProfile } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFormError(null)
  }

  const isUnchanged =
    form.firstName === user.firstName &&
    form.lastName === user.lastName &&
    form.email === user.email &&
    form.phone === user.phone

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSaving) return

    // Reuse the checkout validator — it already covers name, phone and email.
    const validationErrors = validateCustomerDetails({
      fullName: `${form.firstName} ${form.lastName}`.trim(),
      phone: form.phone,
      email: form.email,
    })

    const fieldErrors = {}
    if (!form.firstName.trim()) fieldErrors.firstName = 'First name is required.'
    if (!form.lastName.trim()) fieldErrors.lastName = 'Last name is required.'
    if (validationErrors.phone) fieldErrors.phone = validationErrors.phone
    if (!form.email.trim()) {
      fieldErrors.email = 'Email is required.'
    } else if (validationErrors.email) {
      fieldErrors.email = validationErrors.email
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setIsSaving(true)
    const result = await updateProfile(form)
    setIsSaving(false)

    if (result.error) {
      setFormError(result.error)
      setErrors(result.fieldErrors ?? {})
      return
    }

    showToast('Your details have been updated.')
  }

  return (
    <section className={styles.card} aria-labelledby="profile-title">
      <h2 id="profile-title" className={styles.cardTitle}>
        Personal information
      </h2>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className={styles.formError} role="alert">
            <Icon name="alert" size={17} />
            {formError}
          </p>
        )}

        <div className={styles.row}>
          <FormField
            label="First name"
            name="firstName"
            value={form.firstName}
            onChange={updateField}
            error={errors.firstName}
            autoComplete="given-name"
            required
          />
          <FormField
            label="Last name"
            name="lastName"
            value={form.lastName}
            onChange={updateField}
            error={errors.lastName}
            autoComplete="family-name"
            required
          />
        </div>

        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          error={errors.email}
          autoComplete="email"
          required
        />

        <FormField
          label="Phone number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={updateField}
          error={errors.phone}
          autoComplete="tel"
          required
        />

        <div className={styles.formActions}>
          <Button type="submit" isLoading={isSaving} disabled={isUnchanged}>
            {isUnchanged ? 'No changes to save' : 'Save changes'}
          </Button>
        </div>
      </form>
    </section>
  )
}

/* -- Addresses ------------------------------------------------------------- */

/** Addresses saved during checkout. */
function AddressesSection() {
  const { addresses, removeAddress } = useAuth()
  const { showToast } = useToast()

  const handleRemove = (address) => {
    removeAddress(address.id)
    showToast('Address removed.', { variant: 'info' })
  }

  return (
    <section className={styles.card} aria-labelledby="addresses-title">
      <h2 id="addresses-title" className={styles.cardTitle}>
        Saved addresses
      </h2>

      {addresses.length === 0 ? (
        <EmptyState
          icon="pin"
          title="No saved addresses yet"
          description="Tick “Save this address” at checkout and it will appear here for next time."
          actionLabel="Start an order"
          actionTo="/menu"
        />
      ) : (
        <ul className={styles.addressList}>
          {addresses.map((address) => (
            <li key={address.id} className={styles.address}>
              <div>
                <p className={styles.addressLabel}>{address.label || address.area}</p>
                <p className={styles.addressText}>
                  {[address.building, address.street, address.area].filter(Boolean).join(', ')}
                  {address.floor && `, floor ${address.floor}`}
                  {address.apartment && `, apt ${address.apartment}`}
                </p>
              </div>

              <button
                type="button"
                className={styles.removeAddress}
                onClick={() => handleRemove(address)}
                aria-label={`Remove saved address ${address.label || address.area}`}
              >
                <Icon name="trash" size={17} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/* -- Favourites ------------------------------------------------------------ */

/** Items the customer has hearted. */
function FavoritesSection() {
  const { favoriteIds } = useFavorites()
  const favoriteItems = favoriteIds.map(getItemById).filter(Boolean)

  return (
    <section className={styles.card} aria-labelledby="favorites-title">
      <h2 id="favorites-title" className={styles.cardTitle}>
        Your favourites
      </h2>

      {favoriteItems.length === 0 ? (
        <EmptyState
          icon="heart"
          title="No favourites yet"
          description="Tap the heart on anything you love and it will be waiting here."
          actionLabel="Browse the menu"
          actionTo="/menu"
        />
      ) : (
        <ProductGrid items={favoriteItems} />
      )}
    </section>
  )
}

/* -- Settings -------------------------------------------------------------- */

const EMPTY_PASSWORD_FORM = { currentPassword: '', newPassword: '', confirmPassword: '' }

function SettingsSection({ onLogout }) {
  const { user, changePassword } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState(EMPTY_PASSWORD_FORM)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSaving) return

    const validationErrors = validatePasswordChange(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSaving(true)
    const result = await changePassword(form)
    setIsSaving(false)

    if (result.error) {
      setFormError(result.error)
      setErrors(result.fieldErrors ?? {})
      return
    }

    setForm(EMPTY_PASSWORD_FORM)
    showToast('Your password has been changed.')
  }

  return (
    <>
      <section className={styles.card} aria-labelledby="password-title">
        <h2 id="password-title" className={styles.cardTitle}>
          Change your password
        </h2>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {formError && (
            <p className={styles.formError} role="alert">
              <Icon name="alert" size={17} />
              {formError}
            </p>
          )}

          <PasswordField
            label="Current password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={updateField}
            error={errors.currentPassword}
            autoComplete="current-password"
            required
          />

          <PasswordField
            label="New password"
            name="newPassword"
            value={form.newPassword}
            onChange={updateField}
            error={errors.newPassword}
            hint={PASSWORD_RULES.description}
            autoComplete="new-password"
            showStrength
            required
          />

          <PasswordField
            label="Confirm new password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={updateField}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          <div className={styles.formActions}>
            <Button type="submit" isLoading={isSaving}>
              Update password
            </Button>
          </div>
        </form>
      </section>

      <section className={styles.card} aria-labelledby="account-details-title">
        <h2 id="account-details-title" className={styles.cardTitle}>
          Account
        </h2>

        <dl className={styles.detailList}>
          <div className={styles.detailRow}>
            <dt>Member since</dt>
            <dd>{formatOrderDate(user.joinedAt)}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt>Phone</dt>
            <dd>{user.phone}</dd>
          </div>
        </dl>

        <div className={styles.settingsActions}>
          <Button variant="outline" onClick={onLogout} iconBefore="logout">
            Log out of this device
          </Button>
        </div>

        <p className={styles.settingsNote}>
          <Icon name="shield" size={15} />
          Prototype: this account exists only in this browser. Deleting your browser data removes
          it. Real account management arrives with the backend.
        </p>
      </section>
    </>
  )
}

/* -- Recent orders --------------------------------------------------------- */

/** The three most recent orders, with a link to the full history. */
function RecentOrdersPreview({ orders }) {
  if (orders.length === 0) return null

  return (
    <section className={styles.card} aria-labelledby="recent-orders-title">
      <div className={styles.cardHeader}>
        <h2 id="recent-orders-title" className={styles.cardTitle}>
          Recent orders
        </h2>
        <Link to="/orders" className={styles.viewAll}>
          View all
        </Link>
      </div>

      <ul className={styles.recentList}>
        {orders.slice(0, 3).map((order) => (
          <li key={order.orderNumber}>
            <Link to={`/orders/${order.orderNumber}`} className={styles.recentOrder}>
              <span>
                <strong>{order.orderNumber}</strong>
                <span className={styles.recentDate}>{formatOrderDate(order.placedAt)}</span>
              </span>
              <span className={styles.recentTotal}>{formatPrice(order.totals.total)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
