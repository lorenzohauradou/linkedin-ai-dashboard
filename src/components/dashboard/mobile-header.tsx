"use client"

import { Button } from "../ui/button"
import { Plus } from 'lucide-react'
import Image from "next/image"

interface MobileHeaderProps {
    onMenuToggle: () => void
    onCreatePost: () => void
    isSidebarOpen: boolean
}

export function MobileHeader({ onCreatePost }: MobileHeaderProps) {
    return (
        <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                            <Image
                                src="/icons/logoicon.png"
                                alt="Vibe Scaling"
                                width={24}
                                height={24}
                            />
                        </div>
                        <span className="font-bold text-gray-900 text-lg">Vibe Scaling</span>
                    </div>
                </div>

                <div className="flex items-center">

                    <Button
                        onClick={onCreatePost}
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 px-4 py-3 rounded-lg font-medium touch-manipulation"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Create
                    </Button>
                </div>
            </div>
        </header>
    )
}
