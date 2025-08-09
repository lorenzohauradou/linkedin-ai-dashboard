"use client"

import { useState } from "react"
import { LinkedInSidebar } from "./linkedin-sidebar"
import { PostPreview } from "./post-preview"
import { PostCreator } from "./post-creator"
import { MultiAngleSelector } from "./multi-angle-selector"
import { SidebarProvider } from "../ui/sidebar"

interface PostOption {
  id: string
  angle: string
  content: string
  style: 'takeaways' | 'personal' | 'question' | 'story'
  estimated_engagement: number
}

export function LinkedInDashboard() {
  const [viewMode, setViewMode] = useState<'preview' | 'multi-angle'>('preview')
  const [postOptions, setPostOptions] = useState<PostOption[]>([])
  const [selectedPost, setSelectedPost] = useState<string>("")

  const handlePostGeneration = async (input: {
    message: string
    selectedBrains: string[]
    activeMode: 'text' | 'media' | 'link'
  }) => {
    // Se è solo testo semplice, va direttamente al preview con effetto vibe
    if (input.activeMode === 'text' && input.message.trim().length < 100) {
      setSelectedPost(input.message)
      setViewMode('preview')
    } else {
      // Genera multiple opzioni tramite API
      try {
        const response = await fetch('/api/generate-multi-angle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: input.message,
            contentType: input.activeMode,
            selectedBrains: input.selectedBrains,
            contentUrl: input.activeMode === 'link' ? input.message : null
          })
        })

        const data = await response.json()

        if (data.success && data.options.length > 0) {
          setPostOptions(data.options)
          setViewMode('multi-angle')
        } else {
          // Fallback alla logica mock se l'API fallisce
          console.warn('API failed, using fallback options')
          generateFallbackOptions(input)
        }
      } catch (error) {
        console.error('Error calling multi-angle API:', error)
        generateFallbackOptions(input)
      }
    }
  }

  const generateFallbackOptions = (input: any) => {
    const mockOptions: PostOption[] = [
      {
        id: '1',
        angle: 'Key Takeaways',
        style: 'takeaways',
        content: `🔑 Just analyzed this content and here are the 3 key insights every professional should know:\n\n1. ${input.message}\n2. Implementation requires strategic thinking\n3. The future is collaborative\n\nWhich point resonates most with your experience?`,
        estimated_engagement: 85
      },
      {
        id: '2',
        angle: 'Personal Reflection',
        style: 'personal',
        content: `This really got me thinking about my own journey...\n\n${input.message}\n\nIt reminds me of when I first started in this industry. The challenges seemed overwhelming, but that's where the growth happens.\n\nAnyone else experienced something similar?`,
        estimated_engagement: 72
      },
      {
        id: '3',
        angle: 'Provocative Question',
        style: 'question',
        content: `Controversial take: ${input.message}\n\nBut here's what I think most people miss...\n\nWe're so focused on the obvious benefits that we ignore the potential downsides. What if the opposite approach is actually more effective?\n\nChange my mind 👇`,
        estimated_engagement: 91
      }
    ]

    setPostOptions(mockOptions)
    setViewMode('multi-angle')
  }

  const handleOptionSelect = (option: PostOption) => {
    setSelectedPost(option.content)
    setViewMode('preview')
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <div className="flex-1 flex h-full">
          <LinkedInSidebar />
          <div className="flex-1 flex justify-center p-4 md:p-6 overflow-y-auto">
            <div className="w-full max-w-2xl">
              {viewMode === 'preview' ? (
                <PostPreview initialContent={selectedPost} />
              ) : (
                <MultiAngleSelector
                  options={postOptions}
                  onSelectOption={handleOptionSelect}
                  isVisible={viewMode === 'multi-angle'}
                />
              )}
            </div>
          </div>
        </div>
      </SidebarProvider>
      <div className="w-[400px] bg-white border-l border-gray-200 flex-shrink-0 hidden md:block h-full overflow-y-auto">
        <PostCreator onGenerate={handlePostGeneration} />
      </div>
    </div>
  )
}
