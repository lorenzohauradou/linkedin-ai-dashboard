"use client"

import { PostCreator } from "../../../components/dashboard/post-generator/post-creator"
import { usePostGeneratorContext } from "../../../contexts/post-generator-context"

export function PostGeneratorRightPanel() {
    const {
        postOptions,
        selectedPost,
        selectedPostId,
        isGenerating,
        handlePostGeneration,
        handleOptionSelect,
        handleResetState,
        handleInteraction,
        setIsGenerating,
        setExpandedPostId,
        handleEditPost
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
            onEditPost={handleEditPost}
        />
    )
}
