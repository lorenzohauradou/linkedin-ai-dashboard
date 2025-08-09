"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LinkedInDashboard } from "../../components/dashboard/linkedin-dashboard"
import { useAuth } from "../../contexts/auth-context"

export default function DashboardPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null // Will redirect to login
    }

    return <LinkedInDashboard />
}
