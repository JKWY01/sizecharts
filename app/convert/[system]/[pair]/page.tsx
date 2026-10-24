import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AdSlot from '@/components/AdSlot'
import SizeConverter from '@/components/SizeConverter'
import { jsonLdScript, breadcrumbLd } from '@/lib/jsonld'
import { BASE, DATA_NOTE } from '@/lib/site'
import { SYSTEMS, conversionPairs, pairToUnits, systemBySlug } from '@/lib/sizes'

/** 方向换算页:"us to eu shoe size" 长尾矩阵。全部由同一张权威表派生。 */
export const revalidate = 86400

export function generateStaticParams() {
  const out: Array<{ system: string; pair: string }> = []
  for (const s of SYSTEMS) {
    for (const p of conversionPairs(s)) {
      out.push({ system: s.slug, pair: p })
    }
  }
  return out
}

const UNIT_NAMES: Record<string, string> = {
  US: 'US',
  UK: 'UK',
  EU: 'EU',
  cm: 'cm (foot / body length)',
  inch: 'inches',
  mm: 'mm (inner circumference)',
  diameter: 'mm (diameter)',
  bust: 'bust (in)',
  waist: 'waist (in)',
  hip: 'hip (in)',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ system: string; pair: string }>
}): Promise<Metadata> {
  const { system, pair } = await params
  const s = systemBySlug(system)
  const units = pairToUnits(pair)
  if (!s || !units) return {}
  const [from, to] = units
  return {
    title: `${s.label} Size: ${from} to ${to} Conversion Chart`,
    description: `Convert ${s.head} from ${from} to ${to} with the full table and an instant converter. ${s.rows.length} sizes, one consistent source table.`,
    alternates: { canonical: `/convert/${s.slug}/${pair}` },
  }
}

export default async function ConvertPage({
  params,
}: {
  params: Promise<{ system: string; pair: string }>
}) {
  const { system, pair } = await params
  const s = systemBySlug(system)
  const units = pairToUnits(pair)
  if (!s || !units) notFound()
  const [fromRaw, toRaw] = units
  const fromCol = s.units.find((u) => u.toLowerCase() === fromRaw.toLowerCase())
  const toCol = s.units.find((u) => u.toLowerCase() === toRaw.toLowerCase())
  if (!fromCol || !toCol) notFound()

  const breadcrumb = breadcrumbLd([
    { name: 'Home', url: `${BASE}/` },
    { name: `${s.label} Size Chart`, url: `${BASE}/chart/${s.slug}` },
    { name: `${fromCol} to ${toCol}` },
  ])

  const firstRow = s.rows[Math.floor(s.rows.length / 2)]
  const faqLd = jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${fromCol} ${firstRow[fromCol]} in ${toCol} for ${s.head}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${fromCol} ${firstRow[fromCol]} in the ${s.label.toLowerCase()} table corresponds to ${toCol} ${firstRow[toCol]}. The full ${fromCol}→${toCol} table is on this page.`,
        },
      },
    ],
  })

  const otherCols = s.units.filter((u) => u !== fromCol && u !== toCol)

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />

      <p className="text-[13px] font-semibold uppercase tracking-widest text-brand">
        {s.label} · {fromCol} → {toCol}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {s.label} size: {fromCol} to {toCol}
      </h1>
      <p className="mt-3 text-[15px] text-ink/65">
        The full {fromCol} → {toCol} conversion for {s.head}, derived from the same table as every
        other direction on this site. {DATA_NOTE}
      </p>

      <div className="mt-6">
        <SizeConverter system={s} presetFrom={fromCol} presetTo={toCol} />
      </div>

      <AdSlot slot="convert-below-converter" />

      <section className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight">
          {fromCol} to {toCol} table
        </h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-ink/10 bg-white">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="border-b border-ink/10 text-left text-[12px] uppercase tracking-wider text-ink/45">
                <th className="px-4 py-2.5">{UNIT_NAMES[fromCol] ?? fromCol}</th>
                <th className="px-4 py-2.5">{UNIT_NAMES[toCol] ?? toCol}</th>
                {otherCols.map((u) => (
                  <th key={u} className="hidden px-4 py-2.5 sm:table-cell">
                    {u}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((row, i) => (
                <tr key={i} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-2 font-semibold">{row[fromCol]}</td>
                  <td className="px-4 py-2 font-semibold text-brand">{row[toCol]}</td>
                  {otherCols.map((u) => (
                    <td key={u} className="hidden px-4 py-2 text-ink/70 sm:table-cell">
                      {row[u]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[12px] text-ink/50">{s.note}</p>
      </section>

      <nav className="mt-8 flex flex-wrap gap-3 text-[14px]">
        <Link
          href={`/chart/${s.slug}`}
          className="rounded-lg bg-ink px-4 py-2 font-semibold text-white hover:bg-ink/85"
        >
          Full {s.label.toLowerCase()} chart →
        </Link>
      </nav>
    </div>
  )
}
