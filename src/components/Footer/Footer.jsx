import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo/Logo'
import { Icon } from '@/components/Icon/Icon'
import { Button } from '@/components/Button/Button'
import { useToast } from '@/context/ToastContext'
import { isValidEmail } from '@/utils/validation'
import { restaurant } from '@/config/restaurant'
import { primaryNavLinks, customerNavLinks, legalNavLinks } from '@/data/navigation'
import styles from './Footer.module.css'

const SOCIAL_ICONS = {
  Instagram: 'instagram',
  Facebook: 'facebook',
  TikTok: 'tiktok',
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`page-container ${styles.top}`}>
        <div className={styles.brand}>
          <Logo tone="light" showTagline />
          <p className={styles.blurb}>{restaurant.description}</p>

          <ul className={styles.social}>
            {restaurant.social.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.url}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${restaurant.name} on ${channel.label}`}
                >
                  <Icon name={SOCIAL_ICONS[channel.label] ?? 'arrowRight'} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterLinkColumn title="Explore" links={primaryNavLinks} />
        <FooterLinkColumn
          title="Customer"
          links={[...customerNavLinks, { label: 'Help & contact', to: '/about#contact' }]}
        />

        <NewsletterSignup />
      </div>

      <div className={`page-container ${styles.bottom}`}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} {restaurant.name}. All rights reserved. This is a demo
          site — orders are not sent to a real kitchen.
        </p>

        <ul className={styles.legal}>
          {legalNavLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.to} className={styles.legalLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

function FooterLinkColumn({ title, links }) {
  return (
    <nav className={styles.column} aria-label={title}>
      <h3 className={styles.columnTitle}>{title}</h3>
      <ul className={styles.columnLinks}>
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className={styles.link}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Demo signup — nothing is sent anywhere, it just confirms on screen. */
function NewsletterSignup() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isValidEmail(email)) {
      setError('Enter a valid email address.')
      return
    }

    setError(null)
    setEmail('')
    showToast('Thanks — you are on the list for our latest offers.')
  }

  return (
    <div className={styles.column}>
      <h3 className={styles.columnTitle}>Get the latest offers</h3>
      <p className={styles.newsletterText}>
        New deals, new dishes and the occasional free side. No spam.
      </p>

      <form className={styles.newsletterForm} onSubmit={handleSubmit} noValidate>
        <label htmlFor="newsletter-email" className="visually-hidden">
          Your email address
        </label>

        <input
          id="newsletter-email"
          type="email"
          className={styles.newsletterInput}
          value={email}
          placeholder="Your email"
          onChange={(event) => {
            setEmail(event.target.value)
            setError(null)
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'newsletter-error' : undefined}
        />

        <Button type="submit">Subscribe</Button>
      </form>

      {error && (
        <p id="newsletter-error" className={styles.newsletterError} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
