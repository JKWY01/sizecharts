import Link from 'next/link'
import { SITE_NAME } from '@/lib/site'
import { SYSTEMS } from '@/lib/sizes'

export default function Nav() {
  return (
    <header className="border-b border-ink/10 bg-white">
      <nav className="mx-auto flex w-full max-w-4xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-[14px] font-bold text-white">
            S
          </span>
          <span className="text-[17px] font-semibold tracking-tight">{SITE_NAME}</span>
        </Link>
        <div className="flex items-center gap-4 text-[13.5px] font-medium text-ink/70">
          {SYSTEMS.slice(0, 4).map((s) => (
            <Link key={s.slug} href={`/chart/${s.slug}`} className="hidden hover:text-ink sm:inline">
              {s.label}
            </Link>
          ))}
          <Link href="/" className="hover:text-ink">
            All charts
          </Link>
        </div>
      </nav>
    </header>
  )
}
