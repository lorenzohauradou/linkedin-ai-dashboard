"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: string
    linkedin_id: string
    email: string
    first_name: string
    last_name: string
    headline?: string
    profile_picture_url?: string
    created_at: string
    is_active: boolean
    first_login: boolean
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const isAuthenticated = !!user

    const getAuthToken = () => {
        // Get token from cookie
        const cookies = document.cookie.split(';')
        const authCookie = cookies.find(c => c.trim().startsWith('auth_token='))
        return authCookie ? authCookie.split('=')[1] : null
    }

    const getUserFromCookie = () => {
        const cookies = document.cookie.split(';')
        const userCookie = cookies.find(c => c.trim().startsWith('user_info='))
        if (userCookie) {
            try {
                const userJson = decodeURIComponent(userCookie.split('=')[1])
                return JSON.parse(userJson)
            } catch (e) {
                return null
            }
        }
        return null
    }

    const refreshUser = async () => {
        try {
            // Chiamiamo sempre l'API - i cookie httpOnly vengono inviati automaticamente
            const response = await fetch('/api/auth/me', {
                credentials: 'include' // Include cookies in request
            })

            if (response.ok) {
                const userData = await response.json()
                setUser(userData)
            } else {
                setUser(null)
            }
        } catch (error) {
            console.error('Failed to fetch user:', error)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            // Call logout API route to clear cookies
            await fetch('/api/auth/logout', { method: 'POST' })
        } catch (error) {
            console.error('Logout error:', error)
        }

        setUser(null)
        // Non forzare redirect alla login dalla landing
        if (window.location.pathname.startsWith('/dashboard')) {
            router.push('/login')
        }
    }

    useEffect(() => {
        // Check if we have user info in cookie first (faster)
        const cachedUser = getUserFromCookie()
        if (cachedUser) {
            setUser(cachedUser)
            setIsLoading(false)
        }

        // Then verify with backend
        refreshUser()
    }, [])

    const value = {
        user,
        isLoading,
        isAuthenticated,
        logout,
        refreshUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
