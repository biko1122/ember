/**
 * The dish renderers.
 *
 * Every dish is drawn around its own local origin (0, 0) and the caller places
 * it with `place(art, x, y, scale)`. That way the same burger can fill a wide
 * product card, a square category tile or a hero without being redrawn.
 *
 * See artwork-kit.mjs for the shared primitives, and ASSETS.md for how these
 * are replaced by the restaurant's real photography.
 */

import {
  n,
  hsl,
  hsla,
  between,
  blob,
  ruffle,
  speckle,
  sesame,
  steam,
  plate,
  board,
  contactShadow,
} from './artwork-kit.mjs'

/** Puts a locally-drawn dish somewhere on the canvas. */
export function place(art, x, y, scale = 1, rotate = 0) {
  const transform = `translate(${n(x)} ${n(y)}) scale(${n(scale)})${rotate ? ` rotate(${n(rotate)})` : ''}`
  return `<g transform="${transform}">${art}</g>`
}

/** A rounded slab — the workhorse for buns, patties, cheese and bread. */
function slab(y, hw, h, radius, fill, opacity = 1) {
  const r = Math.min(radius, h / 2, hw)
  return `<path d="M${n(-hw + r)} ${n(y)} h${n(2 * hw - 2 * r)} a${n(r)} ${n(r)} 0 0 1 ${n(r)} ${n(r)} v${n(h - 2 * r)} a${n(r)} ${n(r)} 0 0 1 ${n(-r)} ${n(r)} h${n(-(2 * hw - 2 * r))} a${n(r)} ${n(r)} 0 0 1 ${n(-r)} ${n(-r)} v${n(-(h - 2 * r))} a${n(r)} ${n(r)} 0 0 1 ${n(r)} ${n(-r)} z" fill="${fill}"${opacity === 1 ? '' : ` opacity="${opacity}"`}/>`
}

/** A dome — bun crowns and scoops of ice cream. */
function dome(y, hw, height, fill) {
  return `<path d="M${n(-hw)} ${n(y)} a${n(hw)} ${n(height)} 0 0 1 ${n(2 * hw)} 0 z" fill="${fill}"/>`
}

/* ========================================================================== */
/* Burgers                                                                     */
/* ========================================================================== */

export function burger(random, { double = false, vegetarian = false, spicy = false } = {}) {
  const hw = 196
  let out = contactShadow(0, 196, 250, 46)

  // Bottom bun
  out += slab(120, hw - 8, 62, 26, hsl(31, 62, 52))
  out += slab(120, hw - 8, 20, 12, hsla(36, 78, 66, 0.5))

  let y = 108

  const patty = (top) => {
    let s = slab(top, hw - 2, 46, 20, hsl(18, 46, 22))
    s += slab(top, hw - 2, 14, 8, hsla(20, 40, 34, 0.75))
    s += speckle(0, top + 24, hw - 40, 14, random, 9, hsla(24, 40, 12, 0.9), 0.6)
    return s
  }

  const cheeseSlice = (top) => {
    let s = `<path d="M${n(-hw - 6)} ${n(top)} h${n(2 * hw + 12)} v20 q-30 26 -62 6 q-34 30 -70 2 q-36 30 -72 0 q-32 22 -60 -8 z" fill="${hsl(38, 92, 56)}"/>`
    s += `<path d="M${n(-hw - 6)} ${n(top)} h${n(2 * hw + 12)} v7 h${n(-(2 * hw + 12))} z" fill="${hsla(46, 100, 74, 0.65)}"/>`
    return s
  }

  if (vegetarian) {
    // Halloumi or a veggie patty: paler, with griddle marks.
    out += slab(y - 46, hw - 14, 46, 14, hsl(42, 48, 74))
    out += `<g stroke="${hsla(28, 60, 36, 0.7)}" stroke-width="7" stroke-linecap="round">`
    for (let i = -2; i <= 2; i += 1) {
      out += `<path d="M${n(i * 54 - 18)} ${n(y - 34)} l26 24"/>`
    }
    out += `</g>`
    y -= 46
  } else {
    out += patty(y - 46)
    y -= 46
  }

  out += cheeseSlice(y - 10)
  y -= 12

  if (double) {
    out += patty(y - 46)
    y -= 46
    out += cheeseSlice(y - 10)
    y -= 12
  }

  // Tomato
  out += `<g>`
  for (let i = -1; i <= 1; i += 1) {
    const cx = i * 110
    out += `<ellipse cx="${n(cx)}" cy="${n(y - 12)}" rx="62" ry="17" fill="${hsl(6, 74, 44)}"/>`
    out += `<ellipse cx="${n(cx)}" cy="${n(y - 15)}" rx="46" ry="11" fill="${hsl(8, 68, 56)}" opacity="0.8"/>`
  }
  out += `</g>`
  y -= 20

  // Lettuce
  out += `<path d="${ruffle(-hw - 14, y, 2 * hw + 28, 26, random, 8)}" fill="${hsl(96, 42, 40)}"/>`
  out += `<path d="${ruffle(-hw - 6, y - 8, 2 * hw + 12, 18, random, 7)}" fill="${hsl(94, 48, 50)}" opacity="0.85"/>`
  y -= 30

  if (spicy) {
    // A scatter of jalapeno rings peeking out of the stack.
    for (let i = -2; i <= 2; i += 1) {
      const cx = i * 78 + between(random, -12, 12)
      out += `<ellipse cx="${n(cx)}" cy="${n(y + 16)}" rx="22" ry="9" fill="${hsl(88, 58, 38)}"/>`
      out += `<ellipse cx="${n(cx)}" cy="${n(y + 16)}" rx="10" ry="4" fill="${hsl(92, 44, 26)}"/>`
    }
  }

  // Crown
  out += dome(y, hw, 132, hsl(30, 68, 50))
  out += `<path d="M${n(-hw)} ${n(y)} a${n(hw)} 132 0 0 1 ${n(2 * hw)} 0 z" fill="url(#bunSheen)" opacity="0.55"/>`
  out += sesame(0, y - 24, hw - 46, 76, random, 12)

  return `<defs><linearGradient id="bunSheen" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0%" stop-color="${hsla(44, 100, 78, 0.7)}"/><stop offset="60%" stop-color="${hsla(44, 100, 78, 0)}"/></linearGradient></defs>${out}`
}

/* ========================================================================== */
/* Chicken                                                                     */
/* ========================================================================== */

const CRUST = hsl(32, 76, 48)
const CRUST_DEEP = hsl(26, 68, 34)
const CRUST_LIGHT = hsl(38, 84, 62)

/** Strips, fillets, popcorn and wings all share this crispy body. */
function crispyPiece(cx, cy, rx, ry, random, rotation = 0) {
  let out = `<g transform="rotate(${n(rotation)} ${n(cx)} ${n(cy)})">`
  out += `<path d="${blob(cx, cy + 5, rx, ry, random, { bumps: 11, jitter: 0.13 })}" fill="${CRUST_DEEP}"/>`
  out += `<path d="${blob(cx, cy, rx, ry, random, { bumps: 11, jitter: 0.13 })}" fill="${CRUST}"/>`
  out += `<path d="${blob(cx - rx * 0.12, cy - ry * 0.24, rx * 0.62, ry * 0.5, random, { bumps: 9, jitter: 0.18 })}" fill="${CRUST_LIGHT}" opacity="0.55"/>`
  out += speckle(cx, cy, rx, ry, random, 14, hsla(24, 62, 22, 0.9), 0.55)
  return `${out}</g>`
}

/** A little pot of dip, so plates do not read as empty. */
function dipPot(cx, cy, r, colour) {
  return (
    `<ellipse cx="${n(cx)}" cy="${n(cy + r * 0.16)}" rx="${n(r)}" ry="${n(r * 0.38)}" fill="${hsl(30, 10, 88)}"/>` +
    `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(r)}" ry="${n(r * 0.38)}" fill="${hsl(30, 8, 94)}"/>` +
    `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(r * 0.78)}" ry="${n(r * 0.28)}" fill="${colour}"/>`
  )
}

export function friedChicken(random, { shape = 'strip', count = 4, dip = true } = {}) {
  let out = contactShadow(0, 168, 300, 52)
  out += plate(0, 150, 300)

  const layout = {
    strip: { rx: 132, ry: 42, spread: 96, rot: 16 },
    fillet: { rx: 148, ry: 92, spread: 118, rot: 10 },
    popcorn: { rx: 46, ry: 38, spread: 70, rot: 30 },
    wing: { rx: 96, ry: 66, spread: 104, rot: 22 },
  }[shape]

  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0 : i / (count - 1) - 0.5
    const cx = t * layout.spread * (count - 1) * 0.5
    const cy = 96 - Math.abs(t) * 30 + between(random, -14, 14)
    const rotation = between(random, -layout.rot, layout.rot)

    if (shape === 'wing') {
      out += crispyPiece(cx, cy, layout.rx, layout.ry, random, rotation)
      // A glossy sauce coat plus the bone nub that says "wing".
      out += `<path d="${blob(cx, cy, layout.rx * 0.9, layout.ry * 0.86, random, { bumps: 9, jitter: 0.1 })}" fill="${hsl(8, 78, 42)}" opacity="0.62"/>`
      out += `<ellipse cx="${n(cx - layout.rx * 0.82)}" cy="${n(cy + layout.ry * 0.4)}" rx="20" ry="13" fill="${hsl(38, 30, 84)}" transform="rotate(${n(rotation)} ${n(cx)} ${n(cy)})"/>`
    } else {
      out += crispyPiece(cx, cy, layout.rx, layout.ry, random, rotation)
    }
  }

  if (shape === 'popcorn') {
    // Popcorn chicken piles rather than lines up.
    out = contactShadow(0, 168, 290, 50) + plate(0, 150, 290)
    for (let i = 0; i < 16; i += 1) {
      const angle = random() * Math.PI * 2
      const radius = Math.sqrt(random()) * 190
      out += crispyPiece(
        Math.cos(angle) * radius,
        70 + Math.sin(angle) * radius * 0.34,
        between(random, 38, 52),
        between(random, 30, 42),
        random,
        between(random, -40, 40),
      )
    }
  }

  if (dip) out += dipPot(210, 128, 62, hsl(34, 84, 60))

  return out
}

export function grilledChicken(random) {
  let out = contactShadow(0, 168, 290, 50)
  out += board(0, 150, 290, random)

  // Thigh and drumstick.
  out += `<path d="${blob(-40, 74, 158, 108, random, { bumps: 10, jitter: 0.08 })}" fill="${hsl(28, 58, 40)}"/>`
  out += `<path d="${blob(-46, 62, 132, 86, random, { bumps: 10, jitter: 0.1 })}" fill="${hsl(30, 66, 50)}"/>`
  out += `<path d="${blob(120, 96, 92, 62, random, { bumps: 9, jitter: 0.1 })}" fill="${hsl(28, 60, 44)}"/>`
  out += `<ellipse cx="196" cy="122" rx="30" ry="18" fill="${hsl(40, 26, 86)}" transform="rotate(24 196 122)"/>`

  // Char lines.
  out += `<g stroke="${hsla(20, 62, 16, 0.55)}" stroke-width="9" stroke-linecap="round">`
  for (let i = -2; i <= 2; i += 1) {
    out += `<path d="M${n(i * 52 - 96)} ${n(30 + Math.abs(i) * 8)} l52 62"/>`
  }
  out += `</g>`

  out += `<path d="${blob(-40, 62, 96, 46, random, { bumps: 8, jitter: 0.2 })}" fill="${hsla(40, 92, 70, 0.28)}"/>`
  out += steam(-20, -60, random, { count: 3, height: 130, opacity: 0.14 })
  return out
}

export function bucket(random, { tall = true } = {}) {
  const topHw = tall ? 220 : 200
  const bottomHw = tall ? 158 : 150
  const top = tall ? -40 : -20
  const bottom = 180

  let out = contactShadow(0, 196, 250, 46)

  // Chicken piled above the rim.
  for (let i = 0; i < 7; i += 1) {
    const cx = between(random, -170, 170)
    const cy = top - between(random, 10, 84)
    out += crispyPiece(cx, cy, between(random, 66, 92), between(random, 50, 68), random, between(random, -40, 40))
  }

  // Bucket body.
  out += `<path d="M${n(-topHw)} ${n(top)} L${n(topHw)} ${n(top)} L${n(bottomHw)} ${n(bottom)} q${n(-bottomHw)} 42 ${n(-2 * bottomHw)} 0 z" fill="${hsl(6, 72, 46)}"/>`
  out += `<path d="M${n(-topHw)} ${n(top)} L${n(-topHw + 54)} ${n(top)} L${n(-bottomHw + 44)} ${n(bottom + 16)} q-26 -6 -${n(bottomHw - 10)} -16 z" fill="${hsla(0, 0, 100, 0.14)}"/>`

  // Brand band.
  const bandTop = top + 74
  const bandHw = topHw - (topHw - bottomHw) * ((bandTop - top) / (bottom - top))
  out += `<path d="M${n(-bandHw)} ${n(bandTop)} L${n(bandHw)} ${n(bandTop)} L${n(bandHw - 14)} ${n(bandTop + 58)} L${n(-bandHw + 14)} ${n(bandTop + 58)} z" fill="${hsl(36, 18, 96)}" opacity="0.94"/>`
  out += `<circle cx="0" cy="${n(bandTop + 29)}" r="21" fill="${hsl(18, 90, 52)}"/>`

  // Rim.
  out += `<ellipse cx="0" cy="${n(top)}" rx="${n(topHw)}" ry="${n(topHw * 0.2)}" fill="${hsl(6, 64, 38)}"/>`
  out += `<ellipse cx="0" cy="${n(top - 6)}" rx="${n(topHw)}" ry="${n(topHw * 0.2)}" fill="${hsl(6, 76, 52)}"/>`
  out += `<ellipse cx="0" cy="${n(top - 6)}" rx="${n(topHw - 22)}" ry="${n(topHw * 0.15)}" fill="${hsl(8, 50, 26)}"/>`

  return out
}

/* ========================================================================== */
/* Pizza                                                                       */
/* ========================================================================== */

export function pizza(random, { topping = 'pepperoni', slicePulled = true } = {}) {
  const r = 288
  let out = contactShadow(0, 196, 300, 48)

  // Crust and base, drawn from above.
  out += `<circle cx="0" cy="0" r="${n(r)}" fill="${hsl(30, 62, 44)}"/>`
  out += `<circle cx="0" cy="-8" r="${n(r)}" fill="${hsl(33, 72, 55)}"/>`
  out += speckle(0, -8, r * 0.98, r * 0.98, random, 26, hsla(24, 60, 28, 0.55), 0.5)
  out += `<circle cx="0" cy="-8" r="${n(r * 0.84)}" fill="${hsl(8, 70, 40)}"/>`
  out += `<circle cx="0" cy="-8" r="${n(r * 0.8)}" fill="${hsl(44, 82, 62)}"/>`

  // Melted cheese mottling.
  for (let i = 0; i < 12; i += 1) {
    const angle = random() * Math.PI * 2
    const radius = Math.sqrt(random()) * r * 0.7
    out += `<path d="${blob(Math.cos(angle) * radius, -8 + Math.sin(angle) * radius, between(random, 24, 52), between(random, 20, 44), random, { bumps: 8, jitter: 0.24 })}" fill="${hsl(48, 90, 74)}" opacity="0.5"/>`
  }

  const toppings = {
    pepperoni: (cx, cy) => {
      const rr = between(random, 32, 42)
      return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(rr)}" fill="${hsl(2, 68, 38)}"/><circle cx="${n(cx)}" cy="${n(cy - 2)}" r="${n(rr * 0.9)}" fill="${hsl(4, 74, 46)}"/><circle cx="${n(cx - rr * 0.25)}" cy="${n(cy - rr * 0.3)}" r="${n(rr * 0.2)}" fill="${hsla(10, 60, 70, 0.5)}"/>`
    },
    chicken: (cx, cy) =>
      `<path d="${blob(cx, cy, between(random, 30, 42), between(random, 22, 30), random, { bumps: 8, jitter: 0.16 })}" fill="${hsl(34, 56, 58)}"/>`,
    beef: (cx, cy) =>
      `<path d="${blob(cx, cy, between(random, 22, 32), between(random, 18, 26), random, { bumps: 9, jitter: 0.2 })}" fill="${hsl(20, 48, 30)}"/>`,
    cheese: (cx, cy) =>
      `<path d="${blob(cx, cy, between(random, 30, 46), between(random, 24, 38), random, { bumps: 8, jitter: 0.2 })}" fill="${hsl(52, 88, 78)}" opacity="0.85"/>`,
    basil: (cx, cy) =>
      `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(between(random, 24, 34))}" ry="${n(between(random, 13, 18))}" fill="${hsl(104, 46, 34)}" transform="rotate(${n(between(random, -60, 60))} ${n(cx)} ${n(cy)})"/>`,
  }

  const draw = toppings[topping] ?? toppings.pepperoni
  for (let i = 0; i < 11; i += 1) {
    const angle = random() * Math.PI * 2
    const radius = Math.sqrt(random()) * r * 0.66
    out += draw(Math.cos(angle) * radius, -8 + Math.sin(angle) * radius)
  }
  if (topping !== 'basil') {
    for (let i = 0; i < 4; i += 1) {
      const angle = random() * Math.PI * 2
      const radius = Math.sqrt(random()) * r * 0.6
      out += toppings.basil(Math.cos(angle) * radius, -8 + Math.sin(angle) * radius)
    }
  }

  // Slice cuts.
  out += `<g stroke="${hsla(24, 60, 24, 0.32)}" stroke-width="5">`
  for (let i = 0; i < 4; i += 1) {
    const angle = (i / 4) * Math.PI
    out += `<path d="M${n(-Math.cos(angle) * r * 0.86)} ${n(-8 - Math.sin(angle) * r * 0.86)} L${n(Math.cos(angle) * r * 0.86)} ${n(-8 + Math.sin(angle) * r * 0.86)}"/>`
  }
  out += `</g>`

  if (slicePulled) {
    // One slice lifted clear of the pie, cheese still attached.
    out += `<g transform="translate(96 34) rotate(12)"><path d="M0 -8 L${n(r * 0.76)} ${n(-8 - r * 0.32)} A${n(r * 0.82)} ${n(r * 0.82)} 0 0 1 ${n(r * 0.76)} ${n(-8 + r * 0.32)} z" fill="${hsl(33, 72, 55)}"/><path d="M10 -8 L${n(r * 0.7)} ${n(-8 - r * 0.28)} A${n(r * 0.74)} ${n(r * 0.74)} 0 0 1 ${n(r * 0.7)} ${n(-8 + r * 0.28)} z" fill="${hsl(44, 82, 62)}"/>${draw(150, -8)}</g>`
  }

  return out
}

/* ========================================================================== */
/* Sandwiches                                                                  */
/* ========================================================================== */

export function sandwich(random, { style = 'sub' } = {}) {
  let out = contactShadow(0, 178, 280, 48)
  out += board(0, 158, 280, random)

  if (style === 'wrap') {
    // A rolled wrap, cut on the diagonal, filling showing at the cut.
    out += `<g transform="rotate(-14)">`
    out += `<path d="M-230 40 L120 40 L120 -84 L-230 -84 a26 62 0 0 0 0 124 z" fill="${hsl(38, 46, 74)}"/>`
    out += `<path d="M-230 40 a26 62 0 0 1 0 -124 z" fill="${hsl(38, 40, 64)}"/>`
    out += `<path d="M120 -84 L214 -30 L214 92 L120 40 z" fill="${hsl(36, 42, 66)}"/>`
    out += `<path d="M120 -84 L214 -30 L120 40 z" fill="${hsl(96, 40, 44)}"/>`
    out += `<path d="M136 -60 L196 -24 L140 16 z" fill="${hsl(32, 74, 54)}"/>`
    out += `<g stroke="${hsla(30, 40, 46, 0.5)}" stroke-width="6" stroke-linecap="round">`
    for (let i = 0; i < 4; i += 1) out += `<path d="M${n(-190 + i * 78)} -80 l-16 118"/>`
    out += `</g></g>`
    return out
  }

  // Two stacked halves, cut corner to camera.
  const half = (dx, dy, rot) => {
    let s = `<g transform="translate(${n(dx)} ${n(dy)}) rotate(${n(rot)})">`
    s += `<path d="M-190 40 h380 v-26 a26 26 0 0 0 -26 -26 h-328 a26 26 0 0 0 -26 26 z" fill="${hsl(32, 56, 52)}"/>`
    s += `<path d="M-190 -12 h380 v-16 h-380 z" fill="${hsl(96, 42, 42)}"/>`
    s += `<path d="M-190 -28 h380 v-22 h-380 z" fill="${style === 'melt' ? hsl(18, 44, 26) : hsl(32, 74, 54)}"/>`
    s += `<path d="M-190 -50 h380 v-14 h-380 z" fill="${hsl(40, 92, 60)}"/>`
    if (style === 'club') {
      s += `<path d="M-190 -64 h380 v-18 h-380 z" fill="${hsl(6, 70, 46)}"/>`
      s += `<path d="M-190 -82 h380 v-16 h-380 z" fill="${hsl(32, 56, 58)}"/>`
    }
    const crown = style === 'club' ? -98 : -64
    s += `<path d="M-190 ${n(crown)} h380 v-30 a30 30 0 0 0 -30 -30 h-320 a30 30 0 0 0 -30 30 z" fill="${hsl(30, 62, 56)}"/>`
    s += sesame(0, crown - 30, 150, 22, random, 7)
    s += `</g>`
    return s
  }

  out += half(-96, 60, -4)
  out += half(104, 24, 6)
  return out
}

/* ========================================================================== */
/* Sides                                                                       */
/* ========================================================================== */

export function fries(random, { loaded = false } = {}) {
  let out = contactShadow(0, 188, 240, 44)

  // Fries fanning out of the carton.
  const sticks = []
  for (let i = 0; i < 15; i += 1) {
    const x = between(random, -128, 128)
    const height = between(random, 170, 268)
    const tilt = between(random, -13, 13)
    sticks.push(
      `<g transform="rotate(${n(tilt)} ${n(x)} 90)"><rect x="${n(x - 17)}" y="${n(90 - height)}" width="34" height="${n(height)}" rx="12" fill="${hsl(42, 88, between(random, 52, 66))}"/><rect x="${n(x - 17)}" y="${n(90 - height)}" width="13" height="${n(height)}" rx="6" fill="${hsla(48, 96, 78, 0.5)}"/></g>`,
    )
  }
  out += sticks.join('')

  // Carton.
  out += `<path d="M-150 62 L150 62 L118 190 q-118 30 -236 0 z" fill="${hsl(4, 70, 46)}"/>`
  out += `<path d="M-150 62 L-96 62 L-72 194 q-30 -4 -54 -10 z" fill="${hsla(0, 0, 100, 0.16)}"/>`
  out += `<path d="M-150 62 L150 62 L144 86 L-144 86 z" fill="${hsl(2, 62, 38)}"/>`
  out += `<circle cx="0" cy="132" r="26" fill="${hsl(36, 18, 96)}" opacity="0.92"/>`
  out += `<circle cx="0" cy="132" r="14" fill="${hsl(18, 90, 52)}"/>`

  if (loaded) {
    // Cheese sauce over the top, plus a scatter of beef and jalapeno.
    out += `<path d="M-140 58 q40 34 78 6 q42 40 84 4 q40 36 80 2 q22 26 44 -4 l-8 34 q-142 34 -286 0 z" fill="${hsl(40, 92, 58)}"/>`
    for (let i = 0; i < 9; i += 1) {
      out += `<path d="${blob(between(random, -120, 120), between(random, 26, 74), between(random, 14, 22), between(random, 11, 17), random, { bumps: 8, jitter: 0.22 })}" fill="${hsl(20, 46, 26)}"/>`
    }
    for (let i = 0; i < 5; i += 1) {
      const cx = between(random, -110, 110)
      const cy = between(random, 24, 66)
      out += `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="18" ry="8" fill="${hsl(88, 58, 40)}"/>`
    }
  }

  return out
}

export function onionRings(random) {
  let out = contactShadow(0, 176, 270, 46)
  out += plate(0, 156, 270)

  const ring = (cx, cy, r, rot) =>
    `<g transform="rotate(${n(rot)} ${n(cx)} ${n(cy)})"><ellipse cx="${n(cx)}" cy="${n(cy + 8)}" rx="${n(r)}" ry="${n(r * 0.82)}" fill="${CRUST_DEEP}"/><ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(r)}" ry="${n(r * 0.82)}" fill="${CRUST}"/><ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(r * 0.46)}" ry="${n(r * 0.38)}" fill="${hsl(26, 48, 20)}"/><ellipse cx="${n(cx - r * 0.2)}" cy="${n(cy - r * 0.42)}" rx="${n(r * 0.44)}" ry="${n(r * 0.18)}" fill="${CRUST_LIGHT}" opacity="0.6"/></g>`

  out += ring(-142, 118, 92, -8)
  out += ring(140, 122, 88, 10)
  out += ring(-52, 66, 96, 6)
  out += ring(62, 22, 92, -12)
  out += ring(-6, -54, 88, 4)
  return out
}

export function bowl(random, { kind = 'coleslaw' } = {}) {
  let out = contactShadow(0, 182, 240, 44)

  const rimY = 24
  const rx = 230
  out += `<path d="M${n(-rx)} ${n(rimY)} a${n(rx)} ${n(rx * 0.86)} 0 0 0 ${n(2 * rx)} 0 z" fill="${hsl(28, 12, 24)}"/>`
  out += `<path d="M${n(-rx + 14)} ${n(rimY)} a${n(rx - 14)} ${n(rx * 0.8)} 0 0 0 ${n(2 * rx - 28)} 0 z" fill="${hsl(28, 14, 32)}"/>`

  if (kind === 'mash') {
    out += `<path d="${blob(0, 0, 196, 74, random, { bumps: 12, jitter: 0.08 })}" fill="${hsl(46, 44, 82)}"/>`
    out += `<path d="${blob(-10, -14, 150, 52, random, { bumps: 10, jitter: 0.12 })}" fill="${hsl(48, 52, 90)}" opacity="0.8"/>`
    out += `<path d="${blob(6, 4, 96, 40, random, { bumps: 9, jitter: 0.2 })}" fill="${hsl(26, 62, 30)}"/>`
    out += steam(0, -80, random, { count: 3, height: 120, opacity: 0.14 })
  } else {
    out += `<path d="${blob(0, -2, 200, 72, random, { bumps: 12, jitter: 0.09 })}" fill="${hsl(48, 30, 88)}"/>`
    for (let i = 0; i < 26; i += 1) {
      const x = between(random, -186, 186)
      const y = between(random, -46, 40)
      const rot = between(random, -40, 40)
      const green = random() > 0.65
      out += `<rect x="${n(x)}" y="${n(y)}" width="${n(between(random, 30, 58))}" height="7" rx="3.5" fill="${green ? hsl(102, 40, 40) : hsl(46, 40, 76)}" transform="rotate(${n(rot)} ${n(x)} ${n(y)})"/>`
    }
    for (let i = 0; i < 6; i += 1) {
      const x = between(random, -160, 160)
      const y = between(random, -36, 30)
      out += `<rect x="${n(x)}" y="${n(y)}" width="${n(between(random, 26, 44))}" height="8" rx="4" fill="${hsl(24, 76, 52)}" transform="rotate(${n(between(random, -40, 40))} ${n(x)} ${n(y)})"/>`
    }
  }

  out += `<path d="M${n(-rx)} ${n(rimY)} h${n(2 * rx)} a${n(rx)} 22 0 0 1 ${n(-2 * rx)} 0 z" fill="${hsl(28, 12, 38)}"/>`
  return out
}

export function garlicBread(random) {
  let out = contactShadow(0, 168, 280, 46)
  out += board(0, 148, 280, random)

  for (let i = 0; i < 5; i += 1) {
    const x = -190 + i * 96
    const y = 70 - i * 6
    out += `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(between(random, -10, 10))})">`
    out += `<path d="M-52 40 q-14 -96 52 -96 q66 0 52 96 z" fill="${hsl(34, 58, 46)}"/>`
    out += `<path d="M-44 34 q-10 -80 44 -80 q54 0 44 80 z" fill="${hsl(42, 72, 76)}"/>`
    out += `<path d="M-44 -8 q44 -22 88 0 l0 -12 q-44 -20 -88 0 z" fill="${hsl(46, 84, 62)}"/>`
    out += speckle(0, -14, 34, 20, random, 5, hsl(104, 40, 34), 0.9)
    out += `</g>`
  }
  return out
}

/* ========================================================================== */
/* Desserts                                                                    */
/* ========================================================================== */

export function cakeSlice(random, { kind = 'chocolate' } = {}) {
  let out = contactShadow(0, 176, 250, 44)
  out += plate(0, 158, 260)

  if (kind === 'cheesecake') {
    out += `<path d="M-150 96 L150 96 L104 -78 L-104 -78 z" fill="${hsl(46, 62, 84)}"/>`
    out += `<path d="M-150 96 L150 96 L146 62 L-146 62 z" fill="${hsl(28, 50, 34)}"/>`
    out += `<path d="M-104 -78 L104 -78 L98 -100 L-98 -100 z" fill="${hsl(48, 70, 92)}"/>`
    out += `<path d="M-98 -100 q98 -34 196 0 l0 24 q-98 -32 -196 0 z" fill="${hsl(348, 68, 44)}"/>`
    for (let i = 0; i < 5; i += 1) {
      const x = between(random, -80, 80)
      out += `<circle cx="${n(x)}" cy="${n(between(random, -128, -104))}" r="${n(between(random, 16, 24))}" fill="${hsl(346, 72, 48)}"/>`
    }
    out += `<path d="M-150 96 L-104 -78 L-98 -100 L-146 62 z" fill="${hsla(0, 0, 0, 0.16)}"/>`
    return out
  }

  // Layered chocolate wedge.
  const layers = [
    [96, 40, hsl(26, 46, 22)],
    [40, -6, hsl(30, 34, 88)],
    [-6, -52, hsl(24, 48, 24)],
    [-52, -98, hsl(30, 34, 88)],
    [-98, -140, hsl(22, 52, 20)],
  ]
  layers.forEach(([bottomY, topY, fill], index) => {
    const bw = 150 - index * 10
    const tw = 150 - (index + 1) * 10
    out += `<path d="M${n(-bw)} ${n(bottomY)} L${n(bw)} ${n(bottomY)} L${n(tw)} ${n(topY)} L${n(-tw)} ${n(topY)} z" fill="${fill}"/>`
  })
  out += `<path d="M-100 -140 q26 -30 52 -6 q26 -28 50 -2 L100 -140 z" fill="${hsl(20, 56, 26)}"/>`
  out += `<circle cx="0" cy="-166" r="22" fill="${hsl(348, 74, 46)}"/>`
  out += `<path d="M-150 96 L-98 -140 L-90 -142 L-146 84 z" fill="${hsla(0, 0, 0, 0.18)}"/>`
  return out
}

export function sundae(random) {
  let out = contactShadow(0, 200, 190, 38)

  // Tall glass.
  out += `<path d="M-118 -60 L118 -60 L86 150 q-86 26 -172 0 z" fill="${hsla(200, 20, 90, 0.16)}"/>`
  out += `<path d="M-118 -60 L-84 -60 L-56 158 q-18 -3 -30 -8 z" fill="${hsla(0, 0, 100, 0.24)}"/>`
  out += `<rect x="-26" y="150" width="52" height="34" fill="${hsla(200, 20, 90, 0.18)}"/>`
  out += `<ellipse cx="0" cy="188" rx="86" ry="20" fill="${hsla(200, 20, 90, 0.22)}"/>`

  // Scoops and sauce.
  out += `<path d="M-110 -56 q34 92 110 92 q76 0 110 -92 z" fill="${hsl(30, 42, 78)}"/>`
  out += `<path d="M-110 -20 q28 30 62 6 q34 34 68 4 q30 26 62 -4 l-14 40 q-92 34 -180 0 z" fill="${hsl(22, 60, 28)}"/>`
  out += `<circle cx="-56" cy="-88" r="72" fill="${hsl(28, 44, 82)}"/>`
  out += `<circle cx="58" cy="-96" r="66" fill="${hsl(24, 52, 34)}"/>`
  out += `<circle cx="0" cy="-142" r="60" fill="${hsl(32, 40, 88)}"/>`
  out += `<path d="M-120 -140 q40 44 118 44 q78 0 118 -44 q-10 60 -118 60 q-108 0 -118 -60 z" fill="${hsl(20, 62, 26)}" opacity="0.75"/>`
  out += `<circle cx="6" cy="-196" r="26" fill="${hsl(348, 74, 46)}"/>`
  out += `<path d="M6 -220 q10 -34 34 -44" stroke="${hsl(104, 40, 34)}" stroke-width="8" fill="none" stroke-linecap="round"/>`
  return out
}

export function cookie(random) {
  let out = contactShadow(0, 148, 250, 44)
  out += plate(0, 132, 250)

  const one = (cx, cy, r, rot) => {
    let s = `<g transform="rotate(${n(rot)} ${n(cx)} ${n(cy)})">`
    s += `<path d="${blob(cx, cy + 8, r, r, random, { bumps: 12, jitter: 0.05 })}" fill="${hsl(28, 52, 32)}"/>`
    s += `<path d="${blob(cx, cy, r, r, random, { bumps: 12, jitter: 0.05 })}" fill="${hsl(32, 62, 52)}"/>`
    s += `<path d="${blob(cx, cy, r * 0.86, r * 0.86, random, { bumps: 11, jitter: 0.07 })}" fill="${hsl(34, 66, 58)}" opacity="0.7"/>`
    for (let i = 0; i < 9; i += 1) {
      const angle = random() * Math.PI * 2
      const radius = Math.sqrt(random()) * r * 0.78
      s += `<circle cx="${n(cx + Math.cos(angle) * radius)}" cy="${n(cy + Math.sin(angle) * radius)}" r="${n(between(random, 12, 19))}" fill="${hsl(22, 54, 20)}"/>`
    }
    return `${s}</g>`
  }

  out += one(-96, 74, 128, -8)
  out += one(96, 40, 136, 12)
  out += one(4, -66, 122, 4)
  return out
}

export function iceCream(random) {
  let out = contactShadow(0, 198, 160, 34)

  // Waffle cone.
  out += `<path d="M-104 -18 L104 -18 L0 210 z" fill="${hsl(32, 66, 50)}"/>`
  out += `<g stroke="${hsla(26, 60, 30, 0.5)}" stroke-width="5">`
  for (let i = -3; i <= 3; i += 1) {
    out += `<path d="M${n(i * 30)} -18 L${n(i * 12)} ${n(200 - Math.abs(i) * 30)}"/>`
    out += `<path d="M-104 ${n(-18 + (i + 3) * 34)} L104 ${n(-18 + (i + 3) * 34)}" opacity="0.4"/>`
  }
  out += `</g>`
  out += `<path d="M-104 -18 L-40 -18 L-6 200 z" fill="${hsla(0, 0, 100, 0.14)}"/>`

  out += `<circle cx="-52" cy="-64" r="82" fill="${hsl(30, 44, 84)}"/>`
  out += `<circle cx="54" cy="-72" r="78" fill="${hsl(20, 58, 44)}"/>`
  out += `<circle cx="0" cy="-136" r="74" fill="${hsl(342, 52, 76)}"/>`
  out += `<path d="M-124 -74 q46 40 124 40 q78 0 124 -40 q-14 44 -124 44 q-110 0 -124 -44 z" fill="${hsl(24, 62, 30)}" opacity="0.6"/>`
  return out
}

/* ========================================================================== */
/* Drinks                                                                      */
/* ========================================================================== */

export function drink(random, { kind = 'cup', hue = 200 } = {}) {
  let out = contactShadow(0, 208, 170, 34)

  if (kind === 'bottle') {
    out += `<path d="M-58 -110 L58 -110 L58 -160 q0 -20 -20 -20 L-38 -180 q-20 0 -20 20 z" fill="${hsla(196, 30, 92, 0.28)}"/>`
    out += `<rect x="-44" y="-206" width="88" height="34" rx="10" fill="${hsl(200, 60, 52)}"/>`
    out += `<path d="M-96 -112 q0 -34 38 -46 L58 -158 q38 12 38 46 L96 168 q0 26 -26 26 L-70 194 q-26 0 -26 -26 z" fill="${hsla(196, 40, 88, 0.3)}"/>`
    out += `<path d="M-96 -30 L96 -30 L96 96 L-96 96 z" fill="${hsl(200, 62, 50)}" opacity="0.9"/>`
    out += `<circle cx="0" cy="34" r="34" fill="${hsl(36, 18, 96)}" opacity="0.9"/>`
    out += `<path d="M-72 -100 q-10 40 -10 130 l0 140" stroke="${hsla(0, 0, 100, 0.35)}" stroke-width="14" fill="none" stroke-linecap="round"/>`
    return out
  }

  if (kind === 'glass') {
    out += `<path d="M-100 -110 L100 -110 L78 170 q-78 22 -156 0 z" fill="${hsla(200, 24, 92, 0.18)}"/>`
    out += `<path d="M-92 -58 L92 -58 L74 168 q-74 20 -148 0 z" fill="${hsl(hue, 82, 54)}"/>`
    out += `<ellipse cx="0" cy="-58" rx="92" ry="20" fill="${hsl(hue, 86, 64)}"/>`
    out += `<path d="M-100 -110 L-66 -110 L-46 176 q-18 -3 -30 -8 z" fill="${hsla(0, 0, 100, 0.26)}"/>`
    // Citrus wheel on the rim.
    out += `<g transform="translate(84 -112) rotate(18)"><circle r="52" fill="${hsl(hue === 200 ? 44 : hue, 92, 58)}"/><circle r="42" fill="${hsl(hue === 200 ? 46 : hue + 4, 96, 72)}"/><g stroke="${hsl(hue === 200 ? 44 : hue, 90, 54)}" stroke-width="5">`
    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * Math.PI * 2
      out += `<path d="M0 0 L${n(Math.cos(angle) * 42)} ${n(Math.sin(angle) * 42)}"/>`
    }
    out += `</g></g>`
    // Mint.
    out += `<ellipse cx="-46" cy="-96" rx="40" ry="22" fill="${hsl(112, 46, 38)}" transform="rotate(-24 -46 -96)"/>`
    return out
  }

  if (kind === 'coffee') {
    out += `<ellipse cx="0" cy="176" rx="176" ry="34" fill="${hsl(28, 10, 30)}"/>`
    out += `<ellipse cx="0" cy="166" rx="176" ry="34" fill="${hsl(28, 12, 40)}"/>`
    out += `<path d="M-116 -80 L116 -80 L94 140 q-94 22 -188 0 z" fill="${hsl(30, 14, 92)}"/>`
    out += `<path d="M116 -46 q76 0 76 60 q0 60 -76 60 l0 -28 q46 0 46 -32 q0 -32 -46 -32 z" fill="${hsl(30, 14, 92)}"/>`
    out += `<ellipse cx="0" cy="-80" rx="116" ry="26" fill="${hsl(30, 16, 84)}"/>`
    out += `<ellipse cx="0" cy="-80" rx="100" ry="21" fill="${hsl(26, 58, 26)}"/>`
    out += `<ellipse cx="0" cy="-82" rx="80" ry="15" fill="${hsl(30, 44, 44)}" opacity="0.7"/>`
    out += `<path d="M-116 -80 L-84 -80 L-64 148 q-18 -4 -30 -9 z" fill="${hsla(0, 0, 0, 0.07)}"/>`
    out += steam(0, -120, random, { count: 3, height: 130, opacity: 0.18 })
    return out
  }

  // Fountain cup with a lid and a straw.
  out += `<path d="M-116 -70 L116 -70 L88 176 q-88 24 -176 0 z" fill="${hsl(4, 70, 46)}"/>`
  out += `<path d="M-116 -70 L-78 -70 L-56 184 q-18 -3 -32 -8 z" fill="${hsla(0, 0, 100, 0.16)}"/>`
  out += `<path d="M-108 -14 L108 -14 L100 62 L-100 62 z" fill="${hsl(36, 18, 96)}" opacity="0.94"/>`
  out += `<circle cx="0" cy="24" r="30" fill="${hsl(18, 90, 52)}"/>`
  out += `<ellipse cx="0" cy="-70" rx="116" ry="26" fill="${hsl(2, 60, 36)}"/>`
  out += `<ellipse cx="0" cy="-76" rx="120" ry="26" fill="${hsl(6, 74, 54)}"/>`
  out += `<ellipse cx="0" cy="-76" rx="96" ry="19" fill="${hsl(4, 58, 32)}"/>`
  out += `<path d="M-14 -84 L44 -230" stroke="${hsl(36, 16, 92)}" stroke-width="26" stroke-linecap="round"/>`
  out += `<path d="M-14 -84 L44 -230" stroke="${hsl(6, 76, 54)}" stroke-width="10" stroke-linecap="round" opacity="0.7"/>`
  return out
}

/* ========================================================================== */
/* Meals and family boxes                                                      */
/* ========================================================================== */

export function mealTray(random, { main = 'burger' } = {}) {
  let out = contactShadow(0, 200, 330, 52)

  // Tray.
  out += `<path d="M-330 60 L330 60 L292 196 q-292 34 -584 0 z" fill="${hsl(28, 16, 26)}"/>`
  out += `<ellipse cx="0" cy="60" rx="330" ry="62" fill="${hsl(28, 18, 34)}"/>`
  out += `<ellipse cx="0" cy="56" rx="300" ry="54" fill="${hsl(28, 16, 28)}"/>`

  const mains = {
    burger: () => place(burger(random, {}), -108, -66, 0.52),
    chicken: () => place(friedChicken(random, { shape: 'strip', count: 3, dip: false }), -110, -50, 0.52),
    wings: () => place(friedChicken(random, { shape: 'wing', count: 3, dip: false }), -110, -50, 0.52),
    grilled: () => place(grilledChicken(random), -110, -50, 0.5),
    veggie: () => place(burger(random, { vegetarian: true }), -108, -66, 0.52),
  }

  out += (mains[main] ?? mains.burger)()
  out += place(fries(random, {}), 138, -40, 0.44)
  out += place(drink(random, { kind: 'cup' }), 262, -30, 0.36)
  return out
}

export function familyBox(random, { kind = 'bucket' } = {}) {
  let out = contactShadow(0, 208, 360, 54)

  if (kind === 'pizza') {
    // Two stacked pizza boxes with a pie on top.
    out += `<path d="M-300 130 L300 130 L300 196 L-300 196 z" fill="${hsl(30, 40, 40)}"/>`
    out += `<path d="M-300 130 L300 130 L280 108 L-280 108 z" fill="${hsl(32, 44, 52)}"/>`
    out += `<path d="M-300 64 L300 64 L300 122 L-300 122 z" fill="${hsl(30, 40, 44)}"/>`
    out += `<path d="M-300 64 L300 64 L280 42 L-280 42 z" fill="${hsl(32, 44, 56)}"/>`
    out += place(pizza(random, { topping: 'pepperoni', slicePulled: false }), 0, -108, 0.62)
    out += place(drink(random, { kind: 'cup' }), 292, 40, 0.34)
    return out
  }

  if (kind === 'burgerBox') {
    out += `<path d="M-320 40 L320 40 L286 200 q-286 32 -572 0 z" fill="${hsl(4, 66, 40)}"/>`
    out += `<ellipse cx="0" cy="40" rx="320" ry="58" fill="${hsl(6, 74, 50)}"/>`
    out += `<ellipse cx="0" cy="36" rx="292" ry="50" fill="${hsl(4, 56, 30)}"/>`
    out += place(burger(random, { double: true }), -150, -104, 0.46)
    out += place(burger(random, {}), 44, -84, 0.42)
    out += place(fries(random, {}), 228, -46, 0.4)
    return out
  }

  if (kind === 'grill') {
    out += board(0, 176, 340, random)
    out += place(grilledChicken(random), -130, -20, 0.56)
    out += place(friedChicken(random, { shape: 'wing', count: 3, dip: false }), 132, 10, 0.5)
    out += place(garlicBread(random), 0, 128, 0.34)
    return out
  }

  // Default: the feast bucket with sides around it.
  out += place(bucket(random, {}), -40, -34, 0.86)
  out += place(fries(random, {}), 236, 42, 0.44)
  out += place(bowl(random, { kind: 'coleslaw' }), -262, 68, 0.4)
  return out
}
