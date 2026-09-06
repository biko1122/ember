import styles from './PageHeader.module.css'

/**
 * The title block at the top of an inner page.
 * Pass filters, search or buttons as children and they sit under the title.
 */
export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className={styles.header}>
      <div className="page-container">
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        {children && <div className={styles.extra}>{children}</div>}
      </div>
    </header>
  )
}
