import { describe, expect, it } from 'vitest'
import { SYSTEMS, conversionPairs, convertInTable, pairToUnits, systemBySlug } from '@/lib/sizes'

describe('size systems integrity', () => {
  it('has all six systems', () => {
    expect(SYSTEMS.map((s) => s.slug)).toEqual([
      'mens-shoe', 'womens-shoe', 'kids-shoe', 'dress', 'mens-pants', 'ring',
    ])
  })

  it('every row covers every declared unit', () => {
    for (const s of SYSTEMS) {
      for (const row of s.rows) {
        for (const u of s.units) {
          expect(row[u], `${s.slug} missing ${u}`).toBeTruthy()
        }
      }
    }
  })

  it('shoe systems are monotonic in foot length (cm)', () => {
    for (const slug of ['mens-shoe', 'womens-shoe', 'kids-shoe']) {
      const s = systemBySlug(slug)!
      const cms = s.rows.map((r) => Number(r.cm))
      for (let i = 1; i < cms.length; i += 1) {
        expect(cms[i], `${slug} cm not monotonic at row ${i}`).toBeGreaterThan(cms[i - 1])
      }
    }
  })

  it('mens pants EU = US inches × 2.54 (rounded)', () => {
    const s = systemBySlug('mens-pants')!
    for (const row of s.rows) {
      expect(Number(row.EU)).toBe(Math.round(Number(row.US) * 2.54))
    }
  })

  it('ring diameter = circumference ÷ π', () => {
    const s = systemBySlug('ring')!
    for (const row of s.rows) {
      expect(Number(row.diameter)).toBeCloseTo(Number(row.mm) / Math.PI, 1)
    }
  })
})

describe('conversion consistency (one table, all directions)', () => {
  it('US men 9 → EU is 42 and EU 42 → US is 9 (round-trip on the same table)', () => {
    const s = systemBySlug('mens-shoe')!
    expect(convertInTable(s, 'EU', 'US', '9')).toBe('42')
    expect(convertInTable(s, 'US', 'EU', '42')).toBe('9')
  })

  it('every generated direction resolves to real table columns', () => {
    for (const s of SYSTEMS) {
      for (const p of conversionPairs(s)) {
        const [from, to] = pairToUnits(p)!
        expect(
          s.units.find((u) => u.toLowerCase() === from.toLowerCase()),
          `${s.slug} ${p}`,
        ).toBeTruthy()
        expect(
          s.units.find((u) => u.toLowerCase() === to.toLowerCase()),
          `${s.slug} ${p}`,
        ).toBeTruthy()
      }
    }
  })

  it('garbage input returns null, not a made-up size', () => {
    const s = systemBySlug('mens-shoe')!
    expect(convertInTable(s, 'US', 'EU', 'abc')).toBeNull()
  })
})
