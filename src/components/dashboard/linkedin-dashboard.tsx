"use client"

import { LinkedInSidebar } from "./linkedin-sidebar"
import { PostPreview } from "./post-preview"
import { PostCreator } from "./post-creator"
import { MultiAngleSelector } from "./multi-angle-selector"
import { WelcomeMessage } from "./welcome-message"
import { MobileHeader } from "./mobile-header"
import { MobilePostCreator } from "./mobile-post-creator"
import { SidebarProvider } from "../ui/sidebar"

import { usePostGeneration } from "../../hooks/use-post-generation"
import { useDashboardState } from "../../hooks/use-dashboard-state"
import { useResponsive } from "../../hooks/use-responsive"

export function LinkedInDashboard() {
  const {
    postOptions,
    selectedPost,
    currentAsset,
    currentAssetId,
    selectedPostId,
    isGenerating,
    generatePost,
    selectOption,
    resetState,
    setIsGenerating
  } = usePostGeneration()

  const {
    viewMode,
    hasInteracted,
    handleInteraction,
    navigateToPreview,
    navigateToMultiAngle
  } = useDashboardState()

  const {
    isMobile,
    isDesktop,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    isPostCreatorOpen,
    openPostCreator,
    closePostCreator,
    handleOverlayClick
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

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader
        onMenuToggle={toggleSidebar}
        onCreatePost={openPostCreator}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex min-h-screen">
        <SidebarProvider defaultOpen={isDesktop}>
          <div className={`
            ${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'relative'}
            ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
            transition-transform duration-300 ease-in-out
            ${isMobile ? 'w-80' : 'w-auto'}
          `}>
            <LinkedInSidebar />
          </div>

          {isMobile && isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20"
              onClick={closeSidebar}
            />
          )}

          <div className="flex-1 flex flex-col min-h-screen">
            <div className="flex-1 flex justify-center p-4 md:p-6">
              <div className="w-full max-w-2xl">
                {!hasInteracted ? (
                  <WelcomeMessage onCreatePost={openPostCreator} />
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

        {isDesktop && (
          <div className="w-[400px] bg-white border-l border-gray-200 flex-shrink-0 min-h-screen overflow-y-auto">
            <PostCreator
              onGenerate={handlePostGeneration}
              postOptions={postOptions}
              onSelectOption={handleOptionSelect}
              selectedPostId={selectedPostId}
              onInteraction={handleInteraction}
              isGenerating={isGenerating}
              onGeneratingChange={setIsGenerating}
              onResetState={resetState}
              viewMode={viewMode}
            />
          </div>
        )}
      </div>

      <MobilePostCreator
        isOpen={isPostCreatorOpen}
        onClose={closePostCreator}
        onGenerate={handlePostGeneration}
        postOptions={postOptions}
        onSelectOption={handleOptionSelect}
        selectedPostId={selectedPostId}
        isGenerating={isGenerating}
        onInteraction={handleInteraction}
        onGeneratingChange={setIsGenerating}
        onResetState={resetState}
        viewMode={viewMode}
      />
    </div>
  )
}
