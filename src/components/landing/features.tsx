import { Check, Bot, Paperclip, BarChart3 } from 'lucide-react';

const FeatureItem = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-blue-50">
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-lg mb-1">{title}</h4>
            <p className="text-gray-600">{children}</p>
        </div>
    </div>
);

export function Features() {
    return (
        <section id="features" className="py-20 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-left mb-16">
                    <div className="space-y-3">
                        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
                            <span className="text-gray-900">Transform Your</span>{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                                LinkedIn Presence
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                            Elevate your professional brand with an AI that understands your voice, analyzes top performers, and helps you create content that resonates.
                        </p>
                    </div>
                </div>

                <div className="space-y-24 bg-transparent backdrop-blur-sm border border-gray-200/20 rounded-3xl p-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 bg-transparent backdrop-blur-sm border border-gray-200/20 rounded-3xl p-6">
                            <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                                <span className="text-gray-900">Turn Any Idea Into</span><br />
                                <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">High-Impact Posts</span>
                            </h3>
                            <div className="space-y-6 bg-transparent backdrop-blur-sm border border-gray-200/20 rounded-3xl p-6">
                                <FeatureItem
                                    icon={<Paperclip className="w-5 h-5 text-blue-600" />}
                                    title="From Any Source"
                                >
                                    Transform a brief idea, a YouTube link, a Reddit thread, or a PDF document into a polished, compelling LinkedIn post.
                                </FeatureItem>
                                <FeatureItem
                                    icon={<Bot className="w-5 h-5 text-blue-600" />}
                                    title="Perfectly Human-Like Tone"
                                >
                                    Our AI goes beyond generic text, capturing the nuances of a professional tone that connects with your audience.
                                </FeatureItem>
                            </div>
                        </div>
                        <div className="relative bg-transparent backdrop-blur-sm border border-gray-200/20 rounded-3xl p-6">
                            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl shadow-gray-400/20">
                                <div className="bg-gray-900 rounded-2xl p-4 min-h-[400px]">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-white text-sm font-medium">AI Post Generator</div>
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700">
                                            <div className="text-gray-400 text-xs mb-2 font-mono">INPUT_SOURCE</div>
                                            <div className="text-white text-sm">
                                                youtube.com/watch?v=... <span className="text-gray-500"> (AI in B2B Marketing)</span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-700">
                                            <div className="text-gray-400 text-xs mb-2 font-mono">GENERATED_POST</div>
                                            <div className="text-white text-sm">
                                                Just watched an insightful video on AI in B2B marketing.
                                                <br /><br />
                                                My key takeaway: AI isn't about replacing marketers; it's about giving them superpowers. By automating data analysis, we can focus on what truly matters—strategy and creativity.
                                                <br /><br />
                                                <span className="text-blue-400">#AI #B2BMarketing #FutureOfWork</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="lg:order-2 space-y-8 bg-transparent backdrop-blur-sm border border-gray-200/20 rounded-3xl p-6">
                            <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                                Your <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Voice</span>,{" "}
                                <span className="text-gray-900">Supercharged</span>
                            </h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Our AI Brain doesn't just learn from you — It learns from the best creators in your niche, for you.
                            </p>
                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                                    </div>
                                    <p className="text-gray-600">
                                        <span className="font-semibold text-gray-900">Analyze the Masters:</span> Deconstruct the style and strategy of any thought leader you admire.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                                    </div>
                                    <p className="text-gray-600">
                                        <span className="font-semibold text-gray-900">Learn What Works:</span> Pinpoint the topics and hooks that create high-engagement posts in your niche.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                                    </div>
                                    <p className="text-gray-600">
                                        <span className="font-semibold text-gray-900">Create with Confidence:</span> Blend their successful patterns with your unique expertise.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="lg:order-1 relative">
                            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl shadow-gray-400/20">
                                <div className="bg-gray-900 rounded-2xl p-4 min-h-[400px]">
                                    <div className="text-white text-sm font-medium mb-4">AI BRAIN TRAINING</div>
                                    <div className="space-y-4">
                                        <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-blue-400 text-sm">Expertise Level</div>
                                                <div className="text-green-400 text-sm font-bold">92%</div>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full" style={{ width: '92%' }}></div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-purple-400 text-sm">Voice Match</div>
                                                <div className="text-green-400 text-sm font-bold">88%</div>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full" style={{ width: '88%' }}></div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-green-400 text-sm">Knowledge Base</div>
                                                <div className="text-green-400 text-sm font-bold">95%</div>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" style={{ width: '95%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center text-gray-500 text-xs mt-6">
                                        Brain successfully trained on 15 case studies, 2 service PDFs, and 3 competitor profiles.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 bg-transparent backdrop-blur-sm border border-gray-200/20 rounded-3xl p-6">
                            <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                                Your <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Automated</span><br />
                                <span className="text-gray-900">Thought Partner</span>
                            </h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Activate Agent Mode and let your AI work for you. It proactively drafts high-quality posts based on your Brain, so you can maintain a powerful presence with minimal effort.
                            </p>
                        </div>
                        <div className="relative bg-transparent backdrop-blur-sm border border-gray-200/20 rounded-3xl p-6">
                            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl shadow-gray-400/20">
                                <div className="bg-gray-900 rounded-2xl p-4 min-h-[400px]">
                                    <div className="text-white text-sm font-medium mb-4">AGENT QUEUE (3 DRAFTS)</div>
                                    <div className="space-y-3">
                                        <div className="bg-gray-800/80 rounded-lg p-4 opacity-100 transform scale-100 border border-gray-700">
                                            <p className="text-xs text-green-400 mb-2 font-mono">DRAFT 1: READY FOR REVIEW</p>
                                            <p className="text-white text-sm">A post on common mistakes in B2B sales, based on your "Client Success Stories" brain.</p>
                                        </div>
                                        <div className="bg-gray-800/80 rounded-lg p-4 opacity-80 transform scale-95 border border-gray-700">
                                            <p className="text-xs text-blue-400 mb-2 font-mono">DRAFT 2: GENERATING...</p>
                                            <p className="text-white text-sm">A thought leadership piece on the future of AI in your industry, inspired by a new market report.</p>
                                        </div>
                                        <div className="bg-gray-800/80 rounded-lg p-4 opacity-60 transform scale-90 border border-gray-700">
                                            <p className="text-xs text-purple-400 mb-2 font-mono">DRAFT 3: IN QUEUE</p>
                                            <p className="text-white text-sm">A short-form post analyzing a recent competitor's announcement.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="lg:order-2 space-y-8 bg-transparent backdrop-blur-sm border border-gray-200/20 rounded-3xl p-6">
                            <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                                <span className="text-gray-900">Bring Your</span>{" "}
                                <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Data</span><br />
                                <span className="text-gray-900">to Life</span>
                            </h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Don't just show your data—tell its story. Upload charts, presentation slides, or short videos, and our AI will build an insightful post around them, explaining their value and context for maximum impact.
                            </p>
                        </div>
                        <div className="lg:order-1 relative bg-transparent backdrop-blur-sm border border-gray-200/20 rounded-3xl p-6">
                            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl shadow-gray-400/20">
                                <div className="bg-gray-900 rounded-2xl p-4 min-h-[400px]">
                                    <div className="text-white text-sm font-medium mb-4">ASSET-TO-POST</div>
                                    <div className="flex gap-4">
                                        <div className="w-1/3">
                                            <p className="text-xs text-gray-400 mb-2 font-mono">UPLOADED_ASSET</p>
                                            <div className="aspect-square bg-gray-800/80 rounded-lg border border-gray-700 flex items-center justify-center">
                                                <BarChart3 className="w-12 h-12 text-blue-500" />
                                            </div>
                                            <p className="text-gray-500 text-center text-xs mt-2">q3_growth.png</p>
                                        </div>
                                        <div className="w-2/3">
                                            <p className="text-xs text-gray-400 mb-2 font-mono">AI_GENERATED_DRAFT</p>
                                            <div className="text-white text-sm bg-gray-800/80 p-3 rounded-lg h-full border border-gray-700">
                                                Proud to share our Q3 growth metrics!
                                                <br /><br />
                                                The data speaks for itself: a 156% increase in user engagement since implementing our new strategy.
                                                <br /><br />
                                                This isn't just a number; it's a testament to our team's hard work and focus on customer value.
                                                <br /><br />
                                                <span className="text-blue-400">#Growth #Data #Results</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}