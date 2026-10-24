import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SizeCharts — Size Charts & Conversion',
    short_name: 'SizeCharts',
    description: 'US/UK/EU size charts and instant conversion for shoes, dresses, pants and rings.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfcfe',
    theme_color: '#8b3da8',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
