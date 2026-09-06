/**
 * Site navigation, shared by the navbar, the mobile menu and the footer.
 * Add a link once here and it appears in all three.
 */

export const primaryNavLinks = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Offers', to: '/offers' },
  { label: 'About', to: '/about' },
  { label: 'Locations', to: '/branches' },
]

export const customerNavLinks = [
  { label: 'My account', to: '/account' },
  { label: 'My orders', to: '/orders' },
  { label: 'Log in', to: '/login' },
  { label: 'Create account', to: '/signup' },
]

export const legalNavLinks = [
  { label: 'Privacy Policy', to: '/about#privacy' },
  { label: 'Terms & Conditions', to: '/about#terms' },
]
