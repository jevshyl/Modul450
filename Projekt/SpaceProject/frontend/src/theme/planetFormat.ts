export interface PlanetPalette {
  deep: string
  mid: string
  light: string
  ring?: string
}

export const PLANET_PALETTES: Record<string, PlanetPalette> = {
  mars: { deep: '#5c1a0a', mid: '#c1440e', light: '#ff9a5c' },
  venus: { deep: '#6b4a1a', mid: '#d99a3c', light: '#ffe0a3' },
  moon: { deep: '#3a3f52', mid: '#9aa3b8', light: '#f2f5ff' },
  jupiter: { deep: '#6b4423', mid: '#d8a878', light: '#f6ddc0', ring: 'rgba(214, 196, 168, 0.35)' },
  saturn: { deep: '#8a6d2f', mid: '#e3c982', light: '#fff3cf', ring: 'rgba(240, 220, 160, 0.55)' },
  neptune: { deep: '#12306e', mid: '#2f6fd0', light: '#9fd0ff' },
  uranus: { deep: '#0f4f52', mid: '#48b6b8', light: '#c2f5f4' },
}

const FALLBACK: PlanetPalette = { deep: '#2a2f4a', mid: '#6ee7ff', light: '#e8ecff' }

export function paletteFor(planetId: string): PlanetPalette {
  return PLANET_PALETTES[planetId?.toLowerCase()] ?? FALLBACK
}

export function formatMass(kg: number): string {
  if (!Number.isFinite(kg) || kg <= 0) return '—'
  const exponent = Math.floor(Math.log10(kg))
  const mantissa = kg / Math.pow(10, exponent)
  const prefix = exponent >= 24 ? 'Yg' : exponent >= 21 ? 'Zg' : exponent >= 18 ? 'Eg' : exponent >= 15 ? 'Pg' : exponent >= 12 ? 'Tg' : exponent >= 9 ? 'Gt' : exponent >= 6 ? 'Mt' : exponent >= 3 ? 'kt' : ''
  const scaled = exponent >= 3 ? mantissa * Math.pow(10, exponent - 3) : kg
  return `${scaled.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${prefix}`.trim()
}

export function formatVolume(km3: number): string {
  if (!Number.isFinite(km3) || km3 <= 0) return '—'
  const exponent = Math.floor(Math.log10(km3))
  const mantissa = km3 / Math.pow(10, exponent)
  const scaled = exponent >= 3 ? mantissa * Math.pow(10, exponent - 3) : km3
  return `${scaled.toLocaleString(undefined, { maximumFractionDigits: 2 })} bn km³`
}

export function formatGravity(g: number): string {
  if (!Number.isFinite(g)) return '—'
  return `${g.toFixed(2)} m/s²`
}

export function formatTemp(celsius: number): string {
  if (!Number.isFinite(celsius)) return '—'
  return `${celsius.toFixed(1)} °C`
}

export function describeUnknown(value: string | null | undefined, fallback = 'Unknown'): string {
  if (!value || value.trim().length === 0) return fallback
  return value
}