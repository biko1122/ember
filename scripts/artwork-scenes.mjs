/**
 * Room and banner artwork — the restaurant itself rather than the food.
 *
 * These are drawn in absolute canvas coordinates because a room has to know
 * where its floor is, unlike a dish which is placed by its caller.
 */

import { n, hsl, hsla, between, seeded, blob, steam } from './artwork-kit.mjs'

/** A seated or standing figure, kept as a soft silhouette. */
function figure(x, y, scale, tone, random) {
  const s = scale
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(s)})" fill="${tone}">
<circle cx="0" cy="${n(-96 + between(random, -6, 6))}" r="34"/>
<path d="M-46 0 q0 -58 46 -58 q46 0 46 58 z"/>
</g>`
}

/** A hanging pendant lamp with its pool of light. */
function pendant(x, ceilingY, dropLength, random) {
  const y = ceilingY + dropLength
  return `<g>
<path d="M${n(x)} ${n(ceilingY)} L${n(x)} ${n(y - 26)}" stroke="${hsla(30, 30, 60, 0.5)}" stroke-width="3"/>
<path d="M${n(x - 42)} ${n(y)} q${42} ${-52} ${84} 0 z" fill="${hsl(20, 44, 24)}"/>
<ellipse cx="${n(x)}" cy="${n(y)}" rx="42" ry="9" fill="${hsl(42, 96, 72)}"/>
<path d="M${n(x - 150)} ${n(y + 340)} L${n(x - 42)} ${n(y)} L${n(x + 42)} ${n(y)} L${n(x + 150)} ${n(y + 340)} z" fill="${hsla(38, 96, 62, between(random, 0.07, 0.13))}"/>
</g>`
}

/**
 * The shared room: back wall, floor, pendants, and whatever the variant adds
 * in front of them.
 */
export function room(random, width, height, variant) {
  const floorY = height * 0.68
  const wallHue = 24
  let out = ''

  // Back wall and floor planes.
  out += `<rect width="${width}" height="${n(floorY)}" fill="${hsl(wallHue, 26, 13)}"/>`
  out += `<rect y="${n(floorY)}" width="${width}" height="${n(height - floorY)}" fill="${hsl(wallHue, 22, 9)}"/>`
  out += `<rect y="${n(floorY - 6)}" width="${width}" height="12" fill="${hsla(34, 60, 50, 0.22)}"/>`

  // Wall panelling — vertical battens, a common warm-restaurant detail.
  out += `<g fill="${hsla(30, 40, 40, 0.16)}">`
  for (let x = 0; x < width; x += 46) {
    out += `<rect x="${n(x)}" y="${n(floorY * 0.12)}" width="14" height="${n(floorY * 0.88)}"/>`
  }
  out += `</g>`

  // Floor reflection of the wall, so the room has depth.
  out += `<rect y="${n(floorY)}" width="${width}" height="${n((height - floorY) * 0.5)}" fill="${hsla(34, 70, 50, 0.06)}"/>`

  const pendants = Math.max(2, Math.round(width / 320))
  for (let i = 0; i < pendants; i += 1) {
    const x = ((i + 0.5) / pendants) * width
    out += pendant(x, 0, between(random, height * 0.16, height * 0.26), random)
  }

  if (variant === 'kitchen' || variant === 'grill') {
    // A pass with a grill behind it, extractor hood above.
    const passY = floorY - height * 0.06
    out += `<rect x="${n(width * 0.06)}" y="${n(passY - height * 0.3)}" width="${n(width * 0.88)}" height="${n(height * 0.3)}" rx="10" fill="${hsl(26, 12, 18)}"/>`
    out += `<rect x="${n(width * 0.06)}" y="${n(passY - height * 0.3)}" width="${n(width * 0.88)}" height="${n(height * 0.05)}" rx="8" fill="${hsl(28, 14, 28)}"/>`

    // Flames along the grill bed.
    const bedY = passY - height * 0.07
    out += `<rect x="${n(width * 0.12)}" y="${n(bedY)}" width="${n(width * 0.76)}" height="${n(height * 0.05)}" rx="6" fill="${hsl(18, 30, 12)}"/>`
    for (let i = 0; i < 14; i += 1) {
      const x = width * 0.14 + (i / 13) * width * 0.72
      const h = between(random, height * 0.03, height * 0.09)
      out += `<path d="M${n(x)} ${n(bedY)} q${n(between(random, -14, 14))} ${n(-h * 0.6)} 0 ${n(-h)} q${n(between(random, -12, 12))} ${n(h * 0.5)} 0 ${n(h)} z" fill="${hsl(between(random, 16, 40), 96, between(random, 52, 66))}" opacity="${n(between(random, 0.5, 0.95))}"/>`
    }
    out += `<ellipse cx="${n(width * 0.5)}" cy="${n(bedY)}" rx="${n(width * 0.42)}" ry="${n(height * 0.12)}" fill="${hsla(24, 100, 56, 0.22)}"/>`

    // Extractor hood.
    out += `<path d="M${n(width * 0.04)} ${n(height * 0.12)} L${n(width * 0.96)} ${n(height * 0.12)} L${n(width * 0.88)} ${n(height * 0.26)} L${n(width * 0.12)} ${n(height * 0.26)} z" fill="${hsl(28, 10, 22)}"/>`
    out += steam(width * 0.5, bedY - height * 0.12, random, { count: 4, height: height * 0.22, opacity: 0.12 })

    const cooks = variant === 'grill' ? 1 : 2
    for (let i = 0; i < cooks; i += 1) {
      const x = width * (cooks === 1 ? 0.5 : 0.34 + i * 0.32)
      out += figure(x, passY - height * 0.28, (height / 750) * 1.1, hsla(20, 30, 6, 0.86), random)
    }
    return out
  }

  if (variant === 'counter') {
    const counterY = floorY + (height - floorY) * 0.12
    // Menu boards behind the pass.
    for (let i = 0; i < 3; i += 1) {
      out += `<rect x="${n(width * (0.14 + i * 0.25))}" y="${n(height * 0.14)}" width="${n(width * 0.2)}" height="${n(height * 0.16)}" rx="8" fill="${hsl(24, 18, 10)}"/>`
      out += `<g fill="${hsla(36, 60, 70, 0.3)}">`
      for (let line = 0; line < 4; line += 1) {
        out += `<rect x="${n(width * (0.155 + i * 0.25))}" y="${n(height * (0.16 + line * 0.03))}" width="${n(width * between(random, 0.08, 0.17))}" height="${n(height * 0.012)}" rx="4"/>`
      }
      out += `</g>`
    }
    out += figure(width * 0.68, counterY - height * 0.02, (height / 750) * 1.15, hsla(20, 30, 6, 0.8), random)
    // The counter itself.
    out += `<rect x="0" y="${n(counterY)}" width="${width}" height="${n(height - counterY)}" fill="${hsl(24, 34, 20)}"/>`
    out += `<rect x="0" y="${n(counterY)}" width="${width}" height="${n(height * 0.018)}" fill="${hsl(30, 44, 34)}"/>`
    out += `<rect x="${n(width * 0.08)}" y="${n(counterY - height * 0.05)}" width="${n(width * 0.16)}" height="${n(height * 0.05)}" rx="6" fill="${hsl(26, 14, 14)}"/>`
    return out
  }

  if (variant === 'bakery') {
    // A prep bench with trays of buns.
    const benchY = floorY + (height - floorY) * 0.2
    out += `<rect x="0" y="${n(benchY)}" width="${width}" height="${n(height - benchY)}" fill="${hsl(26, 30, 19)}"/>`
    out += `<rect x="0" y="${n(benchY)}" width="${width}" height="${n(height * 0.02)}" fill="${hsl(32, 40, 32)}"/>`
    for (let tray = 0; tray < 3; tray += 1) {
      const ty = benchY - height * (0.06 + tray * 0.075)
      const tw = width * 0.7
      out += `<rect x="${n(width * 0.15)}" y="${n(ty)}" width="${n(tw)}" height="${n(height * 0.022)}" rx="5" fill="${hsl(28, 8, 30)}"/>`
      for (let i = 0; i < 7; i += 1) {
        const bx = width * 0.17 + (i / 6) * (tw - width * 0.04)
        out += `<ellipse cx="${n(bx)}" cy="${n(ty - height * 0.016)}" rx="${n(width * 0.036)}" ry="${n(height * 0.022)}" fill="${hsl(32, 66, between(random, 46, 58))}"/>`
        out += `<ellipse cx="${n(bx - width * 0.008)}" cy="${n(ty - height * 0.024)}" rx="${n(width * 0.02)}" ry="${n(height * 0.009)}" fill="${hsla(42, 92, 76, 0.45)}"/>`
      }
    }
    out += figure(width * 0.82, benchY - height * 0.02, (height / 750) * 1.05, hsla(20, 30, 6, 0.7), random)
    return out
  }

  if (variant === 'team') {
    // A line-up in front of the pass.
    const count = 5
    for (let i = 0; i < count; i += 1) {
      const x = width * (0.16 + (i / (count - 1)) * 0.68)
      const y = floorY + height * 0.16 + (i % 2) * height * 0.02
      out += figure(x, y, (height / 800) * 1.5, hsla(20, 34, 7, 0.9), random)
      // Aprons catch the light.
      out += `<path d="M${n(x - 34)} ${n(y - 46)} q34 -14 68 0 l0 46 l-68 0 z" fill="${hsla(28, 40, 34, 0.55)}"/>`
    }
    return out
  }

  if (variant === 'storefront') {
    // Exterior: awning, sign band, glazing, pavement.
    out += `<rect width="${width}" height="${n(height * 0.46)}" fill="${hsl(26, 24, 11)}"/>`
    out += `<rect y="${n(height * 0.46)}" width="${width}" height="${n(height * 0.24)}" fill="${hsl(24, 20, 8)}"/>`
    // Glazing.
    out += `<rect x="${n(width * 0.06)}" y="${n(height * 0.3)}" width="${n(width * 0.88)}" height="${n(height * 0.38)}" fill="${hsla(38, 80, 56, 0.14)}"/>`
    for (let i = 1; i < 4; i += 1) {
      out += `<rect x="${n(width * (0.06 + i * 0.22))}" y="${n(height * 0.3)}" width="6" height="${n(height * 0.38)}" fill="${hsl(24, 18, 14)}"/>`
    }
    for (let i = 0; i < 3; i += 1) {
      out += figure(width * (0.2 + i * 0.28), height * 0.66, (height / 750) * 0.9, hsla(20, 30, 6, 0.55), random)
    }
    // Sign band.
    out += `<rect x="${n(width * 0.04)}" y="${n(height * 0.14)}" width="${n(width * 0.92)}" height="${n(height * 0.14)}" rx="10" fill="${hsl(18, 88, 50)}"/>`
    out += `<rect x="${n(width * 0.04)}" y="${n(height * 0.14)}" width="${n(width * 0.92)}" height="${n(height * 0.05)}" rx="10" fill="${hsla(0, 0, 100, 0.16)}"/>`
    // Awning stripes.
    const awnY = height * 0.28
    for (let i = 0; i < 9; i += 1) {
      const sx = width * 0.04 + (i / 9) * width * 0.92
      out += `<path d="M${n(sx)} ${n(awnY)} l${n((width * 0.92) / 9)} 0 l${n(-(width * 0.92) / 18)} ${n(height * 0.06)} z" fill="${i % 2 ? hsl(36, 20, 92) : hsl(6, 70, 46)}"/>`
    }
    // Pavement.
    out += `<rect y="${n(height * 0.7)}" width="${width}" height="${n(height * 0.3)}" fill="${hsl(26, 12, 12)}"/>`
    out += `<rect y="${n(height * 0.7)}" width="${width}" height="${n(height * 0.012)}" fill="${hsla(38, 60, 60, 0.2)}"/>`
    out += `<ellipse cx="${n(width * 0.5)}" cy="${n(height * 0.74)}" rx="${n(width * 0.44)}" ry="${n(height * 0.06)}" fill="${hsla(30, 90, 55, 0.12)}"/>`
    return out
  }

  // Default: the dining room.
  const tables = Math.max(2, Math.round(width / 420))
  for (let i = 0; i < tables; i += 1) {
    const x = ((i + 0.5) / tables) * width + between(random, -20, 20)
    const y = floorY + (height - floorY) * between(random, 0.24, 0.6)
    const scale = (y - floorY) / (height - floorY) + 0.5

    out += figure(x - 96 * scale, y - 26 * scale, scale * (height / 750) * 1.1, hsla(20, 30, 6, 0.72), random)
    out += figure(x + 96 * scale, y - 26 * scale, scale * (height / 750) * 1.05, hsla(20, 30, 6, 0.62), random)

    out += `<ellipse cx="${n(x)}" cy="${n(y + 8)}" rx="${n(112 * scale)}" ry="${n(24 * scale)}" fill="${hsla(20, 40, 4, 0.5)}"/>`
    out += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(112 * scale)}" ry="${n(26 * scale)}" fill="${hsl(26, 38, 26)}"/>`
    out += `<rect x="${n(x - 10 * scale)}" y="${n(y)}" width="${n(20 * scale)}" height="${n(70 * scale)}" fill="${hsl(24, 30, 18)}"/>`
    // A candle on each table.
    out += `<rect x="${n(x + 52 * scale)}" y="${n(y - 30 * scale)}" width="${n(14 * scale)}" height="${n(30 * scale)}" rx="4" fill="${hsl(38, 40, 70)}"/>`
    out += `<circle cx="${n(x + 59 * scale)}" cy="${n(y - 36 * scale)}" r="${n(9 * scale)}" fill="${hsl(40, 100, 70)}"/>`
    out += `<circle cx="${n(x + 59 * scale)}" cy="${n(y - 36 * scale)}" r="${n(28 * scale)}" fill="${hsla(38, 100, 60, 0.18)}"/>`
  }

  return out
}

/**
 * Offer banners. Bold flat graphics rather than rooms — the badge sits in the
 * top-left corner, so that area is deliberately kept quiet.
 */
export function offerBanner(random, width, height, { accent = 18, art = null } = {}) {
  let out = ''

  // Diagonal brand field across the right two-thirds.
  out += `<path d="M${n(width * 0.24)} 0 L${width} 0 L${width} ${height} L${n(width * 0.04)} ${height} z" fill="${hsl(accent, 84, 46)}" opacity="0.9"/>`
  out += `<path d="M${n(width * 0.42)} 0 L${width} 0 L${width} ${height} L${n(width * 0.22)} ${height} z" fill="${hsl(accent + 12, 92, 54)}" opacity="0.75"/>`

  // Concentric rings — a quiet echo of a plate.
  out += `<g fill="none" stroke="${hsla(44, 100, 80, 0.22)}" stroke-width="3">`
  for (let i = 0; i < 5; i += 1) {
    out += `<circle cx="${n(width * 0.74)}" cy="${n(height * 0.5)}" r="${n(height * (0.2 + i * 0.11))}"/>`
  }
  out += `</g>`

  // Scattered brand sparks in the quiet left third.
  for (let i = 0; i < 14; i += 1) {
    const x = between(random, width * 0.02, width * 0.34)
    const y = between(random, height * 0.05, height * 0.95)
    out += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(between(random, 2, 6))}" fill="${hsla(40, 100, 72, between(random, 0.15, 0.5))}"/>`
  }

  if (art) out += art

  // Bottom shading so overlaid copy stays readable.
  out += `<rect y="${n(height * 0.55)}" width="${width}" height="${n(height * 0.45)}" fill="url(#offerScrim)"/>`
  return `<defs><linearGradient id="offerScrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${hsla(20, 60, 5, 0)}"/><stop offset="100%" stop-color="${hsla(20, 60, 5, 0.72)}"/></linearGradient></defs>${out}`
}
