"use client"

import { Play, Pause } from 'lucide-react'
import { Button } from "../ui/button"
import { useState } from 'react'

export function Video() {
    const [isPlaying, setIsPlaying] = useState(false)

    return (
        <section className="py-0 -mt-16 lg:-mt-32 lg:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative max-w-6xl lg:max-w-4xl mx-auto">
                    <div className="bg-gray-900 rounded-3xl p-4 lg:p-8 relative overflow-hidden">
                        <div className="bg-gray-800 rounded-2xl relative aspect-video">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center">
                                <div className="w-full h-full p-4 relative">
                                    <div className="absolute left-4 top-4 bottom-4 w-16 bg-gray-900 rounded-xl">
                                        <div className="p-2 space-y-2">
                                            <div className="w-3 h-3 bg-white rounded-full mx-auto"></div>
                                            <div className="space-y-1">
                                                {Array.from({ length: 8 }).map((_, i) => (
                                                    <div key={i} className="w-8 h-2 bg-gray-600 rounded mx-auto"></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-20 mr-4 mt-4 mb-4 bg-gray-700 rounded-xl p-4">
                                        <div className="space-y-4">
                                            <div className="text-white text-sm">ACTIVITY TIME / IMPRESSION</div>

                                            <div className="grid grid-cols-7 gap-1 h-24">
                                                {Array.from({ length: 35 }).map((_, i) => {
                                                    const col = i % 7
                                                    const row = Math.floor(i / 7)
                                                    const isActive = (col + row) % 3 === 0
                                                    return (
                                                        <div key={i} className={`rounded ${isActive ? 'bg-orange-500' : 'bg-gray-600'}`}></div>
                                                    )
                                                })}
                                            </div>

                                            <div className="flex justify-between text-xs text-gray-400">
                                                <span>Sun</span>
                                                <span>Mon</span>
                                                <span>Tue</span>
                                                <span>Wed</span>
                                                <span>Thu</span>
                                                <span>Fri</span>
                                                <span>Sat</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute right-4 top-4 bottom-4 w-48 bg-gray-700 rounded-xl p-4">
                                        <div className="space-y-3">
                                            <div className="text-white text-xs">HIGHLIGHTS</div>
                                            <div className="space-y-2">
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                                                        <div className="flex-1">
                                                            <div className="w-full h-2 bg-gray-600 rounded"></div>
                                                            <div className="w-2/3 h-1 bg-gray-500 rounded mt-1"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <Button
                                    size="lg"
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="bg-white/90 hover:bg-white text-gray-900 rounded-full w-16 h-16 p-0"
                                >
                                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-2 lg:bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gray-900/80 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm flex items-center gap-2">
                            <span>Watch Vibe Scaling App in Action</span>
                            <span>↓</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}