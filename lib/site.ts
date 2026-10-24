/** 站点身份与全局常量。 */
export const SITE_NAME = 'SizeCharts'
export const SITE_TAGLINE = 'Shoe, dress, pants and ring size charts with instant conversion'
export const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')
export const DATA_NOTE =
  'General conversion charts compiled from common retailer tables and the ISO 9407 mondopoint system. Clothing and shoe sizes have no legal standard — brands vary, so always check the brand\u2019s own chart when it matters.'
