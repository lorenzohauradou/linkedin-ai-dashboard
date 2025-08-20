"use client"

import { ReactNode } from "react"
import { DashboardLayout } from "./layout/dashboard-layout"
import AnimatedBackground from "@/src/components/ui/animated-background"
import { ResponsiveProvider } from "../../contexts/responsive-context"
import { AuthGuard } from "../auth/auth-guard"

interface DashboardLayoutClientProps {
    children: ReactNode
}

export function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
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
