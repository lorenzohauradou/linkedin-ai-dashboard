import type { Metadata } from 'next'
import { pageConfigs, seoConfig } from '../../lib/seo-config'

export const metadata: Metadata = {
    title: pageConfigs.login.title,
    description: pageConfigs.login.description,
    keywords: pageConfigs.login.keywords,
    openGraph: {
        title: `${pageConfigs.login.title} | ${seoConfig.siteName}`,
        description: pageConfigs.login.description,
        url: `${seoConfig.siteUrl}/login`,
        type: 'website',
        images: seoConfig.openGraph.images
    },
    twitter: {
        title: `${pageConfigs.login.title} | ${seoConfig.siteName}`,
        description: pageConfigs.login.description,
        images: seoConfig.openGraph.images
    },
    alternates: {
        canonical: `${seoConfig.siteUrl}/login`
    },
    robots: {
        index: false, // Non indicizzare la pagina di login
        follow: true
    }
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
