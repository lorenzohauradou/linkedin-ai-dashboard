"use client"

import { useState } from "react"
import { LinkedInSidebar } from "./linkedin-sidebar"
import { PostPreview } from "./post-preview"
import { PostCreator } from "./post-creator-old"
import { MultiAngleSelector } from "./multi-angle-selector"
import { WelcomeMessage } from "./welcome-message"
import { SidebarProvider } from "../ui/sidebar"

import { PostOption, ActiveMode, OutputStyle } from "../../types/post"
import { processPostContent, generateFallbackOptions } from "../../lib/post-utils"

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

        const formData = new FormData()
        formData.append('file', input.uploadedFile)

        const uploadResponse = await fetch('/api/assets/upload', {
          method: 'POST',
          body: formData
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          assetId = uploadData.asset_info?.asset_id
          setCurrentAssetId(assetId) // Salva l'assetId nello state
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

      if (input.generateMultipleAngles) {
        // Modalità multi-angle: mostra le opzioni
        if (data.success && data.options && data.options.length > 0) {
          setPostOptions(data.options)
          setViewMode('multi-angle')
          setSelectedPostId("") // Reset selezione
          setIsGenerating(false) // Stop loading
        } else {
          // Fallback alla logica mock se l'API fallisce
          handleFallbackOptions(input)
        }
      } else {
        // Modalità post singolo: vai direttamente alla preview
        if (data.success && data.content) {
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
      setIsGenerating(false) // Stop loading in case of error
      handleFallbackOptions(input)
    }
  }

  const handleFallbackOptions = (input: any) => {
    const mockOptions = generateFallbackOptions(input)
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
