"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Heart, ThumbsUp, MessageSquare, Eye, Zap, FileText } from 'lucide-react'

import { PostOption } from "../../types/post"
import { processPostContent } from "../../lib/post-utils"

interface MultiAngleSelectorProps {
    options: PostOption[]
    onSelectOption: (option: PostOption) => void
    isVisible: boolean
    expandedPostId?: string | null
}


const styleConfig = {
    takeaways: {
        icon: () => <Zap className="w-4 h-4" />,
        color: 'bg-blue-100 text-blue-700'
    },
    personal: {
        icon: () => <Heart className="w-4 h-4" />,
        color: 'bg-pink-100 text-pink-700'
    },
    question: {
        icon: () => <MessageSquare className="w-4 h-4" />,
        color: 'bg-purple-100 text-purple-700'
    },
    story: {
        icon: () => <FileText className="w-4 h-4" />,
        color: 'bg-green-100 text-green-700'
    },
    default: {
        icon: () => <Eye className="w-4 h-4" />,
        color: 'bg-gray-100 text-gray-700'
    }
} as const

const getStyleIcon = (style: string) => {
    return (styleConfig[style as keyof typeof styleConfig] || styleConfig.default).icon()
}

const getStyleColor = (style: string) => {
    return (styleConfig[style as keyof typeof styleConfig] || styleConfig.default).color
}

export function MultiAngleSelector({ options, onSelectOption, isVisible, expandedPostId }: MultiAngleSelectorProps) {
    const [activeTab, setActiveTab] = useState<string>(options[0]?.id || '1')

    if (!isVisible || options.length === 0) return null

    // Se c'è un post espanso nel pannello destro, usa quello, altrimenti usa il tab attivo
    const effectiveActiveId = expandedPostId && options.find(opt => opt.id === expandedPostId)
        ? expandedPostId
        : activeTab

    const currentOption = options.find(opt => opt.id === effectiveActiveId) || options[0]

    // Update activeTab when options change
    if (options.length > 0 && !options.find(opt => opt.id === activeTab)) {
        setActiveTab(options[0].id)
    }

    const getTabIcon = (angle: string) => {
        if (angle.includes('Personal')) return '📖'
        if (angle.includes('Data')) return '📊'
        if (angle.includes('How-To')) return '💡'
        return '✨'
    }

    const getTabTitle = (angle: string) => {
        if (angle.includes('Personal')) return 'Personal Story'
        if (angle.includes('Data')) return 'Data-Driven'
        if (angle.includes('How-To')) return 'How-To Guide'
        return angle
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex border-b border-gray-200 mb-6">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setActiveTab(option.id)}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${effectiveActiveId === option.id
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-lg">{getTabIcon(option.angle)}</span>
                            <span className="hidden sm:inline">{getTabTitle(option.angle)}</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex-1">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                        <div className="flex items-start gap-3 mb-3">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src="/icons/emoji1.png" alt="Profile" />
                                <AvatarFallback className="bg-blue-100 text-blue-700">LH</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-900">LORENZO</span>
                                    <span className="text-gray-500">• 1st</span>
                                </div>
                                <p className="text-sm text-gray-500">Your professional title</p>
                                <p className="text-sm text-gray-500">now</p>
                            </div>
                        </div>

                        <div className="text-gray-900 whitespace-pre-wrap text-sm leading-relaxed mb-4">
                            {processPostContent(currentOption.content)}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <ThumbsUp className="w-4 h-4" />
                                    <Heart className="w-4 h-4" />
                                    <span>{currentOption.estimated_engagement || 87}</span>
                                </div>
                                <span>12 comments</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                                Est. {currentOption.estimated_engagement || 87}% engagement
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                    <Button
                        onClick={() => onSelectOption(currentOption)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 text-base"
                        size="lg"
                    >
                        Use This Angle
                    </Button>
                </div>
            </div>
        </div>
    )
}
