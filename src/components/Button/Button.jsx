import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon/Icon'
import styles from './Button.module.css'

/**
 * The one button in the app.
 *
 *   variant   'primary' | 'secondary' | 'outline' | 'glass' | 'ghost' | 'danger'
 *             'glass' is frosted, for sitting on top of photography.
 *   size      'sm' | 'md' | 'lg'
 *   to        renders a react-router <Link> instead of a <button>
 *   href      renders a plain <a> (for external links)
 *   isLoading shows a spinner and blocks clicks
 *
 * A disabled link is not a thing in HTML, so when `disabled` is set we always
 * render a real <button> — otherwise the link would stay clickable.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  iconBefore,
  iconAfter,
  className = '',
  ...rest
}) {
  const isDisabled = disabled || isLoading

  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
      {!isLoading && iconBefore && <Icon name={iconBefore} size={size === 'sm' ? 16 : 18} />}
      <span className={styles.label}>{children}</span>
      {!isLoading && iconAfter && <Icon name={iconAfter} size={size === 'sm' ? 16 : 18} />}
    </>
  )

  if (to && !isDisabled) {
    return (
      <Link to={to} className={classNames} {...rest}>
        {content}
      </Link>
    )
  }

  if (href && !isDisabled) {
    return (
      <a href={href} className={classNames} target="_blank" rel="noreferrer" {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classNames}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {content}
    </button>
  )
}
