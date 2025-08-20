import type { Metadata } from 'next'
import { ReactNode } from "react"
import { pageConfigs, seoConfig } from '../../lib/seo-config'
import { DashboardLayoutClient } from "../../components/dashboard/dashboard-layout-client"

export const metadata: Metadata = {
    title: pageConfigs.dashboard.title,
    description: pageConfigs.dashboard.description,
    keywords: pageConfigs.dashboard.keywords,
    openGraph: {
        title: `${pageConfigs.dashboard.title} | ${seoConfig.siteName}`,
        description: pageConfigs.dashboard.description,
        url: `${seoConfig.siteUrl}/dashboard`,
        type: 'website',
        images: seoConfig.openGraph.images
    },
    twitter: {
        title: `${pageConfigs.dashboard.title} | ${seoConfig.siteName}`,
        description: pageConfigs.dashboard.description,
        images: seoConfig.openGraph.images
    },
    alternates: {
        canonical: `${seoConfig.siteUrl}/dashboard`
    },
    robots: {
        index: false, // Non indicizzare le pagine private della dashboard
        follow: false
    }
}

interface DashboardLayoutProps {
    children: ReactNode
}

export default function Layout({ children }: DashboardLayoutProps) {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
