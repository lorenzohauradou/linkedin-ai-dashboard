"use client"

import React, { useState, useEffect } from 'react'
import { Card } from "../../ui/card"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Badge } from "../../ui/badge"
import { Plus, Trash2, User, Calendar, Eye } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface PostInspiration {
    id: string
    author_name: string | null
    topic: string | null
    content: string
    analysis: {
        hook_type: string
        structure: string
        cta_type: string
        length: number
        engagement_potential: number
        estimated_reading_time: number
    } | null
    created_at: string
}

interface InspirationLibraryModuleProps {
    onUpdate?: () => void
}

export function InspirationLibraryModule({ onUpdate }: InspirationLibraryModuleProps) {
    const [inspirations, setInspirations] = useState<PostInspiration[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [expandedPost, setExpandedPost] = useState<string | null>(null)

    // Form state
    const [newPostContent, setNewPostContent] = useState('')
    const [newAuthorName, setNewAuthorName] = useState('')
    const [newTopic, setNewTopic] = useState('')

    const isEmpty = inspirations.length === 0

    useEffect(() => {
        fetchInspirations()
    }, [])

    const fetchInspirations = async () => {
        try {
            const response = await fetch('/api/knowledge/inspirations')
            if (response.ok) {
                const data = await response.json()
                setInspirations(data.inspirations)

                // Auto-add if empty
                if (data.inspirations.length === 0) {
                    setIsAddingNew(true)
                }
            }
        } catch (error) {
            console.error('Error fetching inspirations:', error)
            toast.error("Failed to load inspirations")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddInspiration = async () => {
        if (!newPostContent.trim()) {
            toast.error("Post content is required")
            return
        }

        setIsSaving(true)
        try {
            const response = await fetch('/api/knowledge/inspirations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: newPostContent.trim(),
                    author_name: newAuthorName.trim() || null,
                    topic: newTopic.trim() || null
                })
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Response data:', data)
                setInspirations(prev => [data.inspiration, ...prev])
                setNewPostContent('')
                setNewAuthorName('')
                setNewTopic('')
                setIsAddingNew(false)
                toast.success("Inspiration added successfully")
                onUpdate?.()
            } else {
                const errorText = await response.text()
                console.error('Failed to save inspiration:', response.status, errorText)
                throw new Error(`Failed to save: ${response.status} - ${errorText}`)
            }
        } catch (error) {
            console.error('Error saving inspiration:', error)
            toast.error("Failed to save inspiration")
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setNewPostContent('')
        setNewAuthorName('')
        setNewTopic('')
        setIsAddingNew(false)
    }

    const handleDeleteInspiration = async (inspirationId: string) => {
        try {
            const response = await fetch(`/api/knowledge/inspirations/${inspirationId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setInspirations(prev => prev.filter(i => i.id !== inspirationId))
                toast.success("Inspiration deleted")
                onUpdate?.()
            } else {
                throw new Error('Failed to delete')
            }
        } catch (error) {
            console.error('Error deleting inspiration:', error)
            toast.error("Failed to delete inspiration")
        }
    }

    const getHookTypeLabel = (hookType: string) => {
        const labels: Record<string, string> = {
            'lesson_learned': 'Lesson Learned',
            'numbered_list': 'Numbered List',
            'time_machine': 'Time Machine',
            'statistic': 'Statistic',
            'story': 'Story',
            'question': 'Question',
            'unknown': 'Unknown'
        }
        return labels[hookType] || hookType
    }

    const getStructureLabel = (structure: string) => {
        const labels: Record<string, string> = {
            'multi_paragraph': 'Multi-Paragraph',
            'list_format': 'List Format',
            'quote_format': 'Quote Format',
            'narrative': 'Narrative',
            'unknown': 'Unknown'
        }
        return labels[structure] || structure
    }

    const getCTALabel = (ctaType: string) => {
        const labels: Record<string, string> = {
            'opinion_question': 'Opinion Question',
            'experience_sharing': 'Experience Sharing',
            'follow_request': 'Follow Request',
            'comment_request': 'Comment Request',
            'question': 'Question',
            'unknown': 'Unknown'
        }
        return labels[ctaType] || ctaType
    }

    const getEngagementColor = (score: number) => {
        if (score >= 4) return 'text-green-600 bg-green-50'
        if (score >= 3) return 'text-yellow-600 bg-yellow-50'
        return 'text-red-600 bg-red-50'
    }

    if (isLoading) {
        return (
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                            <Image src="/icons/inspiration.png" alt="Inspiration" width={16} height={16} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Inspiration Library</h2>
                            <p className="text-xs text-gray-500">AI learns from posts you admire</p>
                        </div>
                    </div>
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-sm">
                <div className="p-6 pb-0">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                                <Image src="/icons/inspiration.png" alt="Inspiration" width={16} height={16} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">Inspiration Library</h2>
                                <p className="text-xs text-gray-500">AI learns from posts you admire</p>
                            </div>
                        </div>

                        {!isAddingNew && !isEmpty && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsAddingNew(true)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="px-6 pb-6">
                    {isAddingNew ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">
                                        Author Name (Optional)
                                    </label>
                                    <Input
                                        placeholder="e.g., Marc Lou"
                                        value={newAuthorName}
                                        onChange={(e) => setNewAuthorName(e.target.value)}
                                        className="border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">
                                        Topic (Optional)
                                    </label>
                                    <Input
                                        placeholder="e.g., Entrepreneurship"
                                        value={newTopic}
                                        onChange={(e) => setNewTopic(e.target.value)}
                                        className="border-gray-200 focus:border-gray-300 focus:ring-gray-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">
                                    Post Content *
                                </label>
                                <Textarea
                                    placeholder="Paste the full LinkedIn post content here..."
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    className="min-h-[120px] border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                                    maxLength={3000}
                                />
                                <div className="text-xs text-gray-400 text-right">
                                    {newPostContent.length}/3000
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={handleAddInspiration}
                                    disabled={isSaving || !newPostContent.trim()}
                                    className="bg-gray-600 hover:bg-gray-700"
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        'Add & Analyze'
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : isEmpty ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Image src="/icons/inspiration.png" alt="Inspiration" width={32} height={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Build Your Inspiration Library
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                Save posts that inspire you. AI will analyze patterns to help create engaging content.
                            </p>
                            <Button
                                onClick={() => setIsAddingNew(true)}
                                className="bg-gray-600 hover:bg-gray-700"
                            >
                                Add Your First Post
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {inspirations.map((inspiration) => (
                                <div key={inspiration.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm hover:border-gray-200 transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {inspiration.author_name && (
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <User className="h-4 w-4" />
                                                    <span className="font-medium">{inspiration.author_name}</span>
                                                </div>
                                            )}
                                            {inspiration.topic && (
                                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                                    {inspiration.topic}
                                                </Badge>
                                            )}
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(inspiration.created_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteInspiration(inspiration.id)}
                                            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                                            {inspiration.content}
                                        </p>
                                        {inspiration.content.length > 200 && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => setExpandedPost(
                                                    expandedPost === inspiration.id ? null : inspiration.id
                                                )}
                                                className="p-0 h-auto text-purple-600 hover:text-purple-700 mt-2"
                                            >
                                                <Eye className="h-3 w-3 mr-1" />
                                                {expandedPost === inspiration.id ? 'Show less' : 'Read full post'}
                                            </Button>
                                        )}
                                    </div>

                                    {expandedPost === inspiration.id && (
                                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                                {inspiration.content}
                                            </p>
                                        </div>
                                    )}

                                    {inspiration.analysis && (
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                Hook: {getHookTypeLabel(inspiration.analysis.hook_type)}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                {getStructureLabel(inspiration.analysis.structure)}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                                {getCTALabel(inspiration.analysis.cta_type)}
                                            </Badge>
                                            <Badge
                                                className={`text-xs ${getEngagementColor(inspiration.analysis.engagement_potential)} border`}
                                            >
                                                {inspiration.analysis.engagement_potential}/5 ⭐
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {inspiration.analysis.estimated_reading_time}min
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}