import styles from './Avatar.module.css'

/**
 * A customer's picture.
 *
 * Nobody uploads a photo in the prototype, so this draws their initials on a
 * warm tint picked from their name — stable per person, and it never looks
 * like a missing image. Pass `src` later and the photo takes over.
 *
 *   size   'sm' | 'md' | 'lg'
 */
export function Avatar({ user, src, size = 'md', className = '' }) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()
  const initials =
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'

  // Same name, same colour, every time — and always inside the warm half of
  // the wheel, so an avatar never turns up green next to the brand orange.
  const hue = [...name].reduce((total, character) => total + character.charCodeAt(0), 0) % 38

  return (
    <span
      className={`${styles.avatar} ${styles[size]} ${className}`}
      style={{ '--avatar-hue': 6 + hue }}
      aria-hidden="true"
    >
      {src ? <img className={styles.image} src={src} alt="" /> : initials}
    </span>
  )
}
