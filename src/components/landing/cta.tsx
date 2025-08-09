"use client"

import { Button } from "../ui/button"

export default function CTA() {
    return (
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="max-w-6xl mx-auto text-center">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-20 border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 opacity-90" />
                    <div className="absolute inset-0 backdrop-blur-[2px]" />

                    <div className="space-y-6 sm:space-y-8 relative z-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight">
                            Scale Your Authority,
                            <br />
                            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                Not Just Your Posts.
                            </span>
                        </h2>

                        <div>
                            <Button
                                size="lg"
                                className="bg-white text-black hover:bg-white/90 px-8 sm:px-10 py-6 text-base sm:text-lg font-semibold rounded-full transition-all duration-200 hover:scale-105 shadow-xl shadow-blue-600/25"
                            >
                                Claim Your AI Co-pilot
                            </Button>
                            <p className="text-white/50 text-sm mt-4">
                                No credit card required • 14-day free trial • Cancel anytime
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}