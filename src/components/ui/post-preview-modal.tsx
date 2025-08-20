"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { Button } from "./button"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Card, CardContent } from "./card"
import { Badge } from "./badge"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import { Heart, Send, MoreHorizontal, ThumbsUp, MessageSquare, ExternalLink, Trash2, Calendar, Clock } from 'lucide-react'
import { useAuth } from "../../contexts/auth-context"
import { formatDistanceToNow } from "date-fns"
import { it } from "date-fns/locale"

interface PostPreviewModalProps {
    isOpen: boolean
    onClose: () => void
    post: {
        id: string
        content: string
        status: 'draft' | 'published'
        created_at: string
        published_at?: string
        linkedin_post_id?: string
        source_prompt?: string
        source_brains?: string[]
        source_asset_id?: string
    } | null
    onDelete?: (postId: string) => void
}

export function PostPreviewModal({ isOpen, onClose, post, onDelete }: PostPreviewModalProps) {
    const { user } = useAuth()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    if (!post) return null

    // Helper per ottenere i dati dell'utente con fallback
    const getUserDisplayName = () => {
        if (!user) return "User"
        return `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || "User"
    }

    const getUserInitials = () => {
        if (!user) return "U"
        const firstName = user.first_name || ""
        const lastName = user.last_name || ""
        if (firstName && lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
        }
        if (firstName) return firstName.charAt(0).toUpperCase()
        if (user.email) return user.email.charAt(0).toUpperCase()
        return "U"
    }

    const getUserProfileImage = () => {
        return user?.profile_picture_url || "/icons/emoji1.png"
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return formatDistanceToNow(date, { addSuffix: true, locale: it })
        } catch {
            return "Data non valida"
        }
    }

    const handleDelete = async () => {
        if (!onDelete) return

        setIsDeleting(true)
        try {
            await onDelete(post.id)
            setShowDeleteDialog(false)
            onClose()
        } catch (error) {
            console.error('Errore eliminazione post:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    const openLinkedInPost = () => {
        if (post.linkedin_post_id) {
            // Costruisci URL LinkedIn dal post ID
            const linkedinUrl = `https://www.linkedin.com/feed/update/${post.linkedin_post_id}/`
            window.open(linkedinUrl, '_blank')
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="space-y-4">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-semibold">Post Preview</DialogTitle>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={post.status === 'published' ? 'default' : 'secondary'}
                                    className={post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                                >
                                    {post.status === 'published' ? 'Published' : 'Draft'}
                                </Badge>
                                {post.status === 'published' && post.linkedin_post_id && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={openLinkedInPost}
                                        className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-1" />
                                        View on LinkedIn
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* LinkedIn-style Post Preview */}
                    <Card className="border border-gray-200 rounded-lg shadow-sm">
                        <CardContent className="p-0">
                            {/* Header */}
                            <div className="flex items-start justify-between p-6 pb-4">
                                <div className="flex items-start gap-3">
                                    <Avatar className="w-14 h-14">
                                        <AvatarImage src={getUserProfileImage()} alt="LinkedIn User Image" />
                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-lg">
                                            {getUserInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900 text-base">{getUserDisplayName()}</h3>
                                            <svg className="w-4 h-4 text-blue-600" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M8 0L10.2 5.8H16L11.6 9.4L13.8 15.2L8 11.6L2.2 15.2L4.4 9.4L0 5.8H5.8L8 0Z" />
                                            </svg>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                            <span className="text-blue-600 text-sm font-medium">1st</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-0.5">{user?.headline || "LinkedIn Professional"}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {post.status === 'published' && post.published_at
                                                ? formatDate(post.published_at)
                                                : formatDate(post.created_at)
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100 p-2">
                                    <MoreHorizontal className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="px-6 pb-4">
                                <div className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap">
                                    {post.content}
                                </div>
                            </div>

                            {/* Engagement */}
                            <div className="px-6 py-3 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-1">
                                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                                                <ThumbsUp className="w-3 h-3 text-white" />
                                            </div>
                                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                                <Heart className="w-3 h-3 text-white" />
                                            </div>
                                            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                                                <span className="text-white text-xs font-bold">👏</span>
                                            </div>
                                        </div>
                                        <span className="hover:text-blue-600 hover:underline cursor-pointer">
                                            {post.status === 'published' ? Math.floor(Math.random() * 500) + 50 : '0'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="hover:text-blue-600 hover:underline cursor-pointer">
                                            {post.status === 'published' ? Math.floor(Math.random() * 50) + 5 : '0'} comments
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-around py-2 border-t border-gray-100">
                                <Button variant="ghost" size="lg" className="flex-1 text-gray-600 hover:bg-gray-50 py-3">
                                    <ThumbsUp className="w-5 h-5 mr-2" />
                                    <span className="text-base font-medium">Like</span>
                                </Button>
                                <Button variant="ghost" size="lg" className="flex-1 text-gray-600 hover:bg-gray-50 py-3">
                                    <MessageSquare className="w-5 h-5 mr-2" />
                                    <span className="text-base font-medium">Comment</span>
                                </Button>
                                <Button variant="ghost" size="lg" className="flex-1 text-gray-600 hover:bg-gray-50 py-3">
                                    <Send className="w-5 h-5 mr-2" />
                                    <span className="text-base font-medium">Share</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    {(post.source_prompt || post.source_brains || post.source_asset_id) && (
                        <div className="mt-6 space-y-4">
                            <h4 className="text-sm font-medium text-gray-900">Post Metadata</h4>

                            <div className="grid gap-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">Created:</span>
                                    <span className="text-gray-900">{formatDate(post.created_at)}</span>
                                </div>

                                {post.published_at && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Published:</span>
                                        <span className="text-gray-900">{formatDate(post.published_at)}</span>
                                    </div>
                                )}

                                {post.source_prompt && (
                                    <div className="space-y-2">
                                        <span className="text-sm text-gray-600">Source Prompt:</span>
                                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                                            {post.source_prompt}
                                        </div>
                                    </div>
                                )}

                                {post.source_brains && post.source_brains.length > 0 && (
                                    <div className="space-y-2">
                                        <span className="text-sm text-gray-600">Used Brains:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {post.source_brains.map((brain, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {brain}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {post.source_asset_id && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-gray-600">Asset ID:</span>
                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                            {post.source_asset_id}
                                        </code>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <DeleteConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Post"
                description={`Are you sure you want to delete this post? ${post.status === 'published' ? 'This will also attempt to remove it from LinkedIn.' : ''}`}
                isLoading={isDeleting}
            />
        </>
    )
}
