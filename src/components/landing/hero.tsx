"use client"

import { useEffect, useState } from "react"
import { useIsMobile } from "../../hooks/use-mobile"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Star, ArrowRight, ThumbsUp, MessageCircle, Repeat2, Send, Eye, Brain, FileImage } from 'lucide-react'

function AnimatedText() {
    const words = ["presence", "creativity", "audience", "authority", "network"]
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false)
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % words.length)
                setIsVisible(true)
            }, 300)
        }, 2500)

        return () => clearInterval(interval)
    }, [words.length])

    return (
        <span
            className={`bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {words[currentIndex]}
        </span>
    )
}
const trustedBy = [
    {
        image: "/icons/trusted1.png",
    },
    {
        image: "/icons/trusted2.png",
    },
    {
        image: "/icons/trusted3.png",
    },
    {
        image: "/icons/trusted4.png",
    },
]

export function Hero() {
    const isMobile = useIsMobile()
    return (
        <section className="relative min-h-[80vh] lg:min-h-screen flex items-center justify-center">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content Section */}
                    <div className="relative z-10 text-center lg:text-left">
                        <div className="space-y-6 lg:space-y-8">
                            {/* Main heading */}
                            <div className="space-y-4 lg:space-y-6">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1]">
                                    <span className="block">Boost your</span>
                                    <span className="flex items-center justify-center lg:justify-start gap-3">
                                        <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2" />
                                        </svg>
                                        <AnimatedText />
                                    </span>
                                </h1>

                                <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    Kill the writer's block with the AI agent that learns your voice to boost your presence on LinkedIn and make you show up everyday
                                </p>
                            </div>

                            {/* CTA Button */}
                            <div className="pt-2 lg:pt-4">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full transition-all duration-200 hover:scale-105 shadow-xl shadow-blue-500/30 border border-white/30 backdrop-blur-sm hover:border-white/50 hover:shadow-blue-500/40"
                                >
                                    {isMobile ? "Claim Your AI Agent" : "Start for free"}
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                                </Button>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 pt-4 lg:pt-6">

                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {trustedBy.map((item, index) => (
                                            <Avatar key={index} className="w-8 h-8 border-2 border-white">
                                                <AvatarImage src={item.image} />
                                                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">U{index}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600 ml-1">+2,500 users</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post Mockup - Hidden on mobile */}
                    <div className="hidden lg:block relative max-w-lg mx-auto lg:max-w-none">
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 sm:p-4 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                            <div className="flex items-center gap-2 sm:gap-3 pb-3">
                                <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                                    <AvatarImage src="/icons/emoji1.png" />
                                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">LH</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 truncate">LORENZO</h3>
                                        <span className="text-blue-600 flex-shrink-0">•</span>
                                        <span className="text-sm text-gray-500 flex-shrink-0">1st</span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">Tech Founder | Building AI-powered solutions</p>
                                    <p className="text-xs text-gray-400">2h • 🌍</p>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="text-sm text-gray-900 leading-relaxed">
                                    <p className="mb-3">
                                        Just launched our latest AI dashboard and the results are
                                        <span className="bg-red-200 text-red-700 line-through mx-1 px-1 rounded">mind-blowing</span>
                                        <span className="bg-green-200 text-green-800 mx-1 px-1 rounded">incredible</span>! 🚀
                                    </p>
                                    <p className="mb-3">
                                        Here's what we learned building an AI-powered LinkedIn content generator:
                                    </p>
                                    <div className="ml-4 space-y-1">
                                        <p>• AI can truly understand your personal voice</p>
                                        <p>• Authenticity beats
                                            <span className="bg-red-200 text-red-700 line-through mx-1 px-1 rounded">generic content</span>
                                            <span className="bg-green-200 text-green-800 mx-1 px-1 rounded">perfectly polished posts</span></p>
                                        <p>• The future of content creation is
                                            <span className="bg-green-200 text-green-800 relative px-1 rounded">
                                                collaborative AI
                                                <span className="absolute -right-1 top-0 w-0.5 h-4 bg-blue-600 animate-pulse"></span>
                                            </span></p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <ThumbsUp className="w-3 h-3" />
                                            <span>124</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="w-3 h-3" />
                                            <span>18</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Repeat2 className="w-3 h-3" />
                                            <span>7</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        <span>45 views</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                                    <Button className="flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 text-xs bg-white text-gray-800 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                                        <FileImage className="w-3 h-3 text-gray-600" />
                                        <span className="truncate">Upload Asset</span>
                                    </Button>
                                    <Button className="flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 text-xs bg-white text-gray-800 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                                        <Brain className="w-3 h-3 text-gray-600" />
                                        <span className="truncate">Use Brain</span>
                                    </Button>
                                    <Button className="flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 text-xs bg-white text-gray-800 hover:text-white border border-gray-200 rounded-md hover:bg-blue-400 transition-colors shadow-sm col-span-2 sm:col-span-1">
                                        <Send className="w-3 h-3" />
                                        <span className="truncate">Publish</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-8 right-8 bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-48 z-10">
                            <div className="flex items-center gap-2 border-1 rounded-md p-1 mb-2">
                                <Brain className="w-4 h-4 text-zinc-800" />
                                <div className="text-xs font-semibold text-zinc-800">LinkedIn AI Agent</div>
                            </div>
                            <div className="space-y-2">
                                <button className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Edit Post
                                </button>
                                <button className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    Enhance Post
                                </button>
                                <button className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded flex items-center gap-2">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                    Rewrite Tone
                                </button>
                                <button className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded flex items-center gap-2">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                    Add Hashtags
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
