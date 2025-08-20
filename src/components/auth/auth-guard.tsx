"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../../contexts/auth-context'

interface AuthGuardProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const { user, isLoading, isAuthenticated } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Se non è in loading e l'utente non è autenticato
        if (!isLoading && !isAuthenticated) {
            // Redirect alla login con il path corrente come redirect parameter
            const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`
            router.push(loginUrl)
        }
    }, [isLoading, isAuthenticated, router, pathname])

    // Mostra loading durante la verifica dell'autenticazione
    if (isLoading) {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Verifica autenticazione...</p>
                    </div>
                </div>
            )
        )
    }

    // Se non è autenticato, non mostrare nulla (il redirect è già in corso)
    if (!isAuthenticated) {
        return null
    }

    // Se è autenticato, mostra il contenuto
    return <>{children}</>
}
