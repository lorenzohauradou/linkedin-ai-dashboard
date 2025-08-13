"use client"

import { useState, useEffect } from "react"
import { Button } from "./button"
import { Card } from "./card"
import { ExternalLink, CheckCircle, Sparkles, Trophy, ArrowRight, Copy } from 'lucide-react'

interface PublishSuccessProps {
    isOpen: boolean
    onClose: () => void
    postUrl?: string
    postContent?: string
}

export function PublishSuccess({ isOpen, onClose, postUrl, postContent }: PublishSuccessProps) {
    const [showConfetti, setShowConfetti] = useState(false)
    const [showReward, setShowReward] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (isOpen) {
            // Delay per l'effetto di entrata
            setTimeout(() => setShowConfetti(true), 200)
            setTimeout(() => setShowReward(true), 800)
        } else {
            setShowConfetti(false)
            setShowReward(false)
        }
    }, [isOpen])

    const copyPostUrl = async () => {
        if (postUrl) {
            try {
                await navigator.clipboard.writeText(postUrl)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            } catch (err) {
                console.error('Failed to copy:', err)
            }
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 opacity-80 animate-bounce"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`,
                                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                                transform: `rotate(${Math.random() * 360}deg)`
                            }}
                        />
                    ))}
                </div>
            )}

            <Card className={`relative bg-white border-0 rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden transform transition-all duration-500 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
                }`}>

                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-sky-50"></div>

                <div className="relative z-10 p-8 text-center">

                    <div className="relative mb-6">
                        <div className={`w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-700 ${showReward ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                            }`}>
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>

                        <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-full border-4 border-green-300 transition-all duration-1000 ${showReward ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
                            }`}></div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-2xl font-bold text-gray-900">Post Published!</h2>
                            <Sparkles className="w-6 h-6 text-blue-500" />
                        </div>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            🎉 Congratulations! Your LinkedIn post is now live and reaching your professional network.
                        </p>

                        {showReward && (
                            <div className={`bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl p-4 mt-6 transform transition-all duration-500 ${showReward ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                }`}>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-600">+50</div>
                                        <div className="text-xs text-gray-600">Potential Reach</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">+25</div>
                                        <div className="text-xs text-gray-600">Engagement</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-purple-600">+10</div>
                                        <div className="text-xs text-gray-600">Authority Points</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        {postUrl && (
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => window.open(postUrl, '_blank')}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View on LinkedIn
                                </Button>

                                <Button
                                    onClick={copyPostUrl}
                                    variant="outline"
                                    className="px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                                    disabled={copied}
                                >
                                    {copied ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        )}

                        <Button
                            onClick={onClose}
                            variant="ghost"
                            className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-3 rounded-xl font-medium transition-all duration-200"
                        >
                            Continue Creating
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    {showReward && (
                        <div className={`mt-6 transform transition-all duration-700 delay-300 ${showReward ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-90'
                            }`}>
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium border border-yellow-200">
                                <Trophy className="w-4 h-4" />
                                Content Creator Achievement Unlocked!
                            </div>
                        </div>
                    )}
                </div>

                <div className="absolute top-4 right-4 w-8 h-8 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-green-200 rounded-full opacity-30 animate-bounce"></div>
                <div className="absolute top-1/2 left-4 w-4 h-4 bg-purple-200 rounded-full opacity-25 animate-ping"></div>
            </Card>

            <div
                className="absolute inset-0 z-0"
                onClick={onClose}
            />
        </div>
    )
}
