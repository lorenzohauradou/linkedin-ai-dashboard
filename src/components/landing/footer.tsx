"use client"

import Link from "next/link"
import Image from "next/image"

export function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-transparent backdrop-blur-sm border-2 rounded-3xl max-w-6xl mx-auto mb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-8 lg:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-16">
                        <div className="lg:col-span-4">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Image src="/icons/logoicon.png" alt="LinkedIn AI Agent" width={32} height={32} />
                                    <span className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                        Vibe Scaling App
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    👉 The LinkedIn AI Agent that helps you boost your personal brand presence
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Product</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <Link href="#features" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                                                Features
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#demo" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                                                Demo
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#pricing" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                                                Pricing
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Company</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <Link href="/about" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                                                About
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/contact" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                                                Contact
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/careers" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                                                Careers
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div className="hidden md:block">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Resources</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <Link href="/blog" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                                                Blog
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/docs" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                                                Documentation
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/guides" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                                                Guides
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-500">
                                © 2025 Vibe Scaling App. All rights reserved.
                            </div>
                            <div className="flex items-center gap-6">
                                <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                    Terms of Service
                                </Link>
                                <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                    Privacy Policy
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}