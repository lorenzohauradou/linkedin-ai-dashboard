/**
 * Custom hook per gestire lo stato globale della dashboard
 */

import { useState, useCallback } from 'react'

export type ViewMode = 'preview' | 'multi-angle' | 'welcome'

export const useDashboardState = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('welcome')
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)

  const handleInteraction = useCallback(() => {
    setHasInteracted(true)
  }, [])

  const navigateToPreview = useCallback(() => {
    setViewMode('preview')
    setHasInteracted(true)
  }, [])

  const navigateToMultiAngle = useCallback(() => {
    setViewMode('multi-angle')
    setHasInteracted(true)
  }, [])

  const navigateToWelcome = useCallback(() => {
    setViewMode('welcome')
  }, [])

  const resetDashboard = useCallback(() => {
    setViewMode('welcome')
    setHasInteracted(false)
  }, [])

  return {
    // State
    viewMode,
    hasInteracted,
    
    // Actions
    setViewMode,
    handleInteraction,
    navigateToPreview,
    navigateToMultiAngle,
    navigateToWelcome,
    resetDashboard
  }
}
