"use client"

import { useState, useEffect } from "react"
import { PostPreview } from "../../../components/dashboard/post-generator/post-preview"
import { MultiAngleSelector } from "../../../components/dashboard/post-generator/multi-angle-selector"
import { WelcomeMessage } from "../../../components/dashboard/post-generator/welcome-message"
import { MobilePostCreator } from "../../../components/dashboard/post-generator/mobile-post-creator"
import { OnboardingPopup } from "../../../components/dashboard/post-generator/onboarding-popup"
import { usePostGeneratorContext } from "../../../contexts/post-generator-context"
import { useResponsiveContext } from "../../../contexts/responsive-context"
import { useAuth } from "../../../contexts/auth-context"

export default function PostGeneratorPageRoute() {
    const { user, isLoading } = useAuth()
    const [showOnboarding, setShowOnboarding] = useState(false)

    const {
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
        handlePostGeneration,
        handleOptionSelect,
        handleResetState,
        handleInteraction,
        setIsGenerating
    } = usePostGeneratorContext()

    const {
        isPostCreatorOpen,
        openPostCreator,
        closePostCreator
    } = useResponsiveContext()

    // Check if user needs onboarding
    useEffect(() => {
        if (!isLoading && user && user.first_login) {
            // Show onboarding popup after a short delay for better UX
            const timer = setTimeout(() => {
                setShowOnboarding(true)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [user, isLoading])

    const handleCreatePost = openPostCreator

    const handleStartTraining = () => {
        setShowOnboarding(false)
        // Navigation will be handled by the onboarding popup
    }

    const handleSkipOnboarding = () => {
        setShowOnboarding(false)
    }

    return (
        <>
            {!hasInteracted ? (
                <WelcomeMessage onCreatePost={handleCreatePost} />
            ) : viewMode === 'preview' ? (
                <PostPreview
                    initialContent={selectedPost}
                    currentAsset={currentAsset}
                    currentAssetId={currentAssetId}
                    previousVersion={previousVersion || undefined}
                />
            ) : (
                <MultiAngleSelector
                    options={postOptions}
                    onSelectOption={handleOptionSelect}
                    isVisible={viewMode === 'multi-angle'}
                    expandedPostId={expandedPostId}
                />
            )}

            {/* Mobile Post Creator */}
            <MobilePostCreator
                isOpen={isPostCreatorOpen}
                onClose={closePostCreator}
                onGenerate={handlePostGeneration}
                postOptions={postOptions}
                onSelectOption={handleOptionSelect}
                selectedPostId={selectedPostId}
                selectedPost={selectedPost}
                isGenerating={isGenerating}
                onInteraction={handleInteraction}
                onGeneratingChange={setIsGenerating}
                onResetState={handleResetState}
                viewMode={viewMode}
            />

            {/* Onboarding Popup */}
            <OnboardingPopup
                isOpen={showOnboarding}
                onClose={() => setShowOnboarding(false)}
                onStartTraining={handleStartTraining}
                onSkip={handleSkipOnboarding}
            />
        </>
    )
}
