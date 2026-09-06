import { useNavigate } from 'react-router-dom'
import { AppImage } from '@/components/AppImage/AppImage'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { getOrderType } from '@/data/orderTypes'
import styles from './BranchCard.module.css'

/**
 * A branch on the Locations page.
 *
 * "Order from here" remembers the branch in the cart, so pickup and dine-in
 * checkout arrive pre-filled.
 */
export function BranchCard({ branch }) {
  const navigate = useNavigate()
  const { setBranchId } = useCart()
  const { showToast } = useToast()

  const startOrder = () => {
    setBranchId(branch.id)
    showToast(`Ordering from our ${branch.name} branch`)
    navigate('/menu')
  }

  return (
    <article className={styles.card}>
      <AppImage src={branch.image} alt={`${branch.name} branch`} ratio="wide" />

      <div className={styles.body}>
        <h3 className={styles.name}>{branch.name}</h3>

        <ul className={styles.facts}>
          <li className={styles.fact}>
            <Icon name="pin" size={17} />
            <span>{branch.address}</span>
          </li>
          <li className={styles.fact}>
            <Icon name="clock" size={17} />
            <span>Open today {branch.hours}</span>
          </li>
          <li className={styles.fact}>
            <Icon name="phone" size={17} />
            <a href={`tel:${branch.phone}`} className={styles.phoneLink}>
              {branch.phone}
            </a>
          </li>
        </ul>

        <div className={styles.services}>
          {branch.services.map((serviceId) => (
            <span key={serviceId} className={styles.service}>
              <Icon name="check" size={14} strokeWidth={2.6} />
              {getOrderType(serviceId).label}
            </span>
          ))}
        </div>

        <p className={styles.areas}>
          <strong>Delivers to:</strong> {branch.deliveryAreas.join(', ')}
        </p>

        <div className={styles.actions}>
          <Button onClick={startOrder} size="sm">
            Order from here
          </Button>
          <Button href={branch.mapUrl} variant="outline" size="sm" iconAfter="arrowRight">
            View location
          </Button>
        </div>
      </div>
    </article>
  )
}
