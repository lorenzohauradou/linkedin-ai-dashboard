"use client"

import { createContext, useContext, ReactNode } from "react"
import { useResponsive } from "../hooks/use-responsive"

interface ResponsiveContextType {
    // Screen info
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean

    // Sidebar state
    isSidebarOpen: boolean
    toggleSidebar: () => void
    closeSidebar: () => void

    // Post creator state
    isPostCreatorOpen: boolean
    openPostCreator: () => void
    closePostCreator: () => void

    // Utils
    handleOverlayClick: () => void
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined)

export function useResponsiveContext() {
    const context = useContext(ResponsiveContext)
    if (context === undefined) {
        throw new Error('useResponsiveContext must be used within a ResponsiveProvider')
    }
    return context
}

interface ResponsiveProviderProps {
    children: ReactNode
}

export function ResponsiveProvider({ children }: ResponsiveProviderProps) {
    const responsiveState = useResponsive()

    return (
        <ResponsiveContext.Provider value={responsiveState}>
            {children}
        </ResponsiveContext.Provider>
    )
}
