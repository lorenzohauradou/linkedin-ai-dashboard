/**
 * Custom hook per gestire la generazione dei post
 */

import { useState, useCallback } from 'react'
import { PostOption, ActiveMode, OutputStyle } from '../types/post'
import { generateFallbackOptions, processPostContent } from '../lib/post-utils'

interface PostGenerationInput {
  message: string
  selectedBrains: string[]
  activeMode: ActiveMode
  outputStyle: OutputStyle
  uploadedFile?: File | null
  generateMultipleAngles: boolean
}

export const usePostGeneration = () => {
  const [postOptions, setPostOptions] = useState<PostOption[]>([])
  const [selectedPost, setSelectedPost] = useState<string>("")
  const [currentAsset, setCurrentAsset] = useState<File | null>(null)
  const [currentAssetId, setCurrentAssetId] = useState<string | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [previousVersion, setPreviousVersion] = useState<string | null>(null)

  const uploadAsset = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      // endpoint per analisi asset temporanea
      const uploadResponse = await fetch('/api/assets/analyze-temp', {
        method: 'POST',
        body: formData
      })

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json()
        const tempId = uploadData.temp_analysis?.temp_id
        setCurrentAssetId(tempId)
        return tempId
      } else {
        const errorData = await uploadResponse.json()
        console.error('Temporary analysis failed:', errorData)
        return null
      }
    } catch (error) {
      console.error('Temporary analysis error:', error)
      return null
    }
  }

  const generatePost = useCallback(async (input: PostGenerationInput) => {
    setIsGenerating(true)
    setCurrentAsset(input.uploadedFile || null)

    try {
      let assetId: string | null = null

      // Upload file se presente
      if (input.uploadedFile) {
        assetId = await uploadAsset(input.uploadedFile)
      }

      const generatePayload = {
        content: input.message,
        contentType: input.activeMode,
        selectedBrains: input.selectedBrains,
        contentUrl: input.activeMode === 'link' ? input.message : null,
        assetId: assetId,
        outputStyle: input.outputStyle,
        generateMultipleAngles: input.generateMultipleAngles
      }

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
        if (data.success && data.options && data.options.length > 0) {
          setPostOptions(data.options)
          setSelectedPostId("")
          return { success: true, mode: 'multi-angle' as const, options: data.options }
        } else {
          console.warn('⚠️ API failed or no options, using fallback:', data)
          const fallbackOptions = generateFallbackOptions(input)
          setPostOptions(fallbackOptions)
          setSelectedPostId("")
          return { success: true, mode: 'multi-angle' as const, options: fallbackOptions }
        }
      } else {
        if (data.success && data.content) {
          setSelectedPost(data.content)
          setPostOptions([])
          return { success: true, mode: 'single' as const, content: data.content }
        } else {
          console.error('Invalid response format for single post:', data)
          const fallbackContent = input.message || "Your single post will appear here..."
          setSelectedPost(fallbackContent)
          setPostOptions([])
          return { success: true, mode: 'single' as const, content: fallbackContent }
        }
      }
    } catch (error) {
      console.error('Error calling API:', error)
      const fallbackOptions = generateFallbackOptions(input)
      setPostOptions(fallbackOptions)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const selectOption = useCallback((option: PostOption) => {
    const processedContent = processPostContent(option.content)
    
    
    
    // Salva la versione precedente se stiamo cambiando post
    if (selectedPost && selectedPost !== processedContent) {
      setPreviousVersion(selectedPost)
    } else if (option.previousVersion) {
      setPreviousVersion(option.previousVersion)
    } else {
      setPreviousVersion(null)
    }
    
    setSelectedPost(processedContent)
    setSelectedPostId(option.id)
    setPostOptions([])
    return processedContent
  }, [selectedPost])

  const resetState = useCallback(() => {
    setPostOptions([])
    setSelectedPost("")
    setCurrentAsset(null)
    setCurrentAssetId(null)
    setSelectedPostId("")
    setIsGenerating(false)
    setPreviousVersion(null)
  }, [])

  return {
    // State
    postOptions,
    selectedPost,
    currentAsset,
    currentAssetId,
    selectedPostId,
    isGenerating,
    previousVersion,
    
    // Actions
    generatePost,
    selectOption,
    resetState,
    
    // Setters per controllo esterno se necessario
    setPostOptions,
    setSelectedPost,
    setSelectedPostId,
    setIsGenerating,
    setCurrentAsset
  }
}
