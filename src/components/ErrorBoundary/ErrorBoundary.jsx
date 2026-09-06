import { Component } from 'react'
import styles from './ErrorBoundary.module.css'

/**
 * The last line of defence.
 *
 * If a render throws anywhere in the app, this catches it and shows a page the
 * customer can act on instead of a blank white screen. The real error still
 * goes to the console, so whoever is debugging keeps the stack trace.
 *
 * React has no hook equivalent of componentDidCatch, so this stays a class.
 */
export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ember] a screen failed to render', error, info?.componentStack)
  }

  handleReload = () => {
    window.location.assign('/')
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className={styles.wrapper} role="alert">
        <div className={styles.panel}>
          <span className={styles.mark} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c1.5 3.2.9 5.2-.7 7-1.8 2-3.1 3.4-3.1 5.8A3.8 3.8 0 0 0 12 20a3.8 3.8 0 0 0 3.8-4c0-1.1-.4-2-1-2.8 2.3.9 3.7 3.2 3.7 5.7" />
            </svg>
          </span>

          <h1 className={styles.title}>Something burned in the kitchen</h1>
          <p className={styles.description}>
            This page ran into a problem and could not finish loading. Nothing you were doing has
            been lost — your basket is still where you left it.
          </p>

          <button type="button" className={styles.button} onClick={this.handleReload}>
            Back to the homepage
          </button>
        </div>
      </div>
    )
  }
}
