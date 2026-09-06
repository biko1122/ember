/**
 * Writes public/assets/logo/logo-mark.png — the 512 x 512 app icon that
 * index.html links as the Apple touch icon (the one used when someone adds the
 * site to their home screen).
 *
 *   node scripts/generate-app-icon.mjs
 *
 * PNG is encoded by hand because it is the one format that has to be a raster
 * and the project has no image dependencies. Everything else on the site is
 * SVG — see generate-artwork.mjs.
 */

import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SIZE = 512
const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'assets',
  'logo',
  'logo-mark.png',
)

/* -- The mark -------------------------------------------------------------- */

const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (value) => Math.min(1, Math.max(0, value))

/**
 * A flame silhouette in normalised coordinates: x across [-1, 1], y up.
 * A round bulb at the bottom tapering to a point at the top, leaning slightly
 * so it reads as fire rather than a raindrop.
 */
function flameCoverage(x, y, scale) {
  const bulbCentre = -0.3
  const bulbRadius = 0.52 * scale
  const tipY = 0.86 * scale

  // Lean, strongest around the middle of the flame.
  const t = clamp01((y - bulbCentre) / (tipY - bulbCentre))
  const lean = 0.13 * Math.sin(t * Math.PI) * scale
  const dx = x - lean

  if (y <= bulbCentre) {
    return dx * dx + (y - bulbCentre) * (y - bulbCentre) <= bulbRadius * bulbRadius
  }

  // Above the bulb the width falls away to nothing at the tip.
  const halfWidth = bulbRadius * Math.sqrt(Math.max(0, 1 - t)) * (1 - 0.25 * t)
  return y <= tipY && Math.abs(dx) <= halfWidth
}

function pixel(px, py) {
  // Normalised, y pointing up, centred.
  const x = (px / (SIZE - 1)) * 2 - 1
  const y = 1 - (py / (SIZE - 1)) * 2

  // Rounded-square background with the brand gradient.
  const corner = 0.42
  const ax = Math.max(0, Math.abs(x) - (1 - corner))
  const ay = Math.max(0, Math.abs(y) - (1 - corner))
  const outside = Math.sqrt(ax * ax + ay * ay) > corner

  if (outside) return [0, 0, 0, 0]

  // Warm gradient, lighter at the top-left.
  const shade = clamp01((x * -0.35 + y * 0.65 + 1) / 2)
  const background = [
    Math.round(lerp(196, 255, shade)),
    Math.round(lerp(52, 132, shade)),
    Math.round(lerp(16, 66, shade)),
  ]

  if (flameCoverage(x, y, 0.62)) {
    // Inner flame: the near-black the brand uses for text on orange.
    if (flameCoverage(x, y + 0.06, 0.36)) return [255, 206, 140, 255]
    return [26, 16, 8, 255]
  }

  return [...background, 255]
}

/* -- PNG encoding ---------------------------------------------------------- */

const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let c = index
  for (let bit = 0; bit < 8; bit += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  return c >>> 0
})

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)

  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data])

  const checksum = Buffer.alloc(4)
  checksum.writeUInt32BE(crc32(typeAndData))

  return Buffer.concat([length, typeAndData, checksum])
}

// Raw scanlines, each prefixed with filter byte 0 (none).
const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1))
let offset = 0
for (let py = 0; py < SIZE; py += 1) {
  raw[offset] = 0
  offset += 1
  for (let px = 0; px < SIZE; px += 1) {
    const [r, g, b, a] = pixel(px, py)
    raw[offset] = r
    raw[offset + 1] = g
    raw[offset + 2] = b
    raw[offset + 3] = a
    offset += 4
  }
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(SIZE, 0)
ihdr.writeUInt32BE(SIZE, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // colour type: RGBA
ihdr[10] = 0 // deflate
ihdr[11] = 0 // adaptive filtering
ihdr[12] = 0 // no interlace

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, png)
console.log(`Wrote ${OUT} (${SIZE}x${SIZE}, ${(png.length / 1024).toFixed(1)} KB)`)
