/**
 * Responsive navigation.
 *
 * The CSS decides what the menu *looks* like at each width. This file only
 * handles the part CSS cannot: the open/closed state on a narrow screen, and
 * where the keyboard focus goes while the panel is open.
 */

const toggle = document.querySelector('.nav__toggle')
const closeButton = document.querySelector('.nav__close')
const panel = document.querySelector('.nav__panel')
const backdrop = document.querySelector('.nav__backdrop')

/**
 * The breakpoint, read from the stylesheet rather than repeated here.
 *
 * `--bp-md` is declared on :root as a length, so `matchMedia` can use it
 * directly — which means the JavaScript cannot drift out of step with the CSS
 * the way a hard-coded `768` silently would.
 */
const breakpoint = getComputedStyle(document.documentElement)
  .getPropertyValue('--bp-md')
  .trim()

const desktopQuery = window.matchMedia(`(min-width: ${breakpoint})`)

/** What the panel offers the keyboard, in DOM order. */
const focusableSelector = 'a[href], button:not([disabled])'

let isOpen = false
/** Who opened the menu, so focus can go back there when it closes. */
let lastFocused = null

function setOpen(open) {
  isOpen = open

  panel.dataset.open = String(open)
  backdrop.dataset.open = String(open)
  toggle.setAttribute('aria-expanded', String(open))
  toggle.querySelector('.visually-hidden').textContent = open ? 'Close menu' : 'Open menu'
  document.body.dataset.navOpen = String(open)

  if (open) {
    lastFocused = document.activeElement
    // Into the panel, not just next to it: the first thing in there is the
    // close button, which is what someone wants if they opened it by mistake.
    closeButton.focus()
  } else if (lastFocused instanceof HTMLElement) {
    // Back where they were. Losing focus to <body> means the next Tab starts
    // from the top of the page, which is disorienting on a long one.
    lastFocused.focus()
    lastFocused = null
  }
}

const open = () => setOpen(true)
const close = () => {
  if (isOpen) setOpen(false)
}

toggle.addEventListener('click', () => (isOpen ? close() : open()))
closeButton.addEventListener('click', close)
backdrop.addEventListener('click', close)

// Following a link should close the menu — on a single-page site the URL
// changes without a reload, and the panel would otherwise stay over the
// content the visitor just asked to see.
panel.querySelectorAll('.nav__link, .nav__cta').forEach((link) => {
  link.addEventListener('click', close)
})

document.addEventListener('keydown', (event) => {
  if (!isOpen) return

  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }

  /**
   * Keep Tab inside the panel while it is open.
   *
   * An open menu over a dimmed page is a dialog in everything but name: tab
   * past the last link and focus lands on the page behind, which the visitor
   * cannot see. Wrapping to the other end keeps the keyboard where the eyes
   * are. Shift+Tab wraps the same way, backwards.
   */
  if (event.key !== 'Tab') return

  const focusable = [...panel.querySelectorAll(focusableSelector)]
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
})

/**
 * Crossing the breakpoint while the panel is open.
 *
 * At desktop width the panel becomes the ordinary nav row, so "open" stops
 * meaning anything — but the body would stay scroll-locked and the toggle
 * would still claim aria-expanded="true". Resetting on the change event costs
 * one listener and avoids a page that cannot scroll for no visible reason.
 */
desktopQuery.addEventListener('change', (event) => {
  if (event.matches) close()
})
