/**
 * All the icons the site uses, in one small inline-SVG set.
 *
 * Using a map instead of an icon library keeps the bundle tiny and means every
 * icon inherits the current text colour. Add a new one by adding a key here:
 *
 *   myIcon: <path d="..." />
 *
 * Then render it with <Icon name="myIcon" />.
 */

const ICON_PATHS = {
  // Navigation & chrome
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.55L21 8H6" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.7-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.3 12 20 12 20Z" />
  ),
  star: (
    <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.7l5.4-.8L12 4Z" />
  ),

  // Actions
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 13 4.5 4.5L19 7" />,
  trash: (
    <>
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 18l-6-6 6-6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,

  // Order types
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  plate: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3.5" />
    </>
  ),

  // Info
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </>
  ),
  phone: (
    <path d="M6 3h3l1.6 4-2 1.4a12 12 0 0 0 5.6 5.6l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.2 2 2 0 0 1 6 3Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 10h19" />
    </>
  ),
  cash: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18v3" />
      <rect x="3" y="7.5" width="18" height="11.5" rx="2" />
      <circle cx="16.5" cy="13" r="1.2" />
    </>
  ),
  flame: (
    <path d="M12 3c1.5 3.2.9 5.2-.7 7-1.8 2-3.1 3.4-3.1 5.8A3.8 3.8 0 0 0 12 20a3.8 3.8 0 0 0 3.8-4c0-1.1-.4-2-1-2.8 2.3.9 3.7 3.2 3.7 5.7" />
  ),
  leaf: (
    <>
      <path d="M20 4c0 9-5 12-9.5 12A4.5 4.5 0 0 1 6 11.5C6 7 9.5 4 20 4Z" />
      <path d="M14 10 5 19" />
    </>
  ),
  chilli: (
    <>
      <path d="M17 6c-1 5-4.5 9-8 10.5C6.6 17.5 5 16.4 5 14.5 5 11 9 8 13.5 8" />
      <path d="M17 6c0-1.5.8-2.5 2-3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),

  // Rewards
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="11.5" rx="2" />
      <path d="M3.5 13.5h17M12 9v11.5" />
      <path d="M12 9S10.8 4.5 8.4 4.5a2.2 2.2 0 0 0 0 4.5H12Zm0 0s1.2-4.5 3.6-4.5a2.2 2.2 0 0 1 0 4.5H12Z" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="14.5" r="5.5" />
      <path d="M12 12.4l.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9 14.5l2-.3Z" />
      <path d="M8.5 9.2 6 3.5h4l1.6 3.7M15.5 9.2 18 3.5h-4l-1.6 3.7" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9Z" />
      <path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z" />
    </>
  ),
  ticket: (
    <>
      <path d="M3.5 8.5A1.5 1.5 0 0 1 5 7h14a1.5 1.5 0 0 1 1.5 1.5v2a2 2 0 0 0 0 3.9v2A1.5 1.5 0 0 1 19 18H5a1.5 1.5 0 0 1-1.5-1.6v-2a2 2 0 0 0 0-3.9Z" />
      <path d="M13.5 7v11" stroke-dasharray="2 2.6" />
    </>
  ),

  // Account & forms
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M9.9 5.8A8.5 8.5 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.8 3.6M6.2 7.7A16.4 16.4 0 0 0 2.5 12S6 18.5 12 18.5a8.9 8.9 0 0 0 3.6-.74" />
      <path d="M10 10a2.8 2.8 0 0 0 4 4M3.5 3.5l17 17" />
    </>
  ),
  logout: (
    <>
      <path d="M14.5 8V6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
      <path d="M9.5 12h11m0 0-3-3m3 3-3 3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 0 1-4 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3.2a2 2 0 0 1 0-4h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V3.2a2 2 0 0 1 4 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.3a2 2 0 0 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.4-7 8.9-4.1-1.5-7-4.6-7-8.9V6Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.5 21 19.5H3Z" />
      <path d="M12 10v3.6M12 16.6h.01" />
    </>
  ),
  chevronLeft: <path d="m15 6-6 6 6 6" />,

  // Social
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M16.8 7.2h.01" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5h2V5.6h-2.3c-2 0-3.2 1.3-3.2 3.4v1.6H9v2.9h2v6.5h3v-6.5h2.2l.4-2.9H14V9.4c0-.6.2-.9.5-.9Z" />
  ),
  tiktok: (
    <path d="M14 4v9.8a3.2 3.2 0 1 1-2.6-3.1M14 4c.4 2.2 1.9 3.6 4 3.8" />
  ),
}

export function Icon({ name, size = 20, strokeWidth = 1.8, className, ...rest }) {
  const paths = ICON_PATHS[name]
  if (!paths) return null

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths}
    </svg>
  )
}
