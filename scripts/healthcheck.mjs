#!/usr/bin/env node
/** 线上体检:纯静态站,检查关键页/转换器/方向页/sitemap/API。 */
const SITE_URL = (process.env.SITE_URL ?? '').replace(/\/+$/, '')
if (!SITE_URL) {
  console.error('[health] SITE_URL not configured')
  process.exit(1)
}
const failures = []
const check = async (name, fn) => {
  try { await fn(); console.log(`[health] ✓ ${name}`) } catch (err) {
    failures.push(name); console.error(`[health] ✗ ${name}: ${err.message}`)
  }
}
const get = async (path, timeout = 20_000) => {
  const res = await fetch(`${SITE_URL}${path}`, { signal: AbortSignal.timeout(timeout), headers: { 'User-Agent': 'sizecharts-healthcheck' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}
await check('home renders', async () => {
  const html = await get('/')
  if (!/size charts/i.test(html)) throw new Error('missing hero')
})
await check('mens shoe chart has the table', async () => {
  const html = await get('/chart/mens-shoe')
  if (!/<table/i.test(html) || !/EU/.test(html)) throw new Error('missing table')
})
await check('direction page renders', async () => {
  const html = await get('/convert/mens-shoe/us-to-eu')
  if (!/US men/i.test(html) && !/US/.test(html)) throw new Error('missing copy')
  if (!/→/.test(html) && !/to/.test(html)) throw new Error('missing direction')
})
await check('api converts us9 to eu42', async () => {
  const body = JSON.parse(await get('/api/convert?system=mens-shoe&from=US&to=EU&value=9'))
  if (!body.to?.includes('42')) throw new Error(`bad result: ${body.to}`)
})
await check('sitemap covers directions', async () => {
  const xml = await get('/sitemap.xml')
  const count = (xml.match(/<url>/g) ?? []).length
  if (count < 80) throw new Error(`only ${count} URLs`)
})
if (failures.length > 0) { console.error(`[health] FAILED: ${failures.join(' | ')}`); process.exit(1) }
console.log('[health] all checks passed')
