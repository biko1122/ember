/**
 * Vector artwork kit — the drawing primitives used by generate-artwork.mjs.
 *
 * -------------------------------------------------------------------------
 * PROTOTYPE ARTWORK, NOT FINAL PHOTOGRAPHY.
 * These renderers produce the illustrations that fill the site until the
 * restaurant's real photographs arrive. They are drawn in the EMBER palette so
 * the prototype looks art-directed rather than empty. See ASSETS.md for how to
 * swap a real photo in — it is a one-line change per image.
 * -------------------------------------------------------------------------
 */

/* -- Deterministic randomness ---------------------------------------------
   Every drawing is seeded from its own filename, so a given dish always looks
   identical between runs but no two dishes look the same.                    */
export function seeded(seed) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const n = (value) => Math.round(value * 100) / 100
export const between = (random, min, max) => min + random() * (max - min)
export const pick = (random, list) => list[Math.floor(random() * list.length) % list.length]

/* -- Colour ---------------------------------------------------------------- */
export const hsl = (h, s, l) => `hsl(${n(h)} ${n(s)}% ${n(l)}%)`
export const hsla = (h, s, l, a) => `hsl(${n(h)} ${n(s)}% ${n(l)}% / ${a})`

/* -- Shapes ---------------------------------------------------------------- */

/** A closed blob with a jittered radius — bread, chicken, scoops, potatoes. */
export function blob(cx, cy, rx, ry, random, { bumps = 9, jitter = 0.09 } = {}) {
  const points = []
  for (let i = 0; i < bumps; i += 1) {
    const angle = (i / bumps) * Math.PI * 2
    const wobble = 1 + between(random, -jitter, jitter)
    points.push([cx + Math.cos(angle) * rx * wobble, cy + Math.sin(angle) * ry * wobble])
  }

  // Catmull-Rom through the points, converted to cubic beziers, so the outline
  // stays organic instead of polygonal.
  let d = `M${n(points[0][0])} ${n(points[0][1])}`
  for (let i = 0; i < points.length; i += 1) {
    const p0 = points[(i - 1 + points.length) % points.length]
    const p1 = points[i]
    const p2 = points[(i + 1) % points.length]
    const p3 = points[(i + 2) % points.length]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += `C${n(c1x)} ${n(c1y)} ${n(c2x)} ${n(c2y)} ${n(p2[0])} ${n(p2[1])}`
  }
  return `${d}Z`
}

/** The ruffled edge of a lettuce leaf. Drawn as a strip with a wavy underside. */
export function ruffle(x, y, width, height, random, waves = 7) {
  let d = `M${n(x)} ${n(y)}`
  const step = width / waves
  for (let i = 0; i < waves; i += 1) {
    const dip = height * between(random, 0.55, 1.15)
    d += `q${n(step / 2)} ${n(dip)} ${n(step)} 0`
  }
  d += `L${n(x + width)} ${n(y - height * 0.9)}L${n(x)} ${n(y - height * 0.9)}Z`
  return d
}

/** Crispy speckle — the little highlights that read as "fried". */
export function speckle(cx, cy, rx, ry, random, count, colour, opacity = 0.5) {
  let out = ''
  for (let i = 0; i < count; i += 1) {
    const angle = random() * Math.PI * 2
    const radius = Math.sqrt(random())
    const x = cx + Math.cos(angle) * rx * radius * 0.82
    const y = cy + Math.sin(angle) * ry * radius * 0.82
    out += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(between(random, 2.5, 6.5))}" fill="${colour}" opacity="${n(between(random, opacity * 0.4, opacity))}"/>`
  }
  return out
}

/** Sesame seeds scattered over the crown of a bun. */
export function sesame(cx, cy, rx, ry, random, count = 11) {
  let out = ''
  for (let i = 0; i < count; i += 1) {
    const angle = Math.PI + random() * Math.PI
    const radius = between(random, 0.25, 0.86)
    const x = cx + Math.cos(angle) * rx * radius
    const y = cy + Math.sin(angle) * ry * radius * 0.9
    const rot = between(random, -35, 35)
    out += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(between(random, 6, 9))}" ry="${n(between(random, 3.4, 4.6))}" fill="#f7e2b4" opacity="0.85" transform="rotate(${n(rot)} ${n(x)} ${n(y)})"/>`
  }
  return out
}

/** Curls of steam. Used on anything served hot. */
export function steam(cx, cy, random, { count = 3, height = 150, opacity = 0.16 } = {}) {
  let out = `<g fill="none" stroke="#ffffff" stroke-linecap="round" opacity="${opacity}">`
  for (let i = 0; i < count; i += 1) {
    const x = cx + (i - (count - 1) / 2) * between(random, 46, 62)
    const h = height * between(random, 0.7, 1.15)
    const sway = between(random, 22, 38) * (random() > 0.5 ? 1 : -1)
    out += `<path d="M${n(x)} ${n(cy)}c${n(sway)} ${n(-h * 0.3)} ${n(-sway)} ${n(-h * 0.55)} 0 ${n(-h)}" stroke-width="${n(between(random, 7, 11))}"/>`
  }
  return `${out}</g>`
}

/** The soft dark ellipse a dish sits on, so it does not float. */
export function contactShadow(cx, cy, rx, ry = rx * 0.2) {
  return `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="url(#dishShadow)"/>`
}

/** A round plate under the food. */
export function plate(cx, cy, rx, hue = 28) {
  return (
    `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(rx * 0.3)}" fill="${hsl(hue, 12, 20)}"/>` +
    `<ellipse cx="${n(cx)}" cy="${n(cy - rx * 0.03)}" rx="${n(rx * 0.94)}" ry="${n(rx * 0.28)}" fill="${hsl(hue, 14, 31)}"/>` +
    `<ellipse cx="${n(cx)}" cy="${n(cy - rx * 0.04)}" rx="${n(rx * 0.7)}" ry="${n(rx * 0.19)}" fill="${hsl(hue, 14, 24)}" opacity="0.75"/>`
  )
}

/** A wooden serving board — used where a plate would feel too formal. */
export function board(cx, cy, rx, random) {
  let grain = ''
  for (let i = 0; i < 5; i += 1) {
    const offset = between(random, -rx * 0.6, rx * 0.6)
    grain += `<ellipse cx="${n(cx + offset)}" cy="${n(cy)}" rx="${n(between(random, rx * 0.2, rx * 0.55))}" ry="${n(rx * 0.24)}" fill="none" stroke="${hsla(26, 40, 20, 0.4)}" stroke-width="3"/>`
  }
  return (
    `<ellipse cx="${n(cx)}" cy="${n(cy + rx * 0.05)}" rx="${n(rx)}" ry="${n(rx * 0.32)}" fill="${hsl(24, 34, 15)}"/>` +
    `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(rx * 0.32)}" fill="${hsl(26, 38, 26)}"/>${grain}`
  )
}

/**
 * The shared canvas every image is drawn on: warm gradient ground, a lit pool
 * behind the subject, and a vignette to hold the edges down. Ids inside are
 * fixed because each file is a standalone document loaded through <img>.
 */
export function frame(width, height, seed, inner, { hue = 22, glow = 0.34 } = {}) {
  const random = seeded(`${seed}-frame`)
  const baseHue = hue + between(random, -7, 7)
  const cx = width / 2
  const cy = height * 0.5

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
<defs>
<radialGradient id="ground" cx="50%" cy="32%" r="84%">
<stop offset="0%" stop-color="${hsl(baseHue, 33, 17)}"/>
<stop offset="58%" stop-color="${hsl(baseHue, 26, 10)}"/>
<stop offset="100%" stop-color="${hsl(baseHue, 22, 6)}"/>
</radialGradient>
<radialGradient id="keyLight" cx="50%" cy="44%" r="50%">
<stop offset="0%" stop-color="${hsla(26, 96, 58, glow)}"/>
<stop offset="55%" stop-color="${hsla(20, 92, 46, glow * 0.34)}"/>
<stop offset="100%" stop-color="${hsla(20, 90, 40, 0)}"/>
</radialGradient>
<radialGradient id="dishShadow" cx="50%" cy="50%" r="50%">
<stop offset="0%" stop-color="${hsla(baseHue, 60, 3, 0.6)}"/>
<stop offset="100%" stop-color="${hsla(baseHue, 60, 3, 0)}"/>
</radialGradient>
<radialGradient id="vignette" cx="50%" cy="46%" r="72%">
<stop offset="52%" stop-color="${hsla(baseHue, 40, 4, 0)}"/>
<stop offset="100%" stop-color="${hsla(baseHue, 40, 4, 0.62)}"/>
</radialGradient>
<linearGradient id="topSheen" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="${hsla(38, 100, 72, 0.11)}"/>
<stop offset="45%" stop-color="${hsla(38, 100, 72, 0)}"/>
</linearGradient>
</defs>
<rect width="${width}" height="${height}" fill="url(#ground)"/>
<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(width * 0.46)}" ry="${n(height * 0.44)}" fill="url(#keyLight)"/>
${inner}
<rect width="${width}" height="${height}" fill="url(#topSheen)"/>
<rect width="${width}" height="${height}" fill="url(#vignette)"/>
</svg>
`
}
