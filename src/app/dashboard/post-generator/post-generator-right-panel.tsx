"use client"

import { PostCreator } from "../../../components/dashboard/post-generator/post-creator"
import { usePostGeneratorContext } from "../../../contexts/post-generator-context"

export function PostGeneratorRightPanel() {
    const {
        postOptions,
        selectedPost,
        selectedPostId,
        isGenerating,
        viewMode,
        expandedPostId,
        handlePostGeneration,
        handleOptionSelect,
        handleResetState,
        handleInteraction,
        setIsGenerating,
        setExpandedPostId
    } = usePostGeneratorContext()

    return (
        <PostCreator
            onGenerate={handlePostGeneration}
            postOptions={postOptions}
            onSelectOption={handleOptionSelect}
            selectedPostId={selectedPostId}
            selectedPost={selectedPost}
            onInteraction={handleInteraction}
            isGenerating={isGenerating}
            onGeneratingChange={setIsGenerating}
            onResetState={handleResetState}
            onExpandedPostChange={setExpandedPostId}
        />
    )
}
