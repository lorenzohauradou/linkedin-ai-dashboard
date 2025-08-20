"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { PostPreviewModal } from '../../../components/ui/post-preview-modal'
import { Calendar, Clock, ExternalLink, Eye, Trash2, MessageSquare, ThumbsUp, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

interface Post {
    id: string
    content: string
    status: 'draft' | 'published'
    created_at: string
    published_at?: string
    linkedin_post_id?: string
    source_prompt?: string
    source_brains?: string[]
    source_asset_id?: string
}

interface PostStats {
    total_posts: number
    draft_posts: number
    published_posts: number
}

export default function GeneratedPostsPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [stats, setStats] = useState<PostStats>({ total_posts: 0, draft_posts: 0, published_posts: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

    useEffect(() => {
        fetchPosts()
    }, [filter])

    const fetchPosts = async () => {
        try {
            setIsLoading(true)
            const statusParam = filter === 'all' ? '' : `?status=${filter}`
            const response = await fetch(`/api/user-posts${statusParam}`)

            if (response.ok) {
                const data = await response.json()
                setPosts(data.posts || [])
                setStats(data.stats || { total_posts: 0, draft_posts: 0, published_posts: 0 })
            } else {
                console.error('Error fetching posts:', response.statusText)
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeletePost = async (postId: string) => {
        try {
            const response = await fetch(`/api/user-posts/${postId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                // Rimuovi il post dalla lista locale
                setPosts(prev => prev.filter(p => p.id !== postId))
                // Aggiorna le statistiche
                fetchPosts()
            } else {
                const error = await response.json()
                alert(`Errore eliminazione: ${error.detail || 'Unknown error'}`)
            }
        } catch (error) {
            alert(`Errore eliminazione: ${error}`)
        }
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return formatDistanceToNow(date, { addSuffix: true, locale: it })
        } catch {
            return "Data non valida"
        }
    }

    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content
        return content.substring(0, maxLength) + '...'
    }

    const openLinkedInPost = (post: Post) => {
        if (post.linkedin_post_id) {
            const linkedinUrl = `https://www.linkedin.com/feed/update/${post.linkedin_post_id}/`
            window.open(linkedinUrl, '_blank')
        }
    }

    const filteredPosts = posts.filter(post => {
        if (filter === 'all') return true
        return post.status === filter
    })

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Generated Posts</h1>
                    <p className="text-gray-600">Loading your posts...</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-48 bg-gray-100 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4 mb-2">
                <div className="space-y-3">
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                        Generated Posts
                    </h1>
                    <div className="w-12 h-[2px] bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
                </div>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    Manage and review all your AI-generated LinkedIn posts.
                    <br />
                    <span className="text-gray-400 text-base">Click on any post to preview it in LinkedIn style.</span>
                </p>
            </div>

            {/* Stats Overview */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-8 border border-gray-100/80 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                        <h2 className="text-base font-medium text-gray-800 tracking-wide">Posts Overview</h2>
                        <p className="text-xs text-gray-500 font-light">
                            {stats.total_posts} total posts created
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-light text-gray-900 mb-1">{stats.total_posts}</div>
                        <div className="text-xs text-gray-500 font-light">Total Posts</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-light text-green-600 mb-1">{stats.published_posts}</div>
                        <div className="text-xs text-gray-500 font-light">Published</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-light text-gray-600 mb-1">{stats.draft_posts}</div>
                        <div className="text-xs text-gray-500 font-light">Drafts</div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'all'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        All Posts ({stats.total_posts})
                    </button>
                    <button
                        onClick={() => setFilter('published')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'published'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Published ({stats.published_posts})
                    </button>
                    <button
                        onClick={() => setFilter('draft')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'draft'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Drafts ({stats.draft_posts})
                    </button>
                </div>
            </div>

            {/* Posts Grid */}
            {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {filter === 'all' ? 'No posts yet' : `No ${filter} posts`}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {filter === 'all'
                            ? 'Start creating your first LinkedIn post with AI assistance.'
                            : `You don't have any ${filter} posts yet.`
                        }
                    </p>
                    <Button
                        onClick={() => window.location.href = '/dashboard/post-generator'}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Create Your First Post
                    </Button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <Card
                            key={post.id}
                            className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-gray-100 hover:border-gray-200 group"
                            onClick={() => setSelectedPost(post)}
                        >
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <Badge
                                            variant={post.status === 'published' ? 'default' : 'secondary'}
                                            className={post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                                        >
                                            {post.status === 'published' ? 'Published' : 'Draft'}
                                        </Badge>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedPost(post)
                                                }}
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            {post.status === 'published' && post.linkedin_post_id && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        openLinkedInPost(post)
                                                    }}
                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeletePost(post.id)
                                                }}
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Content Preview */}
                                    <div className="space-y-3">
                                        <div className="text-sm text-gray-900 leading-relaxed line-clamp-4">
                                            {truncateContent(post.content)}
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="space-y-2 pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            <span>Created {formatDate(post.created_at)}</span>
                                        </div>
                                        {post.published_at && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <span>Published {formatDate(post.published_at)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Engagement Preview (for published posts) */}
                                    {post.status === 'published' && (
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp className="w-3 h-3" />
                                                    <span>{Math.floor(Math.random() * 100) + 10}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="w-3 h-3" />
                                                    <span>{Math.floor(Math.random() * 20) + 2}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Send className="w-3 h-3" />
                                                    <span>{Math.floor(Math.random() * 10) + 1}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Post Preview Modal */}
            <PostPreviewModal
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                post={selectedPost}
                onDelete={handleDeletePost}
            />
        </div>
    )
}
