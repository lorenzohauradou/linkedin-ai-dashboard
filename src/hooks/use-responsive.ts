/**
 * Custom hook per gestire lo stato responsive della dashboard
 */

import { useState, useEffect, useCallback } from 'react'

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isPostCreatorOpen, setIsPostCreatorOpen] = useState(false)

  // Gestione breakpoints
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      
      // Auto-chiudi sidebar su mobile
      if (width < 768) {
        setIsSidebarOpen(false)
      }
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  // Gestione sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  // Gestione post creator mobile
  const openPostCreator = useCallback(() => {
    setIsPostCreatorOpen(true)
    // Chiudi sidebar su mobile quando apri post creator
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [isMobile])

  const closePostCreator = useCallback(() => {
    setIsPostCreatorOpen(false)
  }, [])

  // Reset degli stati al cambio di breakpoint per evitare stati inconsistenti
  useEffect(() => {
    if (!isMobile && isPostCreatorOpen) {
      setIsPostCreatorOpen(false)
    }
  }, [isMobile, isPostCreatorOpen])

  // Auto-chiudi overlay quando si clicca fuori (mobile)
  const handleOverlayClick = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
      setIsPostCreatorOpen(false)
    }
  }, [isMobile])

  return {
    // Screen info
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    
    // Sidebar state
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    
    // Post creator state
    isPostCreatorOpen,
    openPostCreator,
    closePostCreator,
    
    // Utils
    handleOverlayClick
  }
}
