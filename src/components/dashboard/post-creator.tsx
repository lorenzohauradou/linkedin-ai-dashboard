"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Plus, Image, Youtube, MessageSquare, FileText, Wand2, Brain, Zap, FileImage, ChevronDown } from 'lucide-react'
import { TypewriterPlaceholder } from "../ui/typewriter-placeholder"
import { TypewriterText } from "../ui/typewriter-text"

interface Brain {
  id: string
  name: string
  description: string
  is_active: boolean
}

import { PostOption, OutputStyle, ActiveMode } from "../../types/post"
import { processPostContent, getStyleInfo } from "../../lib/post-utils"

interface PostCreatorProps {
  onGenerate: (input: {
    message: string
    selectedBrains: string[]
    activeMode: ActiveMode
    outputStyle: OutputStyle
    uploadedFile?: File | null
    generateMultipleAngles: boolean
  }) => void
  postOptions?: PostOption[]
  onSelectOption?: (option: PostOption) => void
  selectedPostId?: string
  selectedPost?: string
  onInteraction?: () => void
  isGenerating?: boolean
  onGeneratingChange?: (generating: boolean) => void
  onResetState?: () => void
  viewMode?: 'preview' | 'multi-angle' | 'welcome'
  onExpandedPostChange?: (postId: string | null) => void
}

export function PostCreator({ onGenerate, postOptions = [], onSelectOption, selectedPostId, selectedPost, onInteraction, isGenerating: externalIsGenerating, onGeneratingChange, onResetState, viewMode, onExpandedPostChange }: PostCreatorProps) {
  const [message, setMessage] = useState("")
  const [brains, setBrains] = useState<Brain[]>([])
  const [selectedBrains, setSelectedBrains] = useState<string[]>([])
  const [activeMode, setActiveMode] = useState<ActiveMode>('text')
  const [showBrainsDropdown, setShowBrainsDropdown] = useState(false)
  const [outputStyle, setOutputStyle] = useState<OutputStyle>('short')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState<string>("")
  const isGenerating = externalIsGenerating ?? false
  const setIsGenerating = onGeneratingChange ?? (() => { })
  const [isDragOver, setIsDragOver] = useState(false)
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)
  const [usedPostId, setUsedPostId] = useState<string | null>(null)
  const [generateMultipleAngles, setGenerateMultipleAngles] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Chat history states
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'ai' | 'thinking',
    content: string,
    timestamp: number,
    file?: File
  }>>([])
  const [isThinking, setIsThinking] = useState(false)
  const [generatedOptions, setGeneratedOptions] = useState<PostOption[]>([])
  const [showTypewriterOptions, setShowTypewriterOptions] = useState(false)
  const [animatedPosts, setAnimatedPosts] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchBrains()
  }, [])

  // Chiudi dropdown quando clicchi fuori
  useEffect(() => {
    if (showBrainsDropdown) {
      const closeDropdown = () => setShowBrainsDropdown(false)
      document.addEventListener('click', closeDropdown)
      return () => document.removeEventListener('click', closeDropdown)
    }
  }, [showBrainsDropdown])

  // Reset espansione e selezione quando cambiano le opzioni
  useEffect(() => {
    setExpandedPostId(null)
    setUsedPostId(null)
  }, [postOptions])

  // Notifica quando cambia il post espanso
  useEffect(() => {
    onExpandedPostChange?.(expandedPostId)
  }, [expandedPostId, onExpandedPostChange])

  // Gestisci aggiornamenti postOptions per chat flow (multi-angle)
  useEffect(() => {
    if (postOptions.length > 0) {
      setIsThinking(false)  // Ferma il thinking quando arrivano i post
      if (!showTypewriterOptions) {
        setGeneratedOptions(postOptions)
        setShowTypewriterOptions(true)
        setExpandedPostId(null) // Reset espansione per nuove opzioni
      }
    }
  }, [postOptions, showTypewriterOptions])

  // Gestisci post singoli - aggiungi messaggio AI alla chat quando selectedPost viene aggiornato
  useEffect(() => {
    // Solo se è un post singolo (non generateMultipleAngles) e abbiamo selectedPost
    if (selectedPost && !generateMultipleAngles && isThinking) {
      setIsThinking(false)  // Ferma il thinking

      // Aggiungi il post singolo alla chat come messaggio AI
      setChatHistory(prev => [...prev, {
        type: 'ai',
        content: selectedPost,
        timestamp: Date.now()
      }])
    }
  }, [selectedPost, generateMultipleAngles, isThinking])

  const fetchBrains = async () => {
    try {
      const response = await fetch('/api/brains')
      if (response.ok) {
        const data = await response.json()
        setBrains(data.brains || [])
        // Auto-seleziona i cervelli attivi
        const activeBrains = data.brains?.filter((brain: Brain) => brain.is_active).map((brain: Brain) => brain.id) || []
        setSelectedBrains(activeBrains)
      }
    } catch (error) {
      console.error('Error fetching brains:', error)
    }
  }

  const toggleBrain = (brainId: string) => {
    setSelectedBrains(prev =>
      prev.includes(brainId)
        ? prev.filter(id => id !== brainId)
        : [...prev, brainId]
    )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Controllo dimensione file basato sul tipo
    let maxSize: number
    let fileTypeText: string

    if (file.type.startsWith('image/')) {
      maxSize = 10 * 1024 * 1024 // 10MB per immagini
      fileTypeText = '10MB for images'
    } else if (file.type.startsWith('video/')) {
      maxSize = 100 * 1024 * 1024 // 100MB per video
      fileTypeText = '100MB for videos'
    } else {
      maxSize = 20 * 1024 * 1024 // 20MB per altri file
      fileTypeText = '20MB for documents'
    }

    if (file.size > maxSize) {
      alert(`File is too big. Max ${fileTypeText}.`)
      return
    }
    setUploadedFile(file)
    setActiveMode('media')

    // Attiva l'interazione quando viene caricato un file
    if (onInteraction) onInteraction()

    // Crea preview per immagini e video
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else if (file.type.startsWith('video/')) {
      // Per i video usiamo createObjectURL
      const videoUrl = URL.createObjectURL(file)
      setFilePreview(videoUrl)
    } else {
      setFilePreview(null)
    }
  }

  const removeFile = () => {
    // Cleanup video URL se esiste
    if (filePreview && uploadedFile?.type.startsWith('video/')) {
      URL.revokeObjectURL(filePreview)
    }

    setUploadedFile(null)
    setFilePreview(null)
    setActiveMode('text')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Drag & Drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file) {
      // Verifica tipo di file
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')

      if (isImage || isVideo) {
        // Controlla dimensione basata sul tipo
        let maxSize: number
        let fileTypeText: string

        if (isImage) {
          maxSize = 10 * 1024 * 1024 // 10MB per immagini
          fileTypeText = '10MB for images'
        } else {
          maxSize = 100 * 1024 * 1024 // 100MB per video
          fileTypeText = '100MB for videos'
        }

        if (file.size > maxSize) {
          alert(`File is too big. Max ${fileTypeText}.`)
          return
        }

        setUploadedFile(file)
        setActiveMode('media')

        // Attiva l'interazione
        if (onInteraction) onInteraction()

        // Crea preview per immagini e video
        if (isImage) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setFilePreview(e.target?.result as string)
          }
          reader.readAsDataURL(file)
        } else if (isVideo) {
          // Per i video usiamo createObjectURL
          const videoUrl = URL.createObjectURL(file)
          setFilePreview(videoUrl)
        } else {
          setFilePreview(null)
        }
      } else {
        alert('Please upload an image or video file.')
      }
    }
  }

  const handleSubmit = () => {
    if (!message.trim() && !uploadedFile && !youtubeUrl.trim()) return

    const userMessage = activeMode === 'link' && youtubeUrl ? `${message}\n\nYouTube URL: ${youtubeUrl}` : message

    // Aggiungi messaggio utente alla chat
    setChatHistory(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: Date.now(),
      file: uploadedFile || undefined
    }])

    // Attiva thinking state
    setIsThinking(true)
    setShowTypewriterOptions(false)
    setGeneratedOptions([])

    // Attiva lo stato di loading
    setIsGenerating(true)

    onGenerate({
      message: userMessage,
      selectedBrains,
      activeMode,
      outputStyle,
      uploadedFile,
      generateMultipleAngles
    })

    // Clear il messaggio, file e URL dopo invio
    setMessage("")
    removeFile()
    setYoutubeUrl("")
    setActiveMode('text')
  }

  const handleUsePost = (option: any) => {
    setUsedPostId(option.id)
    setExpandedPostId(option.id) // Assicurati che sia espanso
    onSelectOption?.(option)
  }

  const handleNewChat = () => {
    setChatHistory([])
    setIsThinking(false)
    setShowTypewriterOptions(false)
    setGeneratedOptions([])
    setUsedPostId(null)
    setExpandedPostId(null)
    setAnimatedPosts(new Set())
    setMessage("")
    removeFile()
    setYoutubeUrl("")
    setActiveMode('text')
    // Reset anche il contenuto della preview
    onResetState?.()
  }

  return (
    <div
      className={`h-full flex flex-col w-full bg-white max-h-screen relative ${isDragOver ? 'bg-blue-50' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-t-600 rounded-lg flex items-center justify-center">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">AI Agent Panel</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className="text-gray-500 hover:text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              New chat
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Nascondi i comandi quando ci sono le preview, durante il loading, quando siamo in modalità preview, o quando abbiamo una chat attiva */}
      {postOptions.length === 0 && !isGenerating && viewMode !== 'preview' && chatHistory.length === 0 && (
        <>
          <div className="p-4 border-b border-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <div className="relative group">
                {activeMode === 'link' ? (
                  <div className="w-full">
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full h-10 px-3 text-xs border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        setActiveMode('text')
                        setYoutubeUrl('')
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-10 text-xs justify-start hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => {
                      setActiveMode('link')
                      if (onInteraction) onInteraction()
                    }}
                  >
                    <Youtube className="w-4 h-4 mr-2 text-red-500" />
                    YouTube Link
                  </Button>
                )}
                <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="font-medium mb-1">YouTube Video Analysis</div>
                  <div className="text-gray-300">
                    Insert a YouTube URL to generate LinkedIn posts based on the video content.
                  </div>
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs opacity-50" disabled>
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Reddit
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs opacity-50" disabled>
                  <FileText className="w-3 h-3 mr-1" />
                  Document
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 border-b border-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Active Brains</h3>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between h-10 text-xs touch-manipulation"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowBrainsDropdown(!showBrainsDropdown)
                }}
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span>
                    {selectedBrains.length === 0
                      ? "Select AI Brains"
                      : `${selectedBrains.length} brain${selectedBrains.length > 1 ? 's' : ''} selected`
                    }
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showBrainsDropdown ? 'rotate-180' : ''}`} />
              </Button>

              {showBrainsDropdown && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {brains.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-gray-500">
                      Loading brains...
                    </div>
                  ) : (
                    brains.map((brain, index) => (
                      <button
                        key={brain.id || `brain-${index}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (brain.id) toggleBrain(brain.id)
                        }}
                        className={`w-full text-left px-3 py-3 md:py-2 text-xs hover:bg-gray-50 flex items-center gap-2 touch-manipulation ${brain.id && selectedBrains.includes(brain.id) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${brain.id && selectedBrains.includes(brain.id) ? 'bg-blue-600' : 'bg-gray-300'
                          }`} />
                        <span className="truncate">{brain.name}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {selectedBrains.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedBrains
                  .map(brainId => brains.find(b => b.id === brainId))
                  .filter((brain): brain is Brain => Boolean(brain))
                  .map((brain, index) => (
                    <Badge
                      key={brain.id || `selected-brain-${index}`}
                      variant="default"
                      className="text-xs py-0.5 px-2 touch-manipulation"
                      onClick={() => {
                        if (brain.id) toggleBrain(brain.id)
                      }}
                    >
                      {brain.name}
                      <span className="ml-1 text-gray-400 hover:text-gray-600">×</span>
                    </Badge>
                  ))}
              </div>
            )}
          </div>
          <div className="p-4 border-b border-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Output Style</h3>
            <div className="space-y-2">
              <Button
                variant={outputStyle === 'short' ? 'default' : 'outline'}
                size="sm"
                className="w-full justify-start h-10 text-xs touch-manipulation"
                onClick={() => setOutputStyle('short')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Short & Punchy
              </Button>
              <Button
                variant={outputStyle === 'structured' ? 'default' : 'outline'}
                size="sm"
                className="w-full justify-start h-10 text-xs touch-manipulation"
                onClick={() => setOutputStyle('structured')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Structured Post
              </Button>
              <Button
                variant={outputStyle === 'story' ? 'default' : 'outline'}
                size="sm"
                className="w-full justify-start h-10 text-xs touch-manipulation"
                onClick={() => setOutputStyle('story')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Story Format
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="flex-1 p-4 overflow-y-auto">
        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="space-y-4 mb-6">
            {chatHistory.map((entry, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${entry.type === 'user' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                  <span className="text-white text-xs font-medium">
                    {entry.type === 'user' ? 'U' : 'AI'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className={`rounded-2xl p-4 text-sm ${entry.type === 'user'
                    ? 'bg-blue-500 text-white rounded-tr-md'
                    : 'bg-gray-100 text-gray-800 rounded-tl-md'
                    }`}>
                    {entry.content}
                    {entry.file && (
                      <div className="mt-2 p-2 bg-white/20 rounded-md text-xs">
                        📎 {entry.file.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Thinking State */}
        {isThinking && (
          <div className="flex items-start gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-medium">AI</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-2xl rounded-tl-md p-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  Thinking
                  <span className="flex gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Typewriter Options */}
        {showTypewriterOptions && generatedOptions.length > 0 && (
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-medium">AI</span>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl rounded-tl-md p-4 text-sm text-gray-600">
                  {generatedOptions.length === 1
                    ? "I've generated a post for you. You can use it as is or ask me to modify it:"
                    : `I've generated ${generatedOptions.length} different angles for your post. Select the one that resonates most with you:`
                  }
                </div>
              </div>
            </div>

            {generatedOptions.map((option, index) => {
              const styleInfo = getStyleInfo(option.style)
              const isExpanded = expandedPostId === option.id
              const shouldTruncate = option.content.length > 150
              const previewText = shouldTruncate
                ? option.content.substring(0, 150) + "..."
                : option.content

              return (
                <div key={option.id} className="relative">
                  {!isExpanded ? (
                    // Compact Preview Card
                    <div
                      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                      onClick={() => setExpandedPostId(option.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${styleInfo.color}`}>
                          {styleInfo.label}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {shouldTruncate && <span>Click to read full post</span>}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        <TypewriterText
                          text={previewText}
                          speed={15}
                          delay={index * 800}
                          shouldAnimate={!animatedPosts.has(option.id)}
                          onComplete={() => {
                            setAnimatedPosts(prev => new Set([...prev, option.id]))
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    // Expanded Chat Bubble
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">AI</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-md p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${styleInfo.color}`}>
                              {styleInfo.label}
                            </span>
                            <button
                              onClick={() => setExpandedPostId(null)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                          </div>
                          <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line mb-4">
                            {option.content}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUsePost(option)}
                              className="bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-blue-600 transition-colors"
                            >
                              Use this post
                            </button>
                            <button
                              onClick={() => setExpandedPostId(null)}
                              className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                              Show less
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {postOptions.length > 0 && !isGenerating && !showTypewriterOptions ? (
          <div className="space-y-3">

            {usedPostId && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 font-medium">Post selected</span>
                  <button
                    onClick={() => setUsedPostId(null)}
                    className="text-xs text-blue-600 hover:text-blue-800 underline touch-manipulation"
                  >
                    View all options
                  </button>
                </div>
              </div>
            )}

            {(postOptions.length > 0 ? postOptions : [
              { id: "test1", angle: "Test", content: "Test content", style: "takeaways" as const, estimated_engagement: 85 },
              { id: "test2", angle: "Test 2", content: "Test content 2", style: "personal" as const, estimated_engagement: 75 }
            ])
              .filter(option => usedPostId === null || option.id === usedPostId) // Mostra solo il post usato se selezionato
              .map((option, index) => {
                const isSelected = selectedPostId === option.id
                const styleInfo = getStyleInfo(option.style)
                const isExpanded = expandedPostId === option.id
                const processedContent = processPostContent(option.content)

                return (
                  <div key={option.id} className="mb-3">
                    {!isExpanded ? (
                      // Card compatta
                      <div
                        className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-300 hover:shadow-md transition-all duration-200 touch-manipulation"
                        onClick={() => setExpandedPostId(option.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${styleInfo.color}`}>
                            {styleInfo.label}
                          </span>
                          <span className="text-xs text-gray-400">Click to expand</span>
                        </div>
                        <div
                          className="text-sm text-gray-700 overflow-hidden"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {processedContent.length > 100
                            ? `${processedContent.substring(0, 100)}...`
                            : processedContent
                          }
                        </div>
                      </div>
                    ) : (
                      // Chat bubble espansa
                      <div className="mb-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-medium">AI</span>
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-100 rounded-2xl rounded-tl-md p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                              {processedContent}
                            </div>

                            {/* Buttons sotto il messaggio */}
                            <div className="flex items-center gap-2 mt-2 ml-1">
                              <button
                                onClick={() => handleUsePost(option)}
                                className="bg-blue-500 text-white px-4 py-2 md:py-1.5 rounded-full text-xs font-medium hover:bg-blue-600 transition-colors touch-manipulation"
                              >
                                Use this post
                              </button>
                              {!usedPostId && (
                                <button
                                  onClick={() => setExpandedPostId(null)}
                                  className="p-2 md:p-1.5 rounded-full hover:bg-gray-200 transition-colors touch-manipulation"
                                >
                                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

            {/* Chat input quando un post è selezionato */}
            {usedPostId && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Give me instructions to improve this post..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 md:py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 touch-manipulation"
                  />
                  <button className="bg-blue-500 text-white p-3 md:p-2 rounded-full hover:bg-blue-600 transition-colors touch-manipulation">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Drag & Drop Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-400 rounded-lg z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-blue-600 font-medium text-lg">Drop your file here</p>
            <p className="text-blue-500 text-sm">Images up to 10MB, videos up to 100MB</p>
          </div>
        </div>
      )}

      {uploadedFile && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header con info file e bottone rimuovi */}
            <div className="flex items-center justify-between p-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  {uploadedFile?.type.startsWith('video/') ? (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <Image className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile?.type.startsWith('video/') ? 'Video' : 'Image'}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full touch-manipulation"
              >
                ✕
              </Button>
            </div>

            {filePreview && (
              <div className="relative">
                {uploadedFile?.type.startsWith('video/') ? (
                  <video
                    src={filePreview}
                    className="w-full h-auto max-h-64 object-cover"
                    controls
                    preload="metadata"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={filePreview}
                    alt="Uploaded preview"
                    className="w-full h-auto max-h-64 object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {uploadedFile?.type.startsWith('video/') ? 'Video' : 'Image'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!usedPostId && chatHistory.length === 0 && (
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="space-y-3">
            <div className="relative">
              <Textarea
                placeholder=""
                value={message}
                className="min-h-[80px] max-h-32 resize-none border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-3 px-4 text-base leading-relaxed touch-manipulation"
                onChange={(e) => {
                  setMessage(e.target.value)
                  // Attiva l'interazione quando l'utente inizia a scrivere
                  if (e.target.value.trim().length > 0 && onInteraction) {
                    onInteraction()
                  }
                }}
                onFocus={() => {
                  if (onInteraction) {
                    onInteraction()
                  }
                }}
                rows={3}
              />
              {message.length === 0 && (
                <div className="absolute inset-0 pointer-events-none p-3 text-gray-400">
                  <TypewriterPlaceholder
                    phrases={[
                      "Share a breakthrough moment in your startup journey...",
                      "Upload a screenshot of your MRR growth...",
                      "Share insights about your tech stack...",
                      "Tell us about a challenge you overcame...",
                      "Share your thoughts on AI and entrepreneurship...",
                      "Upload a video demo of your product...",
                      "Share your team's success story...",
                      "Post about your latest feature launch..."
                    ]}
                    typingSpeed={40}
                    pauseDuration={3000}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.mp4,.mov,.avi,.mkv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    fileInputRef.current?.click()
                    if (onInteraction) onInteraction()
                  }}
                  className="h-10 w-10 md:h-8 md:w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md touch-manipulation"
                >
                  <Image className="w-5 h-5 md:w-4 md:h-4" />
                </Button>
                <span className="text-xs text-gray-400">{message.length}/2000</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="multiple-angles"
                  checked={generateMultipleAngles}
                  onChange={(e) => setGenerateMultipleAngles(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="multiple-angles" className="text-sm text-gray-700 font-medium">
                  Multiple Angles
                </label>
              </div>

              <Button
                size="sm"
                onClick={handleSubmit}
                className={`rounded-xl h-10 md:h-9 px-4 transition-all duration-200 touch-manipulation ${(message.trim() || uploadedFile)
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                disabled={!message.trim() && !uploadedFile}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat input quando abbiamo una chat attiva ma nessun post selezionato */}
      {chatHistory.length > 0 && !usedPostId && !isThinking && !showTypewriterOptions && (
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="space-y-3">
            <div className="relative">
              <Textarea
                placeholder="Continue the conversation..."
                value={message}
                className="min-h-[60px] max-h-32 resize-none border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-3 px-4 text-base leading-relaxed"
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.mp4,.mov,.avi,.mkv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  <Image className="w-4 h-4" />
                </Button>
              </div>
              <Button
                size="sm"
                onClick={handleSubmit}
                className={`rounded-xl h-9 px-4 transition-all duration-200 ${message.trim() || uploadedFile
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                disabled={!message.trim() && !uploadedFile}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pannello per modalità preview */}
      {viewMode === 'preview' && (
        <div className="p-4">
        </div>
      )}
    </div>
  )
}
