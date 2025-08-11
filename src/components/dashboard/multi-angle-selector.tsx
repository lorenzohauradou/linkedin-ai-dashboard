"use client"

import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Heart, ThumbsUp, MessageSquare, Check, Eye, Zap, FileText } from 'lucide-react'

import { PostOption } from "../../types/post"

// Funzione helper per processare il contenuto del post
const processPostContent = (content: string): string => {
    if (!content) return content

    // Rimuovi virgolette all'inizio e alla fine
    let processed = content.trim()
    if (processed.startsWith('"') && processed.endsWith('"')) {
        processed = processed.slice(1, -1)
    }
    if (processed.startsWith("'") && processed.endsWith("'")) {
        processed = processed.slice(1, -1)
    }

    // Converti escape sequences in veri line break
    processed = processed.replace(/\\n/g, '\n')

    // Aggiungi spazi eleganti: doppio line break dopo paragrafi
    processed = processed.replace(/\n\n/g, '\n\n')

    return processed.trim()
}

interface MultiAngleSelectorProps {
    options: PostOption[]
    onSelectOption: (option: PostOption) => void
    isVisible: boolean
}

const getStyleIcon = (style: string) => {
    switch (style) {
        case 'takeaways':
            return <Zap className="w-4 h-4" />
        case 'personal':
            return <Heart className="w-4 h-4" />
        case 'question':
            return <MessageSquare className="w-4 h-4" />
        case 'story':
            return <FileText className="w-4 h-4" />
        default:
            return <Eye className="w-4 h-4" />
    }
}

const getStyleColor = (style: string) => {
    switch (style) {
        case 'takeaways':
            return 'bg-blue-100 text-blue-700'
        case 'personal':
            return 'bg-pink-100 text-pink-700'
        case 'question':
            return 'bg-purple-100 text-purple-700'
        case 'story':
            return 'bg-green-100 text-green-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

export function MultiAngleSelector({ options, onSelectOption, isVisible }: MultiAngleSelectorProps) {
    const [activeTab, setActiveTab] = useState<string>(options[0]?.id || '1')

    if (!isVisible || options.length === 0) return null

    const currentOption = options.find(opt => opt.id === activeTab) || options[0]

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
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 mb-6">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setActiveTab(option.id)}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === option.id
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

            {/* Active Tab Content */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1">
                    {/* LinkedIn Post Preview */}
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

                {/* Use This Angle Button */}
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
