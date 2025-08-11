import { ArrowRight, Play } from 'lucide-react';

export function Features() {
    return (
        <section id="features" className="py-20 lg:py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <div className="space-y-8">
                        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                            <span className="text-gray-900">Turn any idea into</span>{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                                engaging posts
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                            Transform YouTube videos, PDFs, or simple ideas into compelling LinkedIn content.
                            Your AI understands context and writes in your authentic voice
                        </p>
                        <a
                            href="#demo"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-lg group transition-colors"
                        >
                            See how it works
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                    <div className="relative">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-blue-400 to-sky-300 rounded-full opacity-20 blur-3xl"></div>

                        <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                        <Play className="w-8 h-8 text-white ml-1" />
                                    </div>
                                    <p className="text-gray-600 font-medium">AI Content Creation Demo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <div className="lg:order-2 space-y-8">
                        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                            <span className="text-gray-900">Your</span>{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                                AI Brain
                            </span>{" "}
                            <span className="text-gray-900">learns from the best</span>
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                            Analyze top performers in your niche and learn what makes content engaging.
                            Your AI adapts their winning strategies to your unique voice and expertise
                        </p>
                        <a
                            href="#demo"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-lg group transition-colors"
                        >
                            Learn about AI training
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                    <div className="lg:order-1 relative">
                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-blue-400 to-sky-300 rounded-full opacity-20 blur-3xl"></div>

                        <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                        <Play className="w-8 h-8 text-white ml-1" />
                                    </div>
                                    <p className="text-gray-600 font-medium">AI Brain Training Demo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                            <span className="text-gray-900">Your automated</span>{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                                content partner
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                            Activate Agent Mode for hands-free content creation. Your AI proactively
                            drafts high-quality posts based on industry trends and your expertise
                        </p>
                        <a
                            href="#demo"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-lg group transition-colors"
                        >
                            See Agent Mode in action
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                    <div className="relative">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-blue-400 to-sky-300 rounded-full opacity-20 blur-3xl"></div>
                        <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                        <Play className="w-8 h-8 text-white ml-1" />
                                    </div>
                                    <p className="text-gray-600 font-medium">Agent Mode Demo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}