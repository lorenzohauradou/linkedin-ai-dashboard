"use client"

import { ArrowRight } from 'lucide-react'
import Image from "next/image"

export function WelcomeMessage() {
    return (
        <div className="h-full flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 mb-6 shadow-sm">
                        <Image src="/icons/logo500.png" alt="Vibe Scaling" width={50} height={50} className="rounded-lg" />
                    </div>
                    <h1 className="text-3xl font-light text-gray-900 mb-3 tracking-tight">
                        Vibe Scaling
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Transform your ideas into engaging LinkedIn content with AI-powered creativity
                    </p>
                </div>
                <div className="text-center mt-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-sm text-gray-600 border border-gray-100">
                        <span>Start Vibe Scaling in the AI panel</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>
    )
}
