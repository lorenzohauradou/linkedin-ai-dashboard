"use client"

import { useState } from "react"
import { LinkedInSidebar } from "./linkedin-sidebar"
import { PostPreview } from "./post-preview"
import { PostCreator } from "./post-creator"
import { MultiAngleSelector } from "./multi-angle-selector"
import { WelcomeMessage } from "./welcome-message"
import { SidebarProvider } from "../ui/sidebar"

import { PostOption, ActiveMode, OutputStyle } from "../../types/post"

// Funzione helper per processare il contenuto del post
const processPostContent = (content: string): string => {
  if (!content) return content

  // Rimuovi virgolette all'inizio e alla fine
  let processed = content.trim()
  if (processed.startsWith('"') && processed.endsWith('"')) {
    processed = processed.slice(1, -1)
  }
  if (processed.startsWith("'") && processed.endsWith("'")) {
    processed = processed.slice(1, -1)
  }

  // Converti escape sequences in veri line break
  processed = processed.replace(/\\n/g, '\n')

  // Aggiungi spazi eleganti: doppio line break dopo paragrafi
  processed = processed.replace(/\n\n/g, '\n\n')

  return processed.trim()
}

export function LinkedInDashboard() {
  const [viewMode, setViewMode] = useState<'preview' | 'multi-angle' | 'welcome'>('welcome')
  const [postOptions, setPostOptions] = useState<PostOption[]>([])
  const [selectedPost, setSelectedPost] = useState<string>("")
  const [currentAsset, setCurrentAsset] = useState<File | null>(null)
  const [currentAssetId, setCurrentAssetId] = useState<string | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<string>("")
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const handlePostGeneration = async (input: {
    message: string
    selectedBrains: string[]
    activeMode: ActiveMode
    outputStyle: OutputStyle
    uploadedFile?: File | null
    generateMultipleAngles: boolean
  }) => {
    // Marca che l'utente ha interagito con pannello a dx
    setHasInteracted(true)

    // Attiva loading
    setIsGenerating(true)

    // Salva l'asset corrente
    setCurrentAsset(input.uploadedFile || null)

    // Genera sempre multiple opzioni tramite API
    try {
      let assetId: string | null = null

      // Se c'è un file, caricalo prima
      if (input.uploadedFile) {
        console.log('📤 Frontend: Uploading file:', input.uploadedFile.name, input.uploadedFile.size, 'bytes')

        const formData = new FormData()
        formData.append('file', input.uploadedFile)

        const uploadResponse = await fetch('/api/assets/upload', {
          method: 'POST',
          body: formData
        })

        console.log('📥 Upload response status:', uploadResponse.status)

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          assetId = uploadData.asset_info?.asset_id
          setCurrentAssetId(assetId) // Salva l'assetId nello state
          console.log('✅ Asset uploaded successfully, ID:', assetId)
          console.log('📋 Full upload response:', uploadData)
        } else {
          const errorData = await uploadResponse.json()
          console.error('❌ Upload failed:', errorData)
        }
      }

      const generatePayload = {
        content: input.message,
        contentType: input.activeMode,
        selectedBrains: input.selectedBrains,
        contentUrl: input.activeMode === 'link' ? input.message : null,
        assetId: assetId,
        generateMultipleAngles: input.generateMultipleAngles
      }

      console.log('🚀 Frontend: Generating posts with payload:', generatePayload)

      // Usa endpoint diverso basato sulla modalità
      const endpoint = input.generateMultipleAngles ? '/api/generate-multi-angle' : '/api/generate-post'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(generatePayload)
      })

      const data = await response.json()
      console.log('🔍 API Response:', data) // Debug log

      if (input.generateMultipleAngles) {
        // Modalità multi-angle: mostra le opzioni
        if (data.success && data.options && data.options.length > 0) {
          console.log('✅ Setting post options:', data.options) // Debug log
          setPostOptions(data.options)
          setViewMode('multi-angle')
          setSelectedPostId("") // Reset selezione
          setIsGenerating(false) // Stop loading
        } else {
          // Fallback alla logica mock se l'API fallisce
          console.warn('⚠️ API failed or no options, using fallback:', data)
          generateFallbackOptions(input)
        }
      } else {
        // Modalità post singolo: vai direttamente alla preview
        if (data.success && data.content) {
          console.log('✅ Setting single post content:', data.content)
          setSelectedPost(data.content)
          setPostOptions([]) // Clear any previous options
          setViewMode('preview')
          setIsGenerating(false) // Stop loading
        } else {
          console.error('Invalid response format for single post:', data)
          // Fallback: genera un mock post singolo
          setSelectedPost(input.message || "Your single post will appear here...")
          setPostOptions([])
          setViewMode('preview')
          setIsGenerating(false) // Stop loading
        }
      }
    } catch (error) {
      console.error('Error calling API:', error)
      setIsGenerating(false) // Stop loading in case of error
      generateFallbackOptions(input)
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
    setViewMode('preview') // Mantieni preview mode, mostra opzioni nella chat
    setSelectedPostId("") // Reset selezione
    setIsGenerating(false) // Stop loading for fallback
  }

  const handleOptionSelect = (option: PostOption) => {
    setHasInteracted(true)
    // Processa il contenuto prima di passarlo alla preview
    const processedContent = processPostContent(option.content)
    setSelectedPost(processedContent)
    setSelectedPostId(option.id)
    setViewMode('preview')

    // Pulisci il pannello destro per non dare fastidio
    setPostOptions([])
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarProvider defaultOpen={true}>
        <div className="flex-1 flex min-h-screen">
          <LinkedInSidebar />
          <div className="flex-1 flex justify-center p-4 md:p-6">
            <div className="w-full max-w-2xl">
              {!hasInteracted ? (
                <WelcomeMessage />
              ) : viewMode === 'preview' ? (
                <PostPreview
                  initialContent={selectedPost}
                  currentAsset={currentAsset}
                  currentAssetId={currentAssetId}
                />
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
      <div className="w-[400px] bg-white border-l border-gray-200 flex-shrink-0 hidden md:block min-h-screen overflow-y-auto">
        <PostCreator
          onGenerate={handlePostGeneration}
          postOptions={postOptions}
          onSelectOption={handleOptionSelect}
          selectedPostId={selectedPostId}
          onInteraction={() => setHasInteracted(true)}
          isGenerating={isGenerating}
          onGeneratingChange={setIsGenerating}
          viewMode={viewMode}
        />
      </div>
    </div>
  )
}
