import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { FormField } from '@/components/FormField/FormField'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { ProductGrid } from '@/components/ProductGrid/ProductGrid'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useOrders } from '@/hooks/useOrders'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getItemById } from '@/data/menu'
import { formatOrderDate } from '@/utils/orders'
import { formatPrice } from '@/utils/money'
import styles from './Account.module.css'

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'addresses', label: 'Saved addresses', icon: 'pin' },
  { id: 'favorites', label: 'Favourites', icon: 'heart' },
]

/** Customer dashboard. Wrapped in <ProtectedRoute> so only members reach it. */
export function Account() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const { orders } = useOrders()

  useDocumentTitle('My account')

  const [activeSection, setActiveSection] = useState('profile')

  const handleLogout = () => {
    logout()
    showToast('You have been logged out.')
    navigate('/')
  }

  return (
    <>
      <PageHeader eyebrow="My account" title={`Hello, ${user.firstName}`} />

      <div className={`page-container ${styles.layout}`}>
        <nav className={styles.sidebar} aria-label="Account sections">
          <ul className={styles.sectionList}>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  className={styles.sectionButton}
                  data-active={section.id === activeSection}
                  onClick={() => setActiveSection(section.id)}
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

          <Button variant="danger" fullWidth onClick={handleLogout}>
            Log out
          </Button>
        </nav>

        <div className={styles.content}>
          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'addresses' && <AddressesSection />}
          {activeSection === 'favorites' && <FavoritesSection />}

          <RecentOrdersPreview orders={orders} />
        </div>
      </div>
    </>
  )
}

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

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    updateProfile(form)
    showToast('Your details have been updated.')
  }

  return (
    <section className={styles.card} aria-labelledby="profile-title">
      <h2 id="profile-title" className={styles.cardTitle}>
        Personal information
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <FormField
            label="First name"
            name="firstName"
            value={form.firstName}
            onChange={updateField}
            required
          />
          <FormField
            label="Last name"
            name="lastName"
            value={form.lastName}
            onChange={updateField}
            required
          />
        </div>

        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          required
        />

        <FormField
          label="Phone number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={updateField}
          required
        />

        <Button type="submit">Save changes</Button>
      </form>
    </section>
  )
}

/** Addresses saved during checkout. */
function AddressesSection() {
  const { addresses, removeAddress } = useAuth()

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
                onClick={() => removeAddress(address.id)}
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
