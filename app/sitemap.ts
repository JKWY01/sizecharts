import type { MetadataRoute } from 'next'
import { BASE } from '@/lib/site'
import { SYSTEMS, conversionPairs } from '@/lib/sizes'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
  ]
  for (const s of SYSTEMS) {
    entries.push({ url: `${BASE}/chart/${s.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 })
    for (const p of conversionPairs(s)) {
      entries.push({
        url: `${BASE}/convert/${s.slug}/${p}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })
    }
  }
  return entries
}
