"use client"

import React, { useState, useEffect } from 'react'
import { Card } from "../../ui/card"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Badge } from "../../ui/badge"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"
import { Plus, Edit3, Trash2, Lightbulb, BookOpen, BarChart, Calendar, Tag } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface GoldNugget {
    id: string
    type: 'insight' | 'story' | 'data'
    title: string
    content: string
    tags: string[]
    created_at: string
}

interface GoldNuggetsModuleProps {
    onUpdate?: () => void
}

const NUGGET_TYPES = [
    { value: 'insight', label: 'Insight', icon: Lightbulb, description: 'A lesson, opinion, or key takeaway' },
    { value: 'story', label: 'Story', icon: BookOpen, description: 'A personal anecdote or case study' },
    { value: 'data', label: 'Data', icon: BarChart, description: 'A statistic or numerical result' }
]

export function GoldNuggetsModule({ onUpdate }: GoldNuggetsModuleProps) {
    const [nuggets, setNuggets] = useState<GoldNugget[]>([])
    const [filteredNuggets, setFilteredNuggets] = useState<GoldNugget[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [editingNugget, setEditingNugget] = useState<GoldNugget | null>(null)
    const [activeFilter, setActiveFilter] = useState<string>('all')

    // Form state
    const [nuggetType, setNuggetType] = useState<'insight' | 'story' | 'data'>('insight')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')

    const isEmpty = nuggets.length === 0

    useEffect(() => {
        fetchNuggets()
    }, [])

    useEffect(() => {
        if (activeFilter === 'all') {
            setFilteredNuggets(nuggets)
        } else {
            setFilteredNuggets(nuggets.filter(nugget => nugget.type === activeFilter))
        }
    }, [nuggets, activeFilter])

    const fetchNuggets = async () => {
        try {
            const response = await fetch('/api/knowledge/nuggets')
            if (response.ok) {
                const data = await response.json()
                setNuggets(data.nuggets)

                // Auto-add if empty
                if (data.nuggets.length === 0) {
                    setIsAddingNew(true)
                }
            }
        } catch (error) {
            console.error('Error fetching nuggets:', error)
            toast.error("Failed to load gold nuggets")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setNuggetType('insight')
        setTitle('')
        setContent('')
        setTags([])
        setTagInput('')
    }

    const handleCancel = () => {
        resetForm()
        setIsAddingNew(false)
        setEditingNugget(null)
    }

    const handleAddNugget = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Title and content are required")
            return
        }

        setIsSaving(true)
        try {
            const response = await fetch('/api/knowledge/nuggets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: nuggetType,
                    title: title.trim(),
                    content: content.trim(),
                    tags: tags
                })
            })

            if (response.ok) {
                const data = await response.json()
                setNuggets(prev => [data.nugget, ...prev])
                resetForm()
                setIsAddingNew(false)
                toast.success("Gold nugget added successfully")
                onUpdate?.()
            } else {
                throw new Error('Failed to save')
            }
        } catch (error) {
            console.error('Error saving nugget:', error)
            toast.error("Failed to save gold nugget")
        } finally {
            setIsSaving(false)
        }
    }

    const handleUpdateNugget = async () => {
        if (!editingNugget || !title.trim() || !content.trim()) {
            toast.error("Title and content are required")
            return
        }

        setIsSaving(true)
        try {
            const response = await fetch(`/api/knowledge/nuggets/${editingNugget.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                    tags: tags
                })
            })

            if (response.ok) {
                const data = await response.json()
                setNuggets(prev => prev.map(n => n.id === editingNugget.id ? data.nugget : n))
                resetForm()
                setEditingNugget(null)
                toast.success("Gold nugget updated successfully")
                onUpdate?.()
            } else {
                throw new Error('Failed to update')
            }
        } catch (error) {
            console.error('Error updating nugget:', error)
            toast.error("Failed to update gold nugget")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteNugget = async (nuggetId: string) => {
        try {
            const response = await fetch(`/api/knowledge/nuggets/${nuggetId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setNuggets(prev => prev.filter(n => n.id !== nuggetId))
                toast.success("Gold nugget deleted")
                onUpdate?.()
            } else {
                throw new Error('Failed to delete')
            }
        } catch (error) {
            console.error('Error deleting nugget:', error)
            toast.error("Failed to delete gold nugget")
        }
    }

    const startEditing = (nugget: GoldNugget) => {
        setEditingNugget(nugget)
        setNuggetType(nugget.type)
        setTitle(nugget.title)
        setContent(nugget.content)
        setTags(nugget.tags)
    }

    const addTag = () => {
        const newTag = tagInput.trim()
        if (newTag && !tags.includes(newTag) && tags.length < 5) {
            setTags(prev => [...prev, newTag])
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove))
    }

    const getTypeIcon = (type: string) => {
        const typeConfig = NUGGET_TYPES.find(t => t.value === type)
        const Icon = typeConfig?.icon || Lightbulb
        return <Icon className="h-4 w-4" />
    }

    const getTypeColor = (type: string) => {
        const colors = {
            insight: 'bg-blue-50 text-blue-700 border-blue-200',
            story: 'bg-green-50 text-green-700 border-green-200',
            data: 'bg-orange-50 text-orange-700 border-orange-200'
        }
        return colors[type as keyof typeof colors] || colors.insight
    }

    if (isLoading) {
        return (
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Image src="/icons/nugget.png" alt="Nugget" width={16} height={16} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Gold Nuggets</h2>
                            <p className="text-xs text-gray-500">Your unique insights, stories, and data</p>
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
                            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                                <Image src="/icons/nugget.png" alt="Nugget" width={16} height={16} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">Gold Nuggets</h2>
                                <p className="text-xs text-gray-500">Your unique insights, stories, and data</p>
                            </div>
                        </div>

                        {!isAddingNew && !editingNugget && !isEmpty && (
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
                    {isAddingNew || editingNugget ? (
                        <div className="space-y-6">
                            {!editingNugget && (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-900">
                                        Nugget Type
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {NUGGET_TYPES.map((type) => {
                                            const Icon = type.icon
                                            return (
                                                <button
                                                    key={type.value}
                                                    onClick={() => setNuggetType(type.value as any)}
                                                    className={`p-3 rounded-lg border text-left transition-colors ${nuggetType === type.value
                                                        ? 'border-orange-300 bg-orange-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Icon className="h-4 w-4" />
                                                        <span className="font-medium text-sm">{type.label}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">{type.description}</p>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">
                                    Title *
                                </label>
                                <Input
                                    placeholder="e.g., The pricing mistake that cost me $50k"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                                    maxLength={100}
                                />
                                <div className="text-xs text-gray-400 text-right">
                                    {title.length}/100
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">
                                    Content *
                                </label>
                                <Textarea
                                    placeholder="Share your insight, tell your story, or present your data..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="min-h-[120px] border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                                    maxLength={1000}
                                />
                                <div className="text-xs text-gray-400 text-right">
                                    {content.length}/1000
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">
                                    Tags (Optional)
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        placeholder="Add a tag..."
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                        className="flex-1 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addTag}
                                        disabled={!tagInput.trim() || tags.length >= 5}
                                        className="border-gray-200 hover:border-gray-300"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-orange-50 text-orange-700 border-orange-200">
                                                {tag}
                                                <button
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1 hover:text-red-600"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                <div className="text-xs text-gray-400">
                                    {tags.length}/5 tags
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={editingNugget ? handleUpdateNugget : handleAddNugget}
                                    disabled={isSaving || !title.trim() || !content.trim()}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        editingNugget ? 'Update Nugget' : 'Add Nugget'
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
                            <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Image src="/icons/nugget.png" alt="Nugget" width={32} height={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Create Your Gold Nuggets
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                Store your unique insights, stories, and data points. The ammunition for authentic content.
                            </p>
                            <Button
                                onClick={() => setIsAddingNew(true)}
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                Add Your First Nugget
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                                    <TabsList className="grid w-full grid-cols-4 bg-gray-50">
                                        <TabsTrigger value="all" className="text-xs">All ({nuggets.length})</TabsTrigger>
                                        <TabsTrigger value="insight" className="text-xs">
                                            Insights ({nuggets.filter(n => n.type === 'insight').length})
                                        </TabsTrigger>
                                        <TabsTrigger value="story" className="text-xs">
                                            Stories ({nuggets.filter(n => n.type === 'story').length})
                                        </TabsTrigger>
                                        <TabsTrigger value="data" className="text-xs">
                                            Data ({nuggets.filter(n => n.type === 'data').length})
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <div className="space-y-4">
                                {filteredNuggets.map((nugget) => (
                                    <div key={nugget.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm hover:border-gray-200 transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <Badge className={`${getTypeColor(nugget.type)} flex items-center gap-1 border`}>
                                                    {getTypeIcon(nugget.type)}
                                                    {nugget.type.charAt(0).toUpperCase() + nugget.type.slice(1)}
                                                </Badge>
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(nugget.created_at).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => startEditing(nugget)}
                                                    className="text-gray-400 hover:text-gray-700"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteNugget(nugget.id)}
                                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <h4 className="font-semibold text-gray-900 mb-2">{nugget.title}</h4>
                                            <p className="text-gray-700 text-sm leading-relaxed">{nugget.content}</p>
                                        </div>

                                        {nugget.tags.length > 0 && (
                                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                                <Tag className="h-3 w-3 text-gray-400" />
                                                <div className="flex flex-wrap gap-1">
                                                    {nugget.tags.map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}