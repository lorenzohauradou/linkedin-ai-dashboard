import type { Metadata } from 'next'
import { pageConfigs, seoConfig } from '../../lib/seo-config'

export const metadata: Metadata = {
    title: pageConfigs.home.title,
    description: pageConfigs.home.description,
    keywords: pageConfigs.home.keywords,
    openGraph: {
        title: `${pageConfigs.home.title} | ${seoConfig.siteName}`,
        description: pageConfigs.home.description,
        url: seoConfig.siteUrl,
        type: 'website',
        images: seoConfig.openGraph.images
    },
    twitter: {
        title: `${pageConfigs.home.title} | ${seoConfig.siteName}`,
        description: pageConfigs.home.description,
        images: seoConfig.openGraph.images
    },
    alternates: {
        canonical: seoConfig.siteUrl
    }
}

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
