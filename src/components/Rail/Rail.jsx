import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon/Icon'
import styles from './Rail.module.css'

/**
 * A horizontal strip of cards with a "View all" link and arrow buttons — the
 * layout the big chains use for offers, categories and deals.
 *
 * It scrolls natively rather than transforming a track, so it keeps working
 * with a touch swipe, a trackpad, and the keyboard, and the arrows are only an
 * extra affordance for mouse users. They hide themselves when there is nothing
 * left to scroll to, and the whole set of them disappears when everything
 * already fits.
 */
export function Rail({ title, eyebrow, viewAllTo, viewAllLabel = 'View all', children, id }) {
  const trackRef = useRef(null)
  const [overflow, setOverflow] = useState({ start: false, end: false })

  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    // A couple of pixels of slack, because scroll offsets are fractional once
    // the page is zoomed or the display is scaled.
    const maxScroll = track.scrollWidth - track.clientWidth
    setOverflow({
      start: track.scrollLeft > 2,
      end: track.scrollLeft < maxScroll - 2,
    })
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    measure()
    track.addEventListener('scroll', measure, { passive: true })

    // Cards arrive with their images, so the widths change after first paint.
    const observer = new ResizeObserver(measure)
    observer.observe(track)

    return () => {
      track.removeEventListener('scroll', measure)
      observer.disconnect()
    }
  }, [measure, children])

  const scrollByPage = (direction) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: track.clientWidth * 0.8 * direction, behavior: 'smooth' })
  }

  const hasArrows = overflow.start || overflow.end

  return (
    <section className={styles.rail} aria-labelledby={id}>
      <header className={styles.header}>
        <div className={styles.heading}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2 id={id} className={styles.title}>
            {title}
          </h2>
        </div>

        <div className={styles.controls}>
          {viewAllTo && (
            <Link to={viewAllTo} className={styles.viewAll}>
              {viewAllLabel}
              <Icon name="arrowRight" size={15} />
            </Link>
          )}

          {hasArrows && (
            <div className={styles.arrows}>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => scrollByPage(-1)}
                disabled={!overflow.start}
                aria-label={`Scroll ${title} backwards`}
              >
                <Icon name="chevronLeft" size={18} strokeWidth={2.4} />
              </button>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => scrollByPage(1)}
                disabled={!overflow.end}
                aria-label={`Scroll ${title} forwards`}
              >
                <Icon name="chevronRight" size={18} strokeWidth={2.4} />
              </button>
            </div>
          )}
        </div>
      </header>

      <div className={styles.viewport} data-fade-end={overflow.end}>
        <ul className={styles.track} ref={trackRef}>
          {children}
        </ul>
      </div>
    </section>
  )
}

/** One card in a rail. `width` sets how wide the slide is on a large screen. */
export function RailItem({ children, width = '280px' }) {
  return (
    <li className={styles.item} style={{ '--rail-item-width': width }}>
      {children}
    </li>
  )
}
