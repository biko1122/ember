import { useCallback, useEffect, useRef, useState } from 'react'
import { AppImage } from '@/components/AppImage/AppImage'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { restaurant } from '@/config/restaurant'
import { heroSlides } from '@/data/heroSlides'
import { formatPrice } from '@/utils/money'
import styles from './HeroSlider.module.css'

/** How long a slide holds before the next one comes up. */
const AUTOPLAY_MS = 7000

/** How far a finger has to travel before it counts as a swipe, not a tap. */
const SWIPE_THRESHOLD = 48

/**
 * The homepage banner: one promotion at a time, big artwork, one obvious
 * thing to press.
 *
 * Everything it shows comes from data/heroSlides.js — this file decides how a
 * slide behaves, never what is in one.
 *
 * How it holds still
 * ------------------
 * All slides are stacked in a single CSS grid cell rather than positioned
 * absolutely, so the banner is always as tall as its tallest slide and nothing
 * below it moves when the slide changes. The inactive ones are `inert` and
 * hidden from assistive technology, so only the visible slide is reachable by
 * tab or by screen reader.
 *
 * When it stops
 * -------------
 * Auto-play pauses while the pointer is over the banner, while focus is inside
 * it, and while the tab is in the background. Visitors who have asked for
 * reduced motion never get it at all — a banner that moves on its own is
 * exactly what that setting is about.
 */
export function HeroSlider({ slides = heroSlides, interval = AUTOPLAY_MS }) {
  const [index, setIndex] = useState(0)
  // Which way the next slide should come in from: 1 forwards, -1 backwards.
  const [direction, setDirection] = useState(1)
  const [isInteracting, setIsInteracting] = useState(false)
  const [isPageHidden, setIsPageHidden] = useState(false)

  const prefersReducedMotion = usePrefersReducedMotion()
  const swipeStartX = useRef(null)
  // How much of this slide's turn is left. See the auto-play effect.
  const remainingRef = useRef(interval)

  const count = slides.length
  const isPaused = isInteracting || isPageHidden
  const isAutoPlaying = count > 1 && !isPaused && !prefersReducedMotion

  // The dots and the arrows sit outside the slides, so the banner itself has
  // to carry the current accent for them to pick up.
  const activeAccent = slides[index]?.accent

  const goTo = useCallback(
    (nextIndex, nextDirection) => {
      if (count === 0) return
      // Wrap in both directions, so the arrows never dead-end.
      const wrapped = (nextIndex + count) % count
      setDirection(nextDirection ?? 1)
      setIndex(wrapped)
    },
    [count],
  )

  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index])
  const goPrevious = useCallback(() => goTo(index - 1, -1), [goTo, index])

  // A new slide gets the full turn. This runs before the timer effect below,
  // so arriving at a slide always resets the clock — however we got here.
  useEffect(() => {
    remainingRef.current = interval
  }, [index, interval])

  /**
   * Auto-play, as a clock that pauses rather than one that restarts.
   *
   * On the way out it banks however much of the turn was left, so leaving the
   * banner after five seconds of a seven-second slide gives the slide its last
   * two seconds, not a fresh seven. That is also what the progress fill on the
   * active dot shows — a CSS animation, which resumes where it stopped — and
   * the two would visibly disagree if this restarted instead.
   */
  useEffect(() => {
    if (!isAutoPlaying) return undefined

    const startedAt = Date.now()
    const timer = window.setTimeout(() => {
      setDirection(1)
      setIndex((current) => (current + 1) % count)
    }, remainingRef.current)

    return () => {
      window.clearTimeout(timer)
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAt))
    }
  }, [index, isAutoPlaying, count])

  // A banner advancing in a tab nobody is looking at is wasted, and it means
  // coming back to a slide that moved on for no reason.
  useEffect(() => {
    const handleVisibility = () => setIsPageHidden(document.hidden)

    handleVisibility()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrevious()
    }
  }

  // Touch and pen only: dragging a mouse across a banner is how you select
  // text, not how you change slides.
  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse') return
    swipeStartX.current = event.clientX
  }

  const handlePointerUp = (event) => {
    if (swipeStartX.current === null) return

    const travelled = event.clientX - swipeStartX.current
    swipeStartX.current = null

    if (Math.abs(travelled) < SWIPE_THRESHOLD) return
    if (travelled < 0) goNext()
    else goPrevious()
  }

  if (count === 0) return null

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Featured offers"
      data-paused={!isAutoPlaying}
      style={{
        '--autoplay-duration': `${interval}ms`,
        ...(activeAccent ? { '--slide-accent': activeAccent } : null),
      }}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        swipeStartX.current = null
      }}
    >
      {/* The homepage's heading. The slide titles below are h2s: which one is
          on screen changes every few seconds, and a page's h1 should not. */}
      <h1 className="visually-hidden">
        {restaurant.name} — {restaurant.tagline}
      </h1>

      <div className={styles.stack} data-direction={direction}>
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index

          return (
            <article
              key={slide.id}
              className={styles.slide}
              data-active={isActive}
              style={slide.accent ? { '--slide-accent': slide.accent } : undefined}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${count}: ${slide.title}`}
              aria-hidden={!isActive}
              inert={!isActive}
            >
              <div className={`page-container ${styles.inner}`}>
                <div className={styles.copy}>
                  {slide.eyebrow && (
                    <p className={styles.eyebrow}>
                      <span className={styles.eyebrowDot} />
                      {slide.eyebrow}
                    </p>
                  )}

                  <h2 className={styles.title}>{slide.title}</h2>

                  <p className={styles.description}>{slide.description}</p>

                  {(slide.price || slide.priceNote) && (
                    <p className={styles.offer}>
                      {slide.price && (
                        <span className={styles.price}>{formatPrice(slide.price)}</span>
                      )}

                      {slide.price && slide.oldPrice && (
                        <span className={styles.oldPrice}>
                          <span className="visually-hidden">was </span>
                          {formatPrice(slide.oldPrice)}
                        </span>
                      )}

                      {slide.priceNote && <span className={styles.priceNote}>{slide.priceNote}</span>}
                    </p>
                  )}

                  <div className={styles.actions}>
                    <Button to={slide.cta.to} size="lg" iconAfter="arrowRight">
                      {slide.cta.label}
                    </Button>

                    {slide.secondaryCta && (
                      <Button to={slide.secondaryCta.to} size="lg" variant="glass">
                        {slide.secondaryCta.label}
                      </Button>
                    )}
                  </div>
                </div>

                <div className={styles.art}>
                  {slide.badge && <span className={styles.badge}>{slide.badge}</span>}

                  <AppImage
                    src={slide.image}
                    alt={slide.imageAlt}
                    ratio="hero"
                    priority={slideIndex === 0}
                    className={styles.image}
                  />
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {count > 1 && (
        <div className={`page-container ${styles.controls}`}>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrevious}`}
            onClick={goPrevious}
            aria-label="Previous offer"
          >
            <Icon name="chevronLeft" size={22} />
          </button>

          <div className={styles.dots}>
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                className={styles.dot}
                data-active={slideIndex === index}
                aria-label={`Go to offer ${slideIndex + 1}: ${slide.title}`}
                aria-current={slideIndex === index}
                onClick={() => goTo(slideIndex, slideIndex > index ? 1 : -1)}
              />
            ))}
          </div>

          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={goNext}
            aria-label="Next offer"
          >
            <Icon name="chevronRight" size={22} />
          </button>
        </div>
      )}
    </section>
  )
}
