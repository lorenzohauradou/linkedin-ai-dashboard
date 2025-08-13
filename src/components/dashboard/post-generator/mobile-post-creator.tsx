"use client"

import { useEffect } from "react"
import { Button } from "../../ui/button"
import { X } from 'lucide-react'
import { PostCreator } from "./post-creator"

import { PostOption } from "../../../types/post"

interface MobilePostCreatorProps {
    isOpen: boolean
    onClose: () => void
    onGenerate: (input: any) => void
    postOptions?: PostOption[]
    onSelectOption?: (option: PostOption) => void
    selectedPostId?: string
    selectedPost?: string
    isGenerating?: boolean
    onInteraction?: () => void
    onGeneratingChange?: (generating: boolean) => void
    onResetState?: () => void
    viewMode?: 'preview' | 'multi-angle' | 'welcome'
}

export function MobilePostCreator({
    isOpen,
    onClose,
    onGenerate,
    postOptions,
    onSelectOption,
    selectedPostId,
    selectedPost,
    isGenerating,
    onInteraction,
    onGeneratingChange,
    onResetState,
    viewMode
}: MobilePostCreatorProps) {
    // Previeni scroll del body quando è aperto (ma permetti scroll interno)
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.width = '100%'
        } else {
            document.body.style.overflow = 'unset'
            document.body.style.position = 'unset'
            document.body.style.width = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
            document.body.style.position = 'unset'
            document.body.style.width = 'unset'
        }
    }, [isOpen])

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={onClose}
            />

            <div className="fixed inset-x-4 bottom-0 top-[60px] z-50 md:hidden p-1">
                <div className="bg-white rounded-3xl shadow-2xl h-full flex flex-col">
                    <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </div>

                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-900">Create Post</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="p-2"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                        <PostCreator
                            onGenerate={onGenerate}
                            postOptions={postOptions}
                            onSelectOption={onSelectOption}
                            selectedPostId={selectedPostId}
                            selectedPost={selectedPost}
                            isGenerating={isGenerating}
                            onInteraction={onInteraction}
                            onGeneratingChange={onGeneratingChange}
                            onResetState={onResetState}
                        />
                        {isGenerating && (
                            <div className="absolute inset-0 bg-white/98 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
                                <div className="text-center px-6 py-8">
                                    <div className="relative mx-auto w-16 h-16 mb-6">
                                        <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-pulse"></div>
                                        <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-semibold text-xl mb-2">Generating your Posts</p>
                                        <p className="text-gray-600 text-base">Getting your content ready for AI magic...</p>
                                        <div className="mt-6 flex justify-center">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                                                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
