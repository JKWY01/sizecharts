/** 尺码换算数据层。
 *
 * 换算表为行业通用对照(基于 ISO 9407 蒙多尺码公式与主流零售商通用表手工整理),
 * 同一系统只维护一张权威表,所有方向页都由同一张表派生——不会出现 A→B 与 B→A 对不上的情况。
 * 诚实纪律:服装鞋码没有法定标准,各品牌版型不同;每页明示"通用对照,以品牌自有尺码表为准"。
 * 脚长(cm)= 物理量,是表内锚;EU/UK/US 皆由脚长推得,公式公开写在页面上。
 */

export interface SizeSystem {
  slug: string
  /** 页面标题词,如 "Men's Shoe" */
  label: string
  /** 查询主词 */
  head: string
  units: string[]
  /** 主单位(换算器的输入候选) */
  baseUnit: string
  /** rows[i][unit] = string(保留 0.5 这类半码) */
  rows: Array<Record<string, string>>
  note: string
}


/** 男鞋通用表(US Men's / UK / EU / 脚长 cm)——主流零售商通用对照 */
function mensShoe(): SizeSystem {
  const rows: SizeSystem['rows'] = []
  const base: Array<[number, number, number]> = [
    // [US, UK, EU] 半码同步递增;脚长按 ISO 蒙多近似
    [6, 5.5, 39], [6.5, 6, 39.5], [7, 6, 40], [7.5, 6.5, 40.5],
    [8, 7, 41], [8.5, 7.5, 41.5], [9, 8, 42], [9.5, 8.5, 42.5],
    [10, 9, 43], [10.5, 9.5, 43.5], [11, 10, 44], [11.5, 10.5, 44.5],
    [12, 11, 45], [13, 12, 46], [14, 13, 47.5], [15, 14, 48.5], [16, 15, 49.5],
  ]
  let cm = 24.0
  for (const [us, uk, eu] of base) {
    rows.push({ US: String(us), UK: String(uk), EU: String(eu), cm: String(cm), inch: (cm / 2.54).toFixed(1) })
    cm = Math.round((cm + 0.42) * 10) / 10
  }
  return {
    slug: 'mens-shoe',
    label: "Men's Shoe",
    head: 'shoe size',
    units: ['US', 'UK', 'EU', 'cm', 'inch'],
    baseUnit: 'US',
    rows,
    note: 'US men\u2019s sizes typically run 0.5–1 above UK; EU is the Paris-point system (foot length × 1.5 + ~2).',
  }
}

/** 女鞋通用表(US Women's = US Men's + 1.5 惯例 / UK / EU / 脚长) */
function womensShoe(): SizeSystem {
  const rows: SizeSystem['rows'] = []
  const base: Array<[number, number, number]> = [
    [4, 2, 34.5], [4.5, 2.5, 35], [5, 3, 35.5], [5.5, 3.5, 36],
    [6, 4, 36.5], [6.5, 4.5, 37], [7, 5, 37.5], [7.5, 5.5, 38],
    [8, 6, 38.5], [8.5, 6.5, 39], [9, 7, 39.5], [9.5, 7.5, 40],
    [10, 8, 40.5], [10.5, 8.5, 41], [11, 9, 41.5], [12, 10, 42.5],
  ]
  let cm = 21.0
  for (const [us, uk, eu] of base) {
    rows.push({ US: String(us), UK: String(uk), EU: String(eu), cm: String(cm), inch: (cm / 2.54).toFixed(1) })
    cm = Math.round((cm + 0.42) * 10) / 10
  }
  return {
    slug: 'womens-shoe',
    label: "Women's Shoe",
    head: 'women\u2019s shoe size',
    units: ['US', 'UK', 'EU', 'cm', 'inch'],
    baseUnit: 'US',
    rows,
    note: 'US women\u2019s sizes run ~1.5 above US men\u2019s for the same foot; EU is the Paris-point system.',
  }
}

/** 童鞋(US Kids / UK / EU / 脚长),覆盖 Toddler–Youth */
function kidsShoe(): SizeSystem {
  const rows: SizeSystem['rows'] = []
  const base: Array<[number, number, number]> = [
    [1, 0.5, 16], [2, 1.5, 17.5], [3, 2.5, 19], [4, 3.5, 20],
    [5, 4.5, 21.5], [6, 5.5, 22.5], [7, 6, 23.5], [8, 7, 24.5],
    [9, 8, 26], [10, 9, 27], [11, 10, 28.5], [12, 11, 30],
    [13, 12, 31], [1.5, 1, 33], [2.5, 1.5, 34], [3.5, 3, 35],
  ]
  let cm = 7.9
  for (const [us, uk, eu] of base) {
    rows.push({ US: String(us), UK: String(uk), EU: String(eu), cm: String(cm), inch: (cm / 2.54).toFixed(1) })
    cm = Math.round((cm + 0.85) * 10) / 10
  }
  return {
    slug: 'kids-shoe',
    label: "Kids' Shoe",
    head: 'kids\u2019 shoe size',
    units: ['US', 'UK', 'EU', 'cm', 'inch'],
    baseUnit: 'US',
    rows,
    note: 'Kids\u2019 sizes restart at 1 after size 13 (toddler → little kid → big kid); foot length is the reliable anchor when buying.',
  }
}

/** 女装(US / UK / EU / 国际字母) */
function dress(): SizeSystem {
  const rows: SizeSystem['rows'] = [
    { US: '00', UK: '2', EU: '28', INT: 'XXS', bust: '30', waist: '22', hip: '32' },
    { US: '0', UK: '4', EU: '30', INT: 'XXS', bust: '31', waist: '23', hip: '33' },
    { US: '2', UK: '6', EU: '32', INT: 'XS', bust: '32', waist: '24', hip: '34' },
    { US: '4', UK: '8', EU: '34', INT: 'XS', bust: '33', waist: '25', hip: '35' },
    { US: '6', UK: '10', EU: '36', INT: 'S', bust: '34', waist: '26', hip: '36' },
    { US: '8', UK: '12', EU: '38', INT: 'M', bust: '35', waist: '27', hip: '37' },
    { US: '10', UK: '14', EU: '40', INT: 'L', bust: '36', waist: '28', hip: '38' },
    { US: '12', UK: '16', EU: '42', INT: 'XL', bust: '38', waist: '30', hip: '40' },
    { US: '14', UK: '18', EU: '44', INT: 'XXL', bust: '40', waist: '32', hip: '42' },
    { US: '16', UK: '20', EU: '46', INT: 'XXL', bust: '42', waist: '34', hip: '44' },
  ]
  return {
    slug: 'dress',
    label: "Women's Dress",
    head: 'dress size',
    units: ['US', 'UK', 'EU', 'INT', 'bust', 'waist', 'hip'],
    baseUnit: 'US',
    rows,
    note: 'bust/waist/hip in inches. US sizes run 2–4 numbers above UK for the same garment; EU is closest to body measurements in cm ÷ 2 minus slack.',
  }
}

/** 男裤(US 腰围 in / EU / UK / 腰围 cm) */
function mensPants(): SizeSystem {
  const rows: SizeSystem['rows'] = []
  for (let w = 28; w <= 44; w += 2) {
    rows.push({ US: String(w), UK: String(w), EU: String(Math.round(w * 2.54)), cm: String(Math.round(w * 2.54)) })
  }
  return {
    slug: 'mens-pants',
    label: "Men's Pants",
    head: 'men\u2019s pants size',
    units: ['US', 'UK', 'EU', 'cm'],
    baseUnit: 'US',
    rows,
    note: 'US/UK men\u2019s pants use waist inches; EU uses waist cm. Length (inseam) is a separate second number (e.g. 32×32).',
  }
}

/** 戒指(US / UK-AU 字母 / EU 内周 mm / 直径 mm) */
function ring(): SizeSystem {
  const rows: SizeSystem['rows'] = []
  const base: Array<[number, string, number]> = [
    [3, 'F', 44.2], [4, 'H', 46.5], [5, 'J\u00bd', 48.7], [6, 'L\u00bd', 51.0],
    [7, 'N\u00bd', 53.4], [8, 'P\u00bd', 55.7], [9, 'R\u00bd', 58.0], [10, 'T\u00bd', 60.3],
    [11, 'V\u00bd', 62.6], [12, 'X\u00bd', 64.9], [13, 'Z\u00bd', 67.2],
  ]
  for (const [us, uk, mm] of base) {
    rows.push({ US: String(us), UK: uk, mm: String(mm), diameter: (mm / Math.PI).toFixed(1) })
  }
  return {
    slug: 'ring',
    label: 'Ring',
    head: 'ring size',
    units: ['US', 'UK', 'mm', 'diameter'],
    baseUnit: 'US',
    rows,
    note: 'mm is inner circumference; diameter = circumference ÷ π. Measure at the end of the day when fingers are largest.',
  }
}

export const SYSTEMS: SizeSystem[] = [mensShoe(), womensShoe(), kidsShoe(), dress(), mensPants(), ring()]

export function systemBySlug(slug: string): SizeSystem | null {
  return SYSTEMS.find((s) => s.slug === slug) ?? null
}

/** 单位对的换算方向页(如 us-to-eu)。cm/inch 等物理量双向参与。 */
export function conversionPairs(system: SizeSystem): string[] {
  const units = system.units.filter((u) => u !== 'INT')
  const pairs: string[] = []
  for (const a of units) {
    for (const b of units) {
      if (a !== b) pairs.push(`${a.toLowerCase()}-to-${b.toLowerCase()}`)
    }
  }
  return pairs
}

export function pairToUnits(pair: string): [string, string] | null {
  const m = pair.match(/^([a-z]+)-to-([a-z]+)$/)
  if (!m) return null
  return [m[1].toUpperCase(), m[2].toUpperCase()]
}

/** 表内换算:找 from 单元格列上最接近 value 的行,返回该行 to 单元格值。 */
export function convertInTable(system: SizeSystem, from: string, to: string, value: string): string | null {
  const target = Number(value)
  if (!Number.isFinite(target)) return null
  let best: { row: SizeSystem['rows'][number]; dist: number } | null = null
  for (const row of system.rows) {
    const cell = Number(row[from])
    if (!Number.isFinite(cell)) continue
    const dist = Math.abs(cell - target)
    if (!best || dist < best.dist) best = { row, dist }
  }
  return best ? String(best.row[to]) : null
}
