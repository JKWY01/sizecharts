import { NextResponse } from 'next/server'
import { SYSTEMS, conversionPairs, convertInTable, systemBySlug } from '@/lib/sizes'

/** 机器可读端点:?system=mens-shoe&from=US&to=EU&value=9 → 结果 + 整表。CORS 全开。 */
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('system')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const value = searchParams.get('value')

  if (!slug) {
    return NextResponse.json(
      {
        systems: SYSTEMS.map((s) => ({ slug: s.slug, label: s.label, units: s.units })),
        usage: '?system=<slug>&from=<unit>&to=<unit>&value=<size>',
      },
      { headers: { 'access-control-allow-origin': '*' } },
    )
  }
  const s = systemBySlug(slug)
  if (!s) return NextResponse.json({ error: 'unknown system' }, { status: 404 })

  if (!from || !to || !value) {
    return NextResponse.json(
      { system: s.slug, units: s.units, directions: conversionPairs(s).length },
      { headers: { 'access-control-allow-origin': '*' } },
    )
  }

  const fromCol = s.units.find((u) => u.toLowerCase() === from.toLowerCase())
  const toCol = s.units.find((u) => u.toLowerCase() === to.toLowerCase())
  if (!fromCol || !toCol) {
    return NextResponse.json({ error: `units must be one of ${s.units.join('/')}` }, { status: 400 })
  }
  const result = convertInTable(s, fromCol, toCol, value)
  if (result == null) return NextResponse.json({ error: 'unparseable value' }, { status: 400 })
  return NextResponse.json(
    { system: s.slug, from: `${fromCol} ${value}`, to: `${toCol} ${result}` },
    { headers: { 'access-control-allow-origin': '*', 'cache-control': 'public, max-age=86400' } },
  )
}
