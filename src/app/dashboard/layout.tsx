"use client"

import { ReactNode } from "react"
import { DashboardLayout } from "../../components/dashboard/layout/dashboard-layout"
import AnimatedBackground from "@/src/components/ui/animated-background"
import { ResponsiveProvider } from "../../contexts/responsive-context"

interface DashboardLayoutProps {
    children: ReactNode
}

export default function Layout({ children }: DashboardLayoutProps) {
    return (
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
    )
}
