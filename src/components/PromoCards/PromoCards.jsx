import { AppImage } from '@/components/AppImage/AppImage'
import { Button } from '@/components/Button/Button'
import { promoCards } from '@/data/promoCards'
import styles from './PromoCards.module.css'

/**
 * The homepage's promotional grid: two big cards to a row, each one selling a
 * different thing in a different way.
 *
 * Everything shown comes from data/promoCards.js — this file decides how a
 * card is built, never what is on one. A card's `layout` picks between three
 * compositions ('overlay', 'split', 'plain') so a row never reads as two
 * identical boxes, while the radius, type scale, buttons and hover behaviour
 * stay the same across all of them.
 *
 * On clicking
 * -----------
 * The whole card is clickable, but there is still only one link in it: the
 * button's ::after is stretched across the card. A card wrapped in a <Link>
 * with a button inside would be a link inside a link — which browsers and
 * screen readers both handle badly, and which makes the text impossible to
 * select. See `.cta::after` in the stylesheet.
 */
export function PromoCards({ cards = promoCards, id = 'promos-title', title, eyebrow }) {
  if (cards.length === 0) return null

  return (
    <section className={styles.section} aria-labelledby={title ? id : undefined}>
      {title && (
        <header className={styles.header}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2 id={id} className={styles.sectionTitle}>
            {title}
          </h2>
        </header>
      )}

      <div className={styles.grid}>
        {cards.map((card) => (
          <article
            key={card.id}
            className={styles.card}
            data-layout={card.layout ?? 'plain'}
            data-tall={card.tall ? 'true' : undefined}
            style={card.accent ? { '--card-accent': card.accent } : undefined}
          >
            {/* On an overlay card the photograph is the card, so it is worth
                describing. On the other two it is decoration beside type that
                already says the same thing — hence the empty alt. */}
            <div className={styles.art}>
              <AppImage
                src={card.image}
                alt={card.layout === 'overlay' ? card.imageAlt : ''}
                ratio={card.layout === 'overlay' ? 'none' : 'hero'}
                className={styles.image}
              />
            </div>

            <div className={styles.body}>
              {card.eyebrow && <p className={styles.cardEyebrow}>{card.eyebrow}</p>}

              <h3 className={styles.cardTitle}>{card.title}</h3>

              <p className={styles.description}>{card.description}</p>

              {card.note && <p className={styles.note}>{card.note}</p>}

              <Button
                to={card.cta.to}
                variant={card.layout === 'overlay' ? 'primary' : 'outline'}
                iconAfter="arrowRight"
                className={styles.cta}
              >
                {card.cta.label}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

