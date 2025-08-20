import { MetadataRoute } from 'next'
import { seoConfig } from '../lib/seo-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/login',
          '/_next/',
          '/admin/',
          '/private/',
        ],
      },
    ],
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
  }
}
