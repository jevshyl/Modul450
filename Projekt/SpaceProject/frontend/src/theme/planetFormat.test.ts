import { describe, expect, it } from 'vitest'
import {
  PLANET_PALETTES,
  describeUnknown,
  formatGravity,
  formatMass,
  formatTemp,
  formatVolume,
  paletteFor,
} from './planetFormat'

describe('planetFormat', () => {
  describe('formatGravity', () => {
    it('formats a finite gravity value with two decimals', () => {
      expect(formatGravity(3.71)).toBe('3.71 m/s²')
    })

    it('renders an em dash for non-finite values', () => {
      expect(formatGravity(Number.NaN)).toBe('—')
      expect(formatGravity(Number.POSITIVE_INFINITY)).toBe('—')
    })
  })

  describe('formatTemp', () => {
    it('formats Celsius with one decimal', () => {
      expect(formatTemp(0)).toBe('0.0 °C')
      expect(formatTemp(-63.4)).toBe('-63.4 °C')
    })

    it('renders an em dash for non-finite values', () => {
      expect(formatTemp(Number.NaN)).toBe('—')
    })
  })

  describe('formatMass', () => {
    it('scales a mass to kilotonnes', () => {
      expect(formatMass(1000)).toBe('1 kt')
    })

    it('renders an em dash for zero, negative or non-finite mass', () => {
      expect(formatMass(0)).toBe('—')
      expect(formatMass(-5)).toBe('—')
      expect(formatMass(Number.NaN)).toBe('—')
    })
  })

  describe('formatVolume', () => {
    it('appends the cubic-kilometre unit', () => {
      expect(formatVolume(1000)).toBe('1 bn km³')
    })

    it('renders an em dash for invalid volume', () => {
      expect(formatVolume(0)).toBe('—')
      expect(formatVolume(Number.NaN)).toBe('—')
    })
  })

  describe('describeUnknown', () => {
    it('returns the value when present', () => {
      expect(describeUnknown('Deep Field Survey')).toBe('Deep Field Survey')
    })

    it('falls back for empty, blank, null and undefined', () => {
      expect(describeUnknown('')).toBe('Unknown')
      expect(describeUnknown('   ')).toBe('Unknown')
      expect(describeUnknown(null)).toBe('Unknown')
      expect(describeUnknown(undefined)).toBe('Unknown')
    })

    it('honours a custom fallback', () => {
      expect(describeUnknown(null, '—')).toBe('—')
    })
  })

  describe('paletteFor', () => {
    it('returns the palette for a known body', () => {
      expect(paletteFor('mars')).toEqual(PLANET_PALETTES.mars)
    })

    it('is case-insensitive', () => {
      expect(paletteFor('MARS')).toEqual(PLANET_PALETTES.mars)
    })

    it('falls back for an unknown body', () => {
      expect(paletteFor('krypton')).toEqual({ deep: '#2a2f4a', mid: '#6ee7ff', light: '#e8ecff' })
    })
  })
})
