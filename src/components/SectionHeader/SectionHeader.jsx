import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon/Icon'
import styles from './SectionHeader.module.css'

/**
 * The "eyebrow / title / description ......... link" header that sits above
 * every homepage section.
 */
export function SectionHeader({ eyebrow, title, description, linkTo, linkLabel, id }) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2 id={id} className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {linkTo && (
        <Link className={styles.link} to={linkTo}>
          {linkLabel}
          <Icon name="arrowRight" size={16} />
        </Link>
      )}
    </header>
  )
}
