"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { DashboardSidebar } from "./dashboard-sidebar"
import { MobileHeader } from "../mobile-header"
import { SidebarProvider } from "../../ui/sidebar"
import { useResponsiveContext } from "../../../contexts/responsive-context"

interface DashboardLayoutProps {
    children: ReactNode
    onCreatePost?: () => void
}

export function DashboardLayout({
    children,
    onCreatePost
}: DashboardLayoutProps) {
    const pathname = usePathname()
    const {
        isMobile,
        isDesktop,
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        openPostCreator
    } = useResponsiveContext()

    return (
        <div className="min-h-screen">
            <MobileHeader
                onMenuToggle={toggleSidebar}
                onCreatePost={onCreatePost || openPostCreator}
                isSidebarOpen={isSidebarOpen}
            />

            <div className="flex min-h-screen">
                <SidebarProvider defaultOpen={isDesktop}>
                    <div className={`
            ${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'relative'}
            ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
            transition-transform duration-300 ease-in-out
            ${isMobile ? 'w-80' : 'w-auto'}
          `}>
                        <DashboardSidebar />
                    </div>

                    {isMobile && isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-20"
                            onClick={closeSidebar}
                        />
                    )}

                    <div className="flex-1 flex flex-col min-h-screen">
                        <div className="flex-1 flex justify-center p-4 md:p-6">
                            <div className="w-full max-w-5xl">
                                {children}
                            </div>
                        </div>
                    </div>
                </SidebarProvider>

                {pathname === '/dashboard/post-generator' && (
                    <div className={`w-[400px] bg-white border-l border-gray-200 flex-shrink-0 ${isDesktop ? 'flex' : 'hidden'} flex-col h-screen overflow-hidden`}>
                        {/* right panel renderizzato dal PostGeneratorProvider */}
                        <div id="post-generator-right-panel" className="flex-1 flex flex-col h-full overflow-hidden"></div>
                    </div>
                )}
            </div>
        </div>
    )
}
