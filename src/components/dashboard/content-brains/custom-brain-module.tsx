"use client"

import { useState, useEffect } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Card } from "../../ui/card"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface CustomBrain {
    id: string
    title: string
    content: string
    created_at: string
    updated_at: string
}

interface CustomBrainModuleProps {
    onBack: () => void
    onUpdate?: () => void
}

export function CustomBrainModule({ onBack, onUpdate }: CustomBrainModuleProps) {
    const [customBrain, setCustomBrain] = useState<CustomBrain | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Form state
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const isEmpty = !customBrain

    useEffect(() => {
        fetchCustomBrain()
    }, [])

    useEffect(() => {
        if (isEmpty && !isLoading) {
            setIsEditing(true)
        }
    }, [isEmpty, isLoading])

    const fetchCustomBrain = async () => {
        try {
            const response = await fetch('/api/knowledge/custom-brain')
            if (response.ok) {
                const data = await response.json()
                setCustomBrain(data.custom_brain)
                if (data.custom_brain) {
                    setTitle(data.custom_brain.title)
                    setContent(data.custom_brain.content)
                }
            }
        } catch (error) {
            console.error('Error fetching custom brain:', error)
            toast.error("Failed to load custom brain")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Title and content are required")
            return
        }

        setIsSaving(true)
        try {
            const endpoint = '/api/knowledge/custom-brain'
            const method = customBrain ? 'PUT' : 'POST'

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim()
                })
            })

            if (response.ok) {
                const data = await response.json()
                setCustomBrain(data.custom_brain)
                setIsEditing(false)
                toast.success(customBrain ? "Custom brain updated successfully" : "Custom brain created successfully")
                onUpdate?.()
            } else {
                const errorText = await response.text()
                console.error('Failed to save custom brain:', response.status, errorText)
                throw new Error(`Failed to save: ${response.status} - ${errorText}`)
            }
        } catch (error) {
            console.error('Error saving custom brain:', error)
            toast.error("Failed to save custom brain")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!customBrain) return

        setIsDeleting(true)
        try {
            const response = await fetch('/api/knowledge/custom-brain', {
                method: 'DELETE'
            })

            if (response.ok) {
                setCustomBrain(null)
                setTitle("")
                setContent("")
                setIsEditing(true)
                toast.success("Custom brain deleted successfully")
                onUpdate?.()
            } else {
                throw new Error('Failed to delete')
            }
        } catch (error) {
            console.error('Error deleting custom brain:', error)
            toast.error("Failed to delete custom brain")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleEdit = () => {
        if (customBrain) {
            setTitle(customBrain.title)
            setContent(customBrain.content)
        }
        setIsEditing(true)
    }

    const handleCancel = () => {
        if (customBrain) {
            setTitle(customBrain.title)
            setContent(customBrain.content)
            setIsEditing(false)
        } else {
            setTitle("")
            setContent("")
        }
    }

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">

                <Card className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <p className="text-gray-600 leading-relaxed">
                    Create your own custom knowledge that the AI can use for content generation.
                </p>
                <p className="text-sm text-gray-500">
                    Add any specific information, guidelines, or context you want the AI to remember.
                </p>
            </div>

            <Card className="p-6">
                {isEditing ? (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Personal Expertise, Industry Knowledge, etc..."
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Content
                            </label>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter your custom knowledge here. This could include any context you want the AI to consider when generating content..."
                                className="w-full min-h-[200px] resize-none"
                            />
                            <p className="text-xs text-gray-500">
                                Be as detailed as possible. The AI will use this information to create more personalized and relevant content.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || !title.trim() || !content.trim()}
                                className="flex-1"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? "Saving..." : (customBrain ? "Update" : "Create")}
                            </Button>

                            {customBrain && (
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {customBrain && (
                            <>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-gray-900">{customBrain.title}</h3>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={handleEdit}>
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleDelete}
                                                disabled={isDeleting}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="prose prose-sm max-w-none">
                                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                            {customBrain.content}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">
                                        Created: {new Date(customBrain.created_at).toLocaleDateString()}
                                        {customBrain.updated_at !== customBrain.created_at && (
                                            <span> • Updated: {new Date(customBrain.updated_at).toLocaleDateString()}</span>
                                        )}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Card>
        </div>
    )
}
