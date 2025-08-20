"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Badge } from "../../ui/badge"
import { Edit3, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { DeleteConfirmDialog } from "../../ui/delete-confirm-dialog"

interface ProfessionalDNA {
    value_proposition: string | null
    tone_tags: string[]
    target_audience: string | null
    updated_at: string
}

interface ProfessionalDNAModuleProps {
    onUpdate?: () => void
}

const TONE_OPTIONS = [
    'Professional', 'Inspirational', 'Direct', 'Friendly', 'Authoritative',
    'Conversational', 'Educational', 'Motivational', 'Analytical', 'Creative'
]

export function ProfessionalDNAModule({ onUpdate }: ProfessionalDNAModuleProps) {
    const [dna, setDna] = useState<ProfessionalDNA | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    // Form state
    const [valueProposition, setValueProposition] = useState('')
    const [selectedTones, setSelectedTones] = useState<string[]>([])
    const [targetAudience, setTargetAudience] = useState('')

    useEffect(() => {
        fetchDNA()
    }, [])

    const fetchDNA = async () => {
        try {
            const response = await fetch('/api/knowledge/dna')
            if (response.ok) {
                const data = await response.json()
                setDna(data.dna)

                // Initialize form state
                setValueProposition(data.dna.value_proposition || '')
                setSelectedTones(data.dna.tone_tags || [])
                setTargetAudience(data.dna.target_audience || '')

                // Auto-edit if empty
                if (!data.dna.value_proposition && !data.dna.tone_tags?.length) {
                    setIsEditing(true)
                }
            }
        } catch (error) {
            console.error('Error fetching DNA:', error)
            toast.error("Failed to load professional DNA")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const response = await fetch('/api/knowledge/dna', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value_proposition: valueProposition.trim() || null,
                    tone_tags: selectedTones,
                    target_audience: targetAudience.trim() || null
                })
            })

            if (response.ok) {
                const data = await response.json()
                setDna(data.dna)
                setIsEditing(false)
                toast.success("Professional DNA updated successfully")
                onUpdate?.()
            } else {
                throw new Error('Failed to save')
            }
        } catch (error) {
            console.error('Error saving DNA:', error)
            toast.error("Failed to save professional DNA")
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        // Reset form to current DNA state
        setValueProposition(dna?.value_proposition || '')
        setSelectedTones(dna?.tone_tags || [])
        setTargetAudience(dna?.target_audience || '')
        setIsEditing(false)
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch('/api/knowledge/dna', {
                method: 'DELETE'
            })

            if (response.ok) {
                setDna(null)
                setValueProposition('')
                setSelectedTones([])
                setTargetAudience('')
                setIsEditing(false)
                setShowDeleteDialog(false)
                toast.success("Professional DNA deleted successfully")
                // Forza l'aggiornamento del pannello padre
                setTimeout(() => {
                    onUpdate?.()
                }, 100)
            } else {
                throw new Error('Failed to delete')
            }
        } catch (error) {
            console.error('Error deleting DNA:', error)
            toast.error("Failed to delete professional DNA")
        } finally {
            setIsDeleting(false)
        }
    }

    const toggleTone = (tone: string) => {
        setSelectedTones(prev =>
            prev.includes(tone)
                ? prev.filter(t => t !== tone)
                : [...prev, tone]
        )
    }

    const isEmpty = !dna?.value_proposition && !dna?.tone_tags?.length && !dna?.target_audience

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Image src="/icons/dnaa.png" alt="DNA" width={16} height={16} />
                        </div>
                        <div>
                            <CardTitle>Your Professional DNA</CardTitle>
                            <p className="text-sm text-gray-500">The foundation of your personal brand</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-sm">
                <div className="p-6 pb-0">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Image src="/icons/dnaa.png" alt="DNA" width={16} height={16} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">Professional DNA</h2>
                                <p className="text-xs text-gray-500">The foundation of your voice</p>
                            </div>
                        </div>

                        {!isEditing && !isEmpty && (
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowDeleteDialog(true)}
                                    disabled={isDeleting}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 pb-6">
                    {isEditing ? (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-900">
                                    Your Value Proposition *
                                </label>
                                <p className="text-xs text-gray-500">
                                    Complete: "I help [WHO] to [WHAT] through [HOW]"
                                </p>
                                <Textarea
                                    placeholder="I help SaaS founders get their first 100 customers through AI-powered growth strategies..."
                                    value={valueProposition}
                                    onChange={(e) => setValueProposition(e.target.value)}
                                    className="min-h-[80px] border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                                    maxLength={280}
                                />
                                <div className="text-xs text-gray-400 text-right">
                                    {valueProposition.length}/280
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-900">
                                    Tone of Voice
                                </label>
                                <p className="text-xs text-gray-500">
                                    Select up to 3 tones that describe your style
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {TONE_OPTIONS.map((tone) => (
                                        <button
                                            key={tone}
                                            onClick={() => selectedTones.length < 3 || selectedTones.includes(tone) ? toggleTone(tone) : null}
                                            className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${selectedTones.includes(tone)
                                                ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                : selectedTones.length < 3
                                                    ? 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                    : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                                }`}
                                            disabled={selectedTones.length >= 3 && !selectedTones.includes(tone)}
                                        >
                                            {tone}
                                        </button>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {selectedTones.length}/3 selected
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-900">
                                    Target Audience
                                </label>
                                <Input
                                    placeholder="SaaS founders, startup CEOs, tech entrepreneurs..."
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                                    maxLength={120}
                                />
                                <div className="text-xs text-gray-400 text-right">
                                    {targetAudience.length}/120
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving || !valueProposition.trim()}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        'Save DNA'
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
                            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Image src="/icons/dnaa.png" alt="DNA" width={32} height={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Define Your Professional DNA
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                Help your AI understand your unique value proposition and communication style.
                            </p>
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Get Started
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {dna?.value_proposition && (
                                <div className="space-y-2">
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Value Proposition
                                    </div>
                                    <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        {dna.value_proposition}
                                    </p>
                                </div>
                            )}

                            {dna?.tone_tags && dna.tone_tags.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Tone of Voice
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {dna.tone_tags.map((tone) => (
                                            <Badge key={tone} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                                {tone}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {dna?.target_audience && (
                                <div className="space-y-2">
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Target Audience
                                    </div>
                                    <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        {dna.target_audience}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Professional DNA"
                description="Are you sure you want to delete your Professional DNA? This will remove your value proposition, tone settings, and target audience."
                itemName={dna?.value_proposition ? `${dna.value_proposition.substring(0, 50)}${dna.value_proposition.length > 50 ? '...' : ''}` : undefined}
                isLoading={isDeleting}
            />
        </div>
    )
}
