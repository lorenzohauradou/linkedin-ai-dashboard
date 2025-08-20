"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { usePostGeneration } from "../hooks/use-post-generation"
import { useDashboardState } from "../hooks/use-dashboard-state"
import { useResponsive } from "../hooks/use-responsive"

interface PostGeneratorContextType {
    // State
    postOptions: any[]
    selectedPost: string
    currentAsset: File | null
    currentAssetId: string | null
    selectedPostId: string
    isGenerating: boolean
    viewMode: any
    hasInteracted: boolean
    expandedPostId: string | null
    previousVersion: string | null

    // Actions
    handlePostGeneration: (input: any) => Promise<void>
    handleOptionSelect: (option: any) => void
    handleResetState: () => void
    handleInteraction: () => void
    setIsGenerating: (generating: boolean) => void
    setExpandedPostId: (id: string | null) => void
    handleEditPost: (input: { message: string, uploadedFile?: File | null }) => void
}

const PostGeneratorContext = createContext<PostGeneratorContextType | undefined>(undefined)

export function usePostGeneratorContext() {
    const context = useContext(PostGeneratorContext)
    if (context === undefined) {
        throw new Error('usePostGeneratorContext must be used within a PostGeneratorProvider')
    }
    return context
}

interface PostGeneratorProviderProps {
    children: ReactNode
}

export function PostGeneratorProvider({ children }: PostGeneratorProviderProps) {
    const {
        postOptions,
        selectedPost,
        currentAsset,
        currentAssetId,
        selectedPostId,
        isGenerating,
        previousVersion,
        generatePost,
        selectOption,
        resetState,
        setIsGenerating,
        setSelectedPost,
        setCurrentAsset
    } = usePostGeneration()

    const [expandedPostId, setExpandedPostId] = useState<string | null>(null)

    const {
        viewMode,
        hasInteracted,
        handleInteraction,
        navigateToPreview,
        navigateToMultiAngle,
        resetDashboard
    } = useDashboardState()

    const {
        isMobile,
        isPostCreatorOpen,
        closePostCreator
    } = useResponsive()

    const handlePostGeneration = async (input: any) => {
        handleInteraction()
        const result = await generatePost(input)

        if (result.success) {
            if (result.mode === 'multi-angle') {
                navigateToMultiAngle()
            } else {
                navigateToPreview()
            }
            // Chiudi il mobile post creator solo dopo successo
            if (isMobile && isPostCreatorOpen) {
                closePostCreator()
            }
        }
    }

    const handleOptionSelect = (option: any) => {
        selectOption(option)
        navigateToPreview()
    }

    const handleResetState = () => {
        resetState()
        resetDashboard()
        setExpandedPostId(null)
    }

    const handleEditPost = (input: { message: string, uploadedFile?: File | null }) => {
        handleInteraction()

        // Mostra direttamente il contenuto dell'utente nella preview
        setSelectedPost(input.message)

        // Se c'è un file, impostalo come asset corrente
        if (input.uploadedFile) {
            setCurrentAsset(input.uploadedFile)
        } else {
            setCurrentAsset(null)
        }

        // Naviga alla preview
        navigateToPreview()

        // Chiudi il mobile post creator se aperto
        if (isMobile && isPostCreatorOpen) {
            closePostCreator()
        }
    }

    const contextValue: PostGeneratorContextType = {
        // State
        postOptions,
        selectedPost,
        currentAsset,
        currentAssetId,
        selectedPostId,
        isGenerating,
        viewMode,
        hasInteracted,
        expandedPostId,
        previousVersion,

        // Actions
        handlePostGeneration,
        handleOptionSelect,
        handleResetState,
        handleInteraction,
        setIsGenerating,
        setExpandedPostId,
        handleEditPost
    }

    return (
        <PostGeneratorContext.Provider value={contextValue}>
            {children}
        </PostGeneratorContext.Provider>
    )
}
