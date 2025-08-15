"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Brain, Rocket, Target, ArrowRight } from "lucide-react"
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface OnboardingPopupProps {
    isOpen: boolean
    onClose: () => void
    onStartTraining: () => void
    onSkip: () => void
}

export function OnboardingPopup({ isOpen, onClose, onStartTraining, onSkip }: OnboardingPopupProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleStartTraining = async () => {
        setIsLoading(true)
        try {
            // Mark first login as completed
            await fetch('/api/auth/complete-first-login', { method: 'POST' })

            // Close popup and navigate
            onClose()
            router.push('/dashboard/content-brains')
            onStartTraining()
        } catch (error) {
            console.error('Error starting training:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSkip = async () => {
        try {
            // Mark first login as completed
            await fetch('/api/auth/complete-first-login', { method: 'POST' })

            onClose()
            onSkip()
        } catch (error) {
            console.error('Error skipping onboarding:', error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0 bg-white border border-gray-100 shadow-xl rounded-2xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>AI Training Onboarding</DialogTitle>
                </DialogHeader>
                <div className="relative">
                    <div className="p-8 pt-12">
                        <div className="text-center mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Train Your Personal AI
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                In 2 minutes, teach your AI to create content that reflects
                                your expertise and unique voice.
                            </p>
                        </div>
                        <div className="space-y-4 mb-8 justify-center items-center flex flex-col">
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Image src="/icons/dnaa.png" alt="DNA" width={20} height={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">Professional DNA</h4>
                                    <p className="text-xs text-gray-600">Your value proposition and tone</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Image src="/icons/inspiration.png" alt="Inspiration" width={20} height={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">Inspiration Library</h4>
                                    <p className="text-xs text-gray-600">Learn from winning post patterns</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Image src="/icons/nugget.png" alt="Nugget" width={20} height={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">Gold Nuggets</h4>
                                    <p className="text-xs text-gray-600">Your unique stories and insights</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Image src="/icons/brain.png" alt="Custom Brain" width={20} height={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">Custom Brain</h4>
                                    <p className="text-xs text-gray-600">Add your own custom knowledge</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={handleStartTraining}
                                disabled={isLoading}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium h-11 rounded-lg transition-all hover:shadow-md"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Setting up...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Start Training
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={handleSkip}
                                className="w-full text-gray-600 hover:bg-gray-50 font-normal h-10"
                            >
                                I'll explore first
                            </Button>
                        </div>

                        <p className="text-xs text-gray-400 text-center mt-6">
                            Access Content Brains anytime from the sidebar
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
