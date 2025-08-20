"use client"

import Link from "next/link"

export function Video() {
    return (
        <section className="py-16 lg:py-0 -mt-16 lg:-mt-32 lg:pb-24 bg-gradient-to-b from-transparent via-blue-100 to-transparent backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="relative max-w-6xl lg:max-w-4xl mx-auto p-2 sm:p-4 lg:p-6">
                    <div className="bg-gray-900 rounded-2xl lg:rounded-3xl relative overflow-hidden">
                        <div className="bg-gray-800 rounded-xl lg:rounded-2xl relative aspect-video overflow-hidden">
                            <video
                                className="w-full h-full object-cover rounded-xl lg:rounded-2xl"
                                autoPlay
                                muted
                                loop
                                playsInline
                            >
                                <source src="/videos/vs_demo.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>

                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                        <Link href="/login">
                            <div className="bg-gray-900/80 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm flex items-center gap-2">
                                <span>Start Vibe Scaling Now</span>
                                <span>↓</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}