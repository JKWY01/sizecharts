import Link from 'next/link'
import { DATA_NOTE } from '@/lib/site'

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto w-full max-w-4xl px-5 py-8 text-[13px] leading-relaxed text-ink/55">
        <p>{DATA_NOTE}</p>
        <p className="mt-3">
          <Link href="/sitemap.xml" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">Sitemap</Link>
          {' · '}
          <Link href="/llms.txt" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">llms.txt</Link>
          {' · '}
          <Link href="/api/convert" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">JSON API</Link>
        </p>
      </div>
    </footer>
  )
}
