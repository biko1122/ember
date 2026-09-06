import { Button } from '@/components/Button/Button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import styles from './NotFound.module.css'

/** 404 — anything that does not match a route lands here. */
export function NotFound() {
  useDocumentTitle('Page not found')

  return (
    <div className={`page-container ${styles.page}`}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>This page is off the menu</h1>
      <p className={styles.description}>
        The link may be out of date, or the page may have moved. Let us get you back to the food.
      </p>

      <div className={styles.actions}>
        <Button to="/menu" size="lg">
          Browse the menu
        </Button>
        <Button to="/" variant="outline" size="lg">
          Back to home
        </Button>
      </div>
    </div>
  )
}
