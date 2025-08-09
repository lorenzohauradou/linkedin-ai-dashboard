"use client"

import { Button } from "../ui/button"
import Image from "next/image"
import { Menu, X, Zap, User, LogOut } from 'lucide-react'
import { useState, useEffect } from "react"
import { useIsMobile } from "../../hooks/use-mobile"
import { useAuth } from "../../contexts/auth-context"
import Link from "next/link"

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isButtonHighlighted, setIsButtonHighlighted] = useState(false)
    const isMobile = useIsMobile()
    const { isAuthenticated, user, logout, isLoading } = useAuth()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
            const heroButton = document.querySelector('section .bg-blue-600')
            if (heroButton) {
                const heroButtonRect = heroButton.getBoundingClientRect()
                const headerHeight = 80
                if (headerHeight > heroButtonRect.top) {
                    setIsButtonHighlighted(true)
                } else {
                    setIsButtonHighlighted(false)
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
            <div className={`flex justify-center px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-4'}`}>
                <div className={`bg-white/10 border border-gray-200/20 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 shadow-lg backdrop-blur-sm transition-all duration-300 w-full max-w-4xl ${isScrolled
                    ? 'rounded-2xl sm:rounded-3xl'
                    : 'rounded-b-2xl sm:rounded-b-3xl'
                    }`}>
                    <div className="flex items-center justify-between">
                        <a href="/" className="flex items-center space-x-1.5 sm:space-x-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center">
                                <Image src="/icons/logoicon.png" alt="LinkedIn AI Agent" width={64} height={64} className="w-full h-full object-contain hover:scale-125 transition-all duration-300" />
                            </div>
                            <span className="text-base sm:text-xl md:text-xl font-bold text-gray-900 truncate">
                                Vibe Scaling <span className="hidden sm:inline">App</span>
                            </span>
                        </a>

                        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" role="navigation">
                            <a href="#features" className="text-black hover:text-blue-600 transition-colors">
                                Features
                            </a>
                            <a href="#demo" className="text-black hover:text-blue-600 transition-colors">
                                Demo
                            </a>
                            <a href="#pricing" className="text-black hover:text-blue-600 transition-colors">
                                Pricing
                            </a>
                        </nav>

                        <div className="flex items-center space-x-3">
                            {!isLoading && isAuthenticated && user ? (
                                // User is authenticated - show dashboard link and logout
                                <>
                                    <Link href="/dashboard">
                                        <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-blue-500 text-white px-4 sm:px-6 py-2.5 rounded-full text-sm sm:text-base transition-all">
                                            <User className="w-4 h-4" />
                                            {isMobile ? "Dashboard" : "Go to Dashboard"}
                                        </Button>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="text-gray-600 hover:text-red-600 p-2 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                // User not authenticated - show CTA
                                <Link href="/login">
                                    <Button className={`px-4 sm:px-6 py-2.5 rounded-full text-sm sm:text-base transition-all ${isButtonHighlighted
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 font-semibold duration-200 hover:scale-105 shadow-xl shadow-blue-500/30 border border-white/30 backdrop-blur-sm hover:border-white/50'
                                        : 'bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white hover:from-blue-600 hover:to-blue-500 font-medium duration-300 border border-white/20 backdrop-blur-sm shadow-lg shadow-blue-500/20 hover:border-white/30'
                                        }`}>
                                        <Zap className="w-4 h-4" />
                                        {isMobile ? "Start Free" : "Claim Your AI Agent"}
                                    </Button>
                                </Link>
                            )}

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden text-gray-700 p-2"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden mt-4 pt-4 border-t border-gray-200/20">
                            <nav className="flex flex-col">
                                <a
                                    href="#features"
                                    className="text-black hover:text-blue-600 transition-colors text-medium font-medium py-3 px-2 rounded-lg hover:bg-blue-50/50"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Features
                                </a>
                                <a
                                    href="#demo"
                                    className="text-black hover:text-blue-600 transition-colors text-medium font-medium py-3 px-2 rounded-lg hover:bg-blue-50/50"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Demo
                                </a>
                                <a
                                    href="#pricing"
                                    className="text-black hover:text-blue-600 transition-colors text-medium font-medium py-3 px-2 rounded-lg hover:bg-blue-50/50"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Pricing
                                </a>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}