import Link from 'next/link'
import type { Metadata } from 'next'
import AdSlot from '@/components/AdSlot'
import { jsonLdScript } from '@/lib/jsonld'
import { BASE, DATA_NOTE, SITE_NAME } from '@/lib/site'
import { SYSTEMS } from '@/lib/sizes'

export const metadata: Metadata = {
  title: 'Size Charts & Conversion — Shoes, Dress, Pants, Rings (US · UK · EU)',
  description: `${DATA_NOTE.slice(0, 130)} Convert US ↔ UK ↔ EU sizes instantly for men's, women's and kids' shoes, dresses, pants and rings.`,
  alternates: { canonical: '/' },
}

export default function Home() {
  const siteLd = jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${BASE}/`,
    description: 'Size charts and instant US/UK/EU conversion for shoes, dresses, pants and rings.',
  })
  const faqLd = jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I convert US shoe sizes to EU?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'EU shoe sizes follow the Paris-point system: about 1.5 × foot length in cm + 2. A US men\u2019s 9 is roughly EU 42; a US women\u2019s 9 is roughly EU 39.5. Use the per-direction pages for the full table.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are US and UK sizes the same?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. For men\u2019s shoes, US sizes run about 0.5–1 above UK for the same foot; for women\u2019s dresses, US numbers run about 4 above UK for the same garment.',
        },
      },
    ],
  })

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: siteLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />

      <p className="text-[13px] font-semibold uppercase tracking-widest text-brand">
        US · UK · EU · cm — one consistent table per system
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Size charts & converters</h1>
      <p className="mt-3 text-[15px] text-ink/65">
        Pick a system: every chart page carries the full table plus an instant converter, and every
        conversion direction (US→EU, EU→UK, …) has its own page derived from the same table — so
        the numbers always agree with each other.
      </p>

      <AdSlot slot="home-top" />

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {SYSTEMS.map((s) => (
          <li key={s.slug} className="rounded-xl border border-ink/10 bg-white p-5">
            <Link href={`/chart/${s.slug}`} className="group">
              <span className="block text-[15.5px] font-semibold group-hover:text-brand">
                {s.label} size chart
              </span>
              <span className="mt-1 block text-[13px] text-ink/55">
                {s.units.join(' · ')}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <AdSlot slot="home-bottom" />
    </div>
  )
}
