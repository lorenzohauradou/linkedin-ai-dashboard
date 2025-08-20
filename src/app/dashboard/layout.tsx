import type { Metadata } from 'next'
import { ReactNode } from "react"
import { DashboardLayout } from "../../components/dashboard/layout/dashboard-layout"
import AnimatedBackground from "@/src/components/ui/animated-background"
import { ResponsiveProvider } from "../../contexts/responsive-context"
import { AuthGuard } from "../../components/auth/auth-guard"
import { pageConfigs, seoConfig } from '../../lib/seo-config'

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

"use client"

function DashboardLayoutClient({ children }: DashboardLayoutProps) {
    return (
        <AuthGuard>
            <ResponsiveProvider>
                <div className="flex flex-col min-h-screen">
                    <AnimatedBackground />
                    <div className="z-10">
                        <DashboardLayout>
                            {children}
                        </DashboardLayout>
                    </div>
                </div>
            </ResponsiveProvider>
        </AuthGuard>
    )
}

export default function Layout({ children }: DashboardLayoutProps) {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
