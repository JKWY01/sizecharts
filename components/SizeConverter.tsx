'use client'

import { useMemo, useState } from 'react'
import type { SizeSystem } from '@/lib/sizes'
import { convertInTable } from '@/lib/sizes'

/** 表内换算器:同一张权威表派生,结果与所有对照页严格一致。纯客户端,零外呼。 */
export default function SizeConverter({
  system,
  presetFrom,
  presetTo,
}: {
  system: SizeSystem
  presetFrom?: string
  presetTo?: string
}) {
  const units = system.units
  const [from, setFrom] = useState(presetFrom ?? system.baseUnit)
  const [to, setTo] = useState(presetTo ?? units.find((u) => u !== from) ?? units[0])
  const candidates = useMemo(() => [...new Set(system.rows.map((r) => r[from]))], [system, from])
  const [value, setValue] = useState(candidates[0] ?? '')

  const result = convertInTable(system, from, to, value)

  const selectCls =
    'rounded-lg border border-ink/15 bg-white px-3 py-2 text-[14px] font-medium focus:border-brand focus:outline-none'

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="flex flex-wrap items-center gap-3">
        <select
          className={selectCls}
          value={from}
          onChange={(e) => {
            setFrom(e.target.value)
            if (e.target.value === to) setTo(units.find((u) => u !== e.target.value) ?? units[0])
          }}
          aria-label="from unit"
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <span className="text-ink/40">→</span>
        <select
          className={selectCls}
          value={to}
          onChange={(e) => setTo(e.target.value)}
          aria-label="to unit"
        >
          {units.filter((u) => u !== from).map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <select
          className={selectCls}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={`size in ${from}`}
        >
          {candidates.map((c) => (
            <option key={c} value={c}>
              {from} {c}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 text-[15px]">
        {result != null ? (
          <span>
            <strong className="text-brand">{from} {value}</strong> ≈{' '}
            <strong className="text-brand">
              {to} {result}
            </strong>
          </span>
        ) : (
          <span className="text-ink/50">Pick a size to convert.</span>
        )}
      </div>
      <p className="mt-2 text-[12px] text-ink/50">{system.note}</p>
    </div>
  )
}
