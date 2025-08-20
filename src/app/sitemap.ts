import { MetadataRoute } from 'next'
import { seoConfig } from '../lib/seo-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = seoConfig.siteUrl
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    // Note: Dashboard pages are private and should not be in sitemap
  ]
}
