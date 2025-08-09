"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import { Send, Plus, Paperclip, Image, Smile, Youtube, MessageSquare, FileText, Wand2, Brain, Zap, FileImage, ChevronDown } from 'lucide-react'

interface Brain {
  id: string
  name: string
  description: string
  is_active: boolean
}

interface PostCreatorProps {
  onGenerate: (input: {
    message: string
    selectedBrains: string[]
    activeMode: 'text' | 'media' | 'link'
  }) => void
}

export function PostCreator({ onGenerate }: PostCreatorProps) {
  const [message, setMessage] = useState("")
  const [brains, setBrains] = useState<Brain[]>([])
  const [selectedBrains, setSelectedBrains] = useState<string[]>([])
  const [activeMode, setActiveMode] = useState<'text' | 'media' | 'link'>('text')
  const [showBrainsDropdown, setShowBrainsDropdown] = useState(false)

  useEffect(() => {
    fetchBrains()
  }, [])

  // Chiudi dropdown quando clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showBrainsDropdown && !(event.target as Element).closest('.relative')) {
        setShowBrainsDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showBrainsDropdown])

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

  const handleSubmit = () => {
    if (!message.trim()) return

    onGenerate({
      message,
      selectedBrains,
      activeMode
    })

    // Opzionalmente clear il messaggio dopo invio
    // setMessage("")
  }

  return (
    <div className="h-full flex flex-col w-full bg-white">
      {/* Header con SVG LinkedIn */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-t-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="white" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Command Panel</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={activeMode === 'link' ? 'default' : 'outline'}
            size="sm"
            className="h-10 text-xs"
            onClick={() => setActiveMode('link')}
          >
            <Youtube className="w-4 h-4 mr-1.5" />
            Link/Video
          </Button>
          <Button
            variant={activeMode === 'media' ? 'default' : 'outline'}
            size="sm"
            className="h-10 text-xs"
            onClick={() => setActiveMode('media')}
          >
            <FileImage className="w-4 h-4 mr-1.5" />
            Upload Media
          </Button>
          <Button variant="outline" size="sm" className="h-10 text-xs">
            <MessageSquare className="w-4 h-4 mr-1.5" />
            Reddit Post
          </Button>
          <Button variant="outline" size="sm" className="h-10 text-xs">
            <FileText className="w-4 h-4 mr-1.5" />
            Document
          </Button>
        </div>
      </div>

      {/* Active Brains - Dropdown elegante */}
      <div className="p-4 border-b border-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Active Brains</h3>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between h-10 text-xs"
            onClick={() => setShowBrainsDropdown(!showBrainsDropdown)}
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
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {brains.map((brain, index) => (
                <button
                  key={brain.id || `brain-${index}`}
                  onClick={() => {
                    toggleBrain(brain.id)
                    // Non chiudere il dropdown per permettere selezioni multiple
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 ${selectedBrains.includes(brain.id) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                >
                  <div className={`w-2 h-2 rounded-full ${selectedBrains.includes(brain.id) ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  <span className="truncate">{brain.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mostra brains selezionati */}
        {selectedBrains.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedBrains.map(brainId => {
              const brain = brains.find(b => b.id === brainId)
              return brain ? (
                <Badge
                  key={brain.id}
                  variant="default"
                  className="text-xs py-0.5 px-2"
                >
                  {brain.name}
                </Badge>
              ) : null
            })}
          </div>
        )}
      </div>

      {/* Output Directives */}
      <div className="p-4 border-b border-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Output Style</h3>
        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" size="sm" className="justify-start h-9 text-xs">
            <Zap className="w-3 h-3 mr-2" />
            Short & Punchy
          </Button>
          <Button variant="outline" size="sm" className="justify-start h-9 text-xs">
            <FileText className="w-3 h-3 mr-2" />
            Structured Post
          </Button>
          <Button variant="outline" size="sm" className="justify-start h-9 text-xs">
            <MessageSquare className="w-3 h-3 mr-2" />
            Story Format
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Create</h3>
          <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
            Write your idea below, select your style, and watch the magic happen.
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="space-y-3">
          <Textarea
            placeholder={activeMode === 'text' ? "Write your brief idea here..." : activeMode === 'link' ? "Paste YouTube, Reddit, or article link..." : "Upload media files..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[80px] max-h-32 resize-none border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-3 px-4 text-sm"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                <Image className="w-4 h-4" />
              </Button>
              <span className="text-xs text-gray-400">{message.length}/2000</span>
            </div>
            <Button
              size="sm"
              onClick={handleSubmit}
              className={`rounded-xl h-9 px-4 transition-all duration-200 ${message.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              disabled={!message.trim()}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
