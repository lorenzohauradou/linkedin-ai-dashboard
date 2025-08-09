"use client"

import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Heart, ThumbsUp, MessageSquare, Check, Eye, Zap, FileText } from 'lucide-react'

interface PostOption {
    id: string
    angle: string
    content: string
    style: 'takeaways' | 'personal' | 'question' | 'story'
    estimated_engagement: number
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
    const [selectedId, setSelectedId] = useState<string | null>(null)

    if (!isVisible || options.length === 0) return null

    const handleSelect = (option: PostOption) => {
        setSelectedId(option.id)
        // Delay per animazione
        setTimeout(() => {
            onSelectOption(option)
        }, 300)
    }

    return (
        <div className="space-y-4">
            <div className="text-center py-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Angle</h3>
                <p className="text-sm text-gray-600">
                    I've generated {options.length} different approaches for your content. Pick the one that resonates most with you:
                </p>
            </div>

            <div className="grid gap-4">
                {options.map((option, index) => (
                    <Card
                        key={option.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-md border-2 ${selectedId === option.id
                            ? 'border-blue-500 bg-blue-50 scale-[0.98]'
                            : 'border-gray-200 hover:border-blue-300'
                            }`}
                        onClick={() => handleSelect(option)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="secondary"
                                        className={`text-xs px-2 py-1 ${getStyleColor(option.style)}`}
                                    >
                                        {getStyleIcon(option.style)}
                                        <span className="ml-1 capitalize">{option.angle}</span>
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Eye className="w-3 h-3" />
                                        <span>{option.estimated_engagement}% engagement</span>
                                    </div>
                                </div>
                                {selectedId === option.id && (
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Mini LinkedIn Preview */}
                            <div className="bg-white rounded-lg border border-gray-100 p-3 mb-3">
                                <div className="flex items-start gap-2 mb-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src="/icons/emoji1.png" alt="Profile" />
                                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">LH</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="text-xs font-medium text-gray-900">LORENZO</div>
                                        <div className="text-xs text-gray-500">now</div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-800 leading-relaxed">
                                    {option.content.length > 150
                                        ? `${option.content.substring(0, 150)}...`
                                        : option.content
                                    }
                                </div>
                                <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <ThumbsUp className="w-3 h-3" />
                                        <span>{Math.floor(Math.random() * 200) + 50}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <MessageSquare className="w-3 h-3" />
                                        <span>{Math.floor(Math.random() * 50) + 10} comments</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 text-center">
                                Click to select this version
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="text-center pt-2">
                <Button variant="outline" size="sm" className="text-xs">
                    Generate New Options
                </Button>
            </div>
        </div>
    )
}
