"use client"

import { PostPreview } from "../../../components/dashboard/post-generator/post-preview"
import { MultiAngleSelector } from "../../../components/dashboard/post-generator/multi-angle-selector"
import { WelcomeMessage } from "../../../components/dashboard/post-generator/welcome-message"
import { MobilePostCreator } from "../../../components/dashboard/post-generator/mobile-post-creator"
import { usePostGeneratorContext } from "../../../contexts/post-generator-context"
import { useResponsiveContext } from "../../../contexts/responsive-context"

export default function PostGeneratorPageRoute() {
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

    const handleCreatePost = openPostCreator

    return (
        <>
            {!hasInteracted ? (
                <WelcomeMessage onCreatePost={handleCreatePost} />
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
        </>
    )
}
