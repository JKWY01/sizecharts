import { NextResponse } from 'next/server'
import { BASE, DATA_NOTE, SITE_NAME } from '@/lib/site'
import { SYSTEMS, conversionPairs } from '@/lib/sizes'

export const revalidate = 86400

export function GET(): Response {
  const pairs = SYSTEMS.reduce((n, s) => n + conversionPairs(s).length, 0)
  const body = `# ${SITE_NAME}

> US/UK/EU size charts and conversion for shoes (men/women/kids), dresses, pants and rings — ${SYSTEMS.length} systems, ${pairs} conversion directions, all derived from one consistent table per system.
> Live at ${BASE} . ${DATA_NOTE}

## Endpoints

- ${BASE}/api/convert — system list & usage
- ${BASE}/api/convert?system=mens-shoe&from=US&to=EU&value=9 — instant conversion

## Pages

- /chart/<system> — full chart + interactive converter (mens-shoe, womens-shoe, kids-shoe, dress, mens-pants, ring)
- /convert/<system>/<from>-to-<to> — one page per direction (e.g. /convert/mens-shoe/us-to-eu)

## Facts & policy

- Shoe EU sizes follow the Paris-point system (foot cm × 1.5 + ~2); cm/inch columns are the physical anchor.
- Ring mm = inner circumference; diameter = circumference ÷ π.
- Charts are general retailer-standard approximations; brands vary.
`
  return new NextResponse(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=86400' },
  })
}
