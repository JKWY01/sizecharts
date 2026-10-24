import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AdSlot from '@/components/AdSlot'
import SizeConverter from '@/components/SizeConverter'
import { jsonLdScript, breadcrumbLd } from '@/lib/jsonld'
import { BASE, DATA_NOTE } from '@/lib/site'
import { SYSTEMS, conversionPairs, systemBySlug } from '@/lib/sizes'

/** 对照表总页:"X size chart" 主力词。全表 + 转换器 + 各方向页内链。 */
export const revalidate = 86400

export function generateStaticParams() {
  return SYSTEMS.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const s = systemBySlug(slug)
  if (!s) return {}
  return {
    title: `${s.label} Size Chart — US, UK, EU Conversion Table`,
    description: `Complete ${s.head} chart: ${s.units.join(', ')}. Instant converter and a dedicated page for every conversion direction, all derived from one consistent table.`,
    alternates: { canonical: `/chart/${s.slug}` },
  }
}

export default async function ChartPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const s = systemBySlug(slug)
  if (!s) notFound()

  const pairs = conversionPairs(s).slice(0, 12)

  const breadcrumb = breadcrumbLd([
    { name: 'Home', url: `${BASE}/` },
    { name: `${s.label} Size Chart` },
  ])

  const faqLd = jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do ${s.label.toLowerCase()} sizes convert between systems?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${s.note} The full ${s.units.join('/')} table is above; every conversion direction has its own page.`,
        },
      },
    ],
  })

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />

      <p className="text-[13px] font-semibold uppercase tracking-widest text-brand">
        {s.label} · {s.units.join(' · ')}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {s.label} size chart
      </h1>
      <p className="mt-3 text-[15px] text-ink/65">
        The full conversion table plus an instant converter. {DATA_NOTE}
      </p>

      <div className="mt-6">
        <SizeConverter system={s} />
      </div>

      <AdSlot slot="chart-below-converter" />

      <section className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight">Full {s.label.toLowerCase()} table</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-ink/10 bg-white">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="border-b border-ink/10 text-left text-[12px] uppercase tracking-wider text-ink/45">
                {s.units.map((u) => (
                  <th key={u} className="px-4 py-2.5">
                    {u}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((row, i) => (
                <tr key={i} className="border-b border-ink/5 last:border-0">
                  {s.units.map((u) => (
                    <td key={u} className={`px-4 py-2 ${u === s.baseUnit ? 'font-semibold' : 'text-ink/75'}`}>
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

      <section className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight">Every conversion direction</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {pairs.map((p) => {
            const [from, to] = p.split('-to-')
            return (
              <li key={p}>
                <Link
                  href={`/convert/${s.slug}/${p}`}
                  className="rounded-lg border border-ink/12 bg-white px-3 py-1.5 text-[13px] font-semibold uppercase hover:border-ink/40"
                >
                  {from} → {to}
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
