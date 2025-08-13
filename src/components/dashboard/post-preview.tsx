"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Heart, Send, MoreHorizontal, ThumbsUp, Wand2, MessageSquare, Sparkles, Edit } from 'lucide-react'
import { useAuth } from "../../contexts/auth-context"
import { PublishSuccess } from "../ui/publish-success"

interface PostPreviewProps {
  initialContent?: string
  currentAsset?: File | null
  currentAssetId?: string | null
}

export function PostPreview({ initialContent = "Write your brief idea here...", currentAsset, currentAssetId }: PostPreviewProps) {
  const { user } = useAuth()
  const [postContent, setPostContent] = useState(initialContent)
  const [isTextSelected, setIsTextSelected] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [showVibeMenu, setShowVibeMenu] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [customInstruction, setCustomInstruction] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [changes, setChanges] = useState<{
    wordDiff?: { type: 'unchanged' | 'removed' | 'added', text: string }[],
    added: string[],
    removed: string[],
    modified: string[],
    fullTextReplacement?: string
  }>({
    added: [],
    removed: [],
    modified: []
  })
  const [assetPreview, setAssetPreview] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [publishResult, setPublishResult] = useState<{ url?: string, content?: string }>({})

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Helper per ottenere i dati dell'utente con fallback
  const getUserDisplayName = () => {
    if (!user) return "User"
    return `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || "User"
  }

  const getUserInitials = () => {
    if (!user) return "U"
    const firstName = user.first_name || ""
    const lastName = user.last_name || ""
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }
    if (firstName) return firstName.charAt(0).toUpperCase()
    if (user.email) return user.email.charAt(0).toUpperCase()
    return "U"
  }

  const getUserProfileImage = () => {
    return user?.profile_picture_url || "/icons/emoji1.png"
  }

  // Aggiorna il contenuto quando cambia initialContent (solo all'inizializzazione)
  useEffect(() => {
    if (initialContent && initialContent !== postContent) {
      // Solo se non stiamo nel mezzo di un enhancement
      if (!isHighlighted && changes.added.length === 0) {
        setPostContent(initialContent)
      }
    }
  }, [initialContent])

  // Gestisci asset preview
  useEffect(() => {
    if (currentAsset) {
      if (currentAsset.type.startsWith('image/')) {
        // Per le immagini usiamo FileReader
        const reader = new FileReader()
        reader.onload = (e) => {
          setAssetPreview(e.target?.result as string)
        }
        reader.readAsDataURL(currentAsset)
      } else if (currentAsset.type.startsWith('video/')) {
        // Per i video usiamo createObjectURL (più efficiente per file grandi)
        console.log('📹 Creating video preview for:', currentAsset.name, currentAsset.type, currentAsset.size, 'bytes')
        const videoUrl = URL.createObjectURL(currentAsset)
        console.log('📹 Video URL created:', videoUrl)
        setAssetPreview(videoUrl)

        // Cleanup quando il componente viene smontato
        return () => {
          URL.revokeObjectURL(videoUrl)
        }
      } else {
        setAssetPreview(null)
      }
    } else {
      setAssetPreview(null)
    }
  }, [currentAsset])

  // Auto-resize textarea quando cambia il contenuto
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      textarea.style.height = Math.max(60, textarea.scrollHeight) + 'px'
    }
  }, [postContent])

  const handleTextSelection = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Delay per assicurarsi che la selezione sia completata
    setTimeout(() => {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = textarea.value.substring(start, end).trim()

      // Solo se c'è una selezione di almeno 1 caratteri (rimosso il limite del testo completo)
      if (selected.length >= 1) {
        setSelectedText(selected)
        setIsHighlighted(true)
        setShowVibeMenu(true)
        setChanges({ added: [], removed: [], modified: [] })
        console.log("✅ Text selected:", selected)
      } else if (selected.length === 0) {
        // Solo se non c'è selezione - chiudi popup
        if (showVibeMenu) {
          setShowVibeMenu(false)
          setIsHighlighted(false)
          setSelectedText("")
          console.log("❌ Selection cleared")
        }
      }

    }, 50)
  }

  const acceptChanges = () => {
    // Se abbiamo fullTextReplacement (miglioramento parziale), usalo direttamente
    if (changes.fullTextReplacement) {
      console.log("🔄 Using full text replacement:", {
        before: postContent,
        after: changes.fullTextReplacement
      })

      setPostContent(changes.fullTextReplacement)
    }
    // Se abbiamo un word diff completo, ricostruisci il testo da quello
    else if (changes.wordDiff && changes.wordDiff.length > 0) {
      const newContent = changes.wordDiff
        .map(wordChange => {
          if (wordChange.type === 'removed') {
            return '' // Rimuovi le parole marcate come rimosse
          }
          return wordChange.text // Mantieni parole unchanged e aggiungi quelle added
        })
        .join('')

      console.log("🔄 Word diff content update:", {
        before: postContent,
        after: newContent,
        wordDiffLength: changes.wordDiff.length
      })

      setPostContent(newContent)
    }
    // Fallback al metodo precedente
    else if (changes.removed.length > 0 && changes.added.length > 0) {
      const removedText = changes.removed[0]
      const addedText = changes.added[0]

      // Normalizza i testi rimuovendo spazi extra e newline
      const normalizedRemovedText = removedText.trim()
      const normalizedContent = postContent.trim()

      console.log("🔍 Debug accept changes:", {
        removedText,
        addedText,
        normalizedRemovedText,
        currentContent: postContent,
        normalizedContent,
        removedTextFound: normalizedContent.includes(normalizedRemovedText)
      })

      // Approccio più robusto: trova e sostituisci il testo
      let updatedContent = postContent

      // Prova prima con il testo normalizzato
      if (postContent.includes(normalizedRemovedText)) {
        updatedContent = postContent.replace(normalizedRemovedText, addedText)
        console.log("🔥 Using normalized text replacement")
      }
      // Prova con il testo originale (con newline)
      else if (postContent.includes(removedText)) {
        updatedContent = postContent.replace(removedText, addedText)
        console.log("🔥 Using original text replacement")
      }
      // Ultimo tentativo: sostituisci tutto il contenuto se è molto simile
      else if (normalizedContent === normalizedRemovedText) {
        updatedContent = addedText
        console.log("🔥 Full content replacement")
      } else {
        console.log("❌ No replacement method worked")
      }

      console.log("🔄 Content update:", {
        before: postContent,
        after: updatedContent,
        changed: postContent !== updatedContent
      })

      setPostContent(updatedContent)
    } else {
      console.log("❌ No changes to apply:", { changes })
    }

    // Reset completo dello stato
    setIsHighlighted(false)
    setChanges({ added: [], removed: [], modified: [] })
    setSelectedText("")
    setShowVibeMenu(false)
    setShowCustomInput(false)
    setCustomInstruction("")

    console.log("✅ Changes accepted and state reset")
  }

  // Funzione per calcolare diff intelligente parola per parola
  const calculateWordDiff = (original: string, enhanced: string) => {
    const originalWords = original.split(/(\s+)/)
    const enhancedWords = enhanced.split(/(\s+)/)

    const changes: { type: 'unchanged' | 'removed' | 'added', text: string }[] = []

    let i = 0, j = 0

    while (i < originalWords.length || j < enhancedWords.length) {
      if (i >= originalWords.length) {
        // Parole aggiunte alla fine
        changes.push({ type: 'added', text: enhancedWords[j] })
        j++
      } else if (j >= enhancedWords.length) {
        // Parole rimosse dalla fine
        changes.push({ type: 'removed', text: originalWords[i] })
        i++
      } else if (originalWords[i] === enhancedWords[j]) {
        // Parole identiche
        changes.push({ type: 'unchanged', text: originalWords[i] })
        i++
        j++
      } else {
        // Cerca se la parola originale esiste più avanti nel testo enhanced
        const foundInEnhanced = enhancedWords.findIndex((word, idx) => idx > j && word === originalWords[i])

        if (foundInEnhanced !== -1) {
          // Aggiungi le parole prima della corrispondenza come "aggiunte"
          for (let k = j; k < foundInEnhanced; k++) {
            changes.push({ type: 'added', text: enhancedWords[k] })
          }
          j = foundInEnhanced + 1
          changes.push({ type: 'unchanged', text: originalWords[i] })
          i++
        } else {
          // Cerca se la parola enhanced esiste più avanti nel testo originale
          const foundInOriginal = originalWords.findIndex((word, idx) => idx > i && word === enhancedWords[j])

          if (foundInOriginal !== -1) {
            // Rimuovi le parole prima della corrispondenza
            for (let k = i; k < foundInOriginal; k++) {
              changes.push({ type: 'removed', text: originalWords[k] })
            }
            i = foundInOriginal
          } else {
            // Sostituzione semplice
            changes.push({ type: 'removed', text: originalWords[i] })
            changes.push({ type: 'added', text: enhancedWords[j] })
            i++
            j++
          }
        }
      }
    }

    return changes
  }

  const enhanceSelection = async (enhanceType: string, customInstruction: string = "") => {
    if (!selectedText) return

    setShowVibeMenu(false)
    setIsThinking(true)

    try {
      console.log('🚀 Enhancing selection:', { selectedText, enhanceType, customInstruction })

      const response = await fetch('/api/enhance-selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedText,
          fullText: postContent,
          enhanceType,
          customInstruction
        })
      })

      const data = await response.json()

      if (data.success && data.enhanced_text) {
        console.log('✅ Enhancement successful:', {
          original: selectedText,
          enhanced: data.enhanced_text,
          originalInContent: postContent.includes(selectedText)
        })

        // Calcola diff intelligente nel contesto del post completo
        const updatedFullText = postContent.replace(selectedText.trim(), data.enhanced_text.trim())
        const wordDiff = calculateWordDiff(postContent, updatedFullText)

        setChanges({
          wordDiff, // Word diff del post completo
          added: [data.enhanced_text],
          removed: [selectedText.trim()],
          modified: [],
          fullTextReplacement: updatedFullText // Salva il testo completo per l'accept
        })

        console.log('🎯 Word diff calculated:', wordDiff)
      } else {
        console.error('❌ Enhancement failed:', data.error || 'Unknown error')
        // Fallback semplice
        const normalizedSelectedText = selectedText.trim()
        setChanges({
          added: [`${normalizedSelectedText} (enhanced)`],
          removed: [normalizedSelectedText],
          modified: []
        })
      }
    } catch (error) {
      console.error('❌ Error enhancing selection:', error)
      // Fallback semplice
      const normalizedSelectedText = selectedText.trim()
      setChanges({
        added: [`${normalizedSelectedText} (enhanced)`],
        removed: [normalizedSelectedText],
        modified: []
      })
    } finally {
      setIsThinking(false)
    }

    // Reset input personalizzato
    if (customInstruction) {
      setCustomInstruction("")
    }
  }

  const handlePublish = async () => {
    try {
      console.log("📤 Publishing post to LinkedIn...")
      console.log("📝 Content:", postContent)
      console.log("🖼️ Asset ID:", currentAssetId)

      // Prepara FormData per l'invio
      const formData = new FormData()
      formData.append('post_content', postContent)
      formData.append('post_type', 'post')

      if (currentAssetId) {
        formData.append('asset_id', currentAssetId)
      }

      const response = await fetch('/api/publish-post', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Post published successfully:", result)

        // Mostra modal di successo invece dell'alert
        setPublishResult({
          url: result.url,
          content: postContent
        })
        setShowSuccessModal(true)
      } else {
        const error = await response.json()
        console.error("❌ Publish failed:", error)
        alert(`Errore pubblicazione: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("❌ Publish error:", error)
      alert(`Errore pubblicazione: ${error}`)
    }
  }

  const handleEditPost = () => {
    setIsEditMode(true)
    // Seleziona tutto il testo
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.select()
        textareaRef.current.focus()
        handleTextSelection()
        setIsTextSelected(true)
      }
    }, 100)
  }

  const renderChangesView = () => {
    // Rendering delle modifiche preservando la formattazione originale
    const renderTextWithChanges = () => {
      // Se abbiamo un word diff, usalo per rendering inline preservando spazi
      if (changes.wordDiff && changes.wordDiff.length > 0) {
        return (
          <>
            {changes.wordDiff.map((wordChange, index) => {
              if (wordChange.type === 'unchanged') {
                return <span key={index} className="text-gray-900">{wordChange.text}</span>
              } else if (wordChange.type === 'removed') {
                return (
                  <span
                    key={index}
                    className="bg-red-100 text-red-800 px-1 rounded-sm line-through decoration-red-500 decoration-2"
                  >
                    {wordChange.text}
                  </span>
                )
              } else if (wordChange.type === 'added') {
                return (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-1 rounded-sm font-medium"
                  >
                    {wordChange.text}
                  </span>
                )
              }
              return null
            })}
          </>
        )
      }

      // Rendering pulito per sostituzioni semplici preservando newline e spazi
      if (changes.removed.length > 0 && changes.added.length > 0) {
        const removedText = changes.removed[0]
        const addedText = changes.added[0]
        const displayText = postContent

        // Trova la posizione del testo da sostituire
        const beforeText = displayText.substring(0, displayText.indexOf(removedText))
        const afterText = displayText.substring(displayText.indexOf(removedText) + removedText.length)

        return (
          <>
            <span className="text-gray-900">{beforeText}</span>
            <span className="bg-red-100 text-red-800 px-1 rounded-sm line-through decoration-red-500 decoration-2">
              {removedText}
            </span>
            <span className="bg-green-100 text-green-800 px-1 rounded-sm font-medium">
              {addedText}
            </span>
            <span className="text-gray-900">{afterText}</span>
          </>
        )
      }

      return <span className="text-gray-900">{postContent}</span>
    }

    return (
      <>
        {renderTextWithChanges()}

        {/* Bottoni di controllo posizionati sotto il testo */}
        <div className="flex gap-3 pt-4 mt-4 border-t border-gray-100">
          <Button
            size="sm"
            onClick={acceptChanges}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIsHighlighted(false)
              setChanges({ added: [], removed: [], modified: [] })
            }}
            className="px-4 py-2 rounded-lg border-gray-300 hover:bg-gray-100 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Card className="relative bg-transparent border border-gray-200 rounded-lg shadow-sm max-w-none">
        <CardContent className="relative z-10 bg-white/80 backdrop-blur-sm p-0">
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-14 h-14">
                <AvatarImage src={getUserProfileImage()} alt="LinkedIn User Image" />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-lg">{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-base">{getUserDisplayName()}</h3>
                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0L10.2 5.8H16L11.6 9.4L13.8 15.2L8 11.6L2.2 15.2L4.4 9.4L0 5.8H5.8L8 0Z" />
                  </svg>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="text-blue-600 text-sm font-medium">1st</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{user?.headline || "LinkedIn Professional"}</p>
                <p className="text-sm text-gray-500 mt-0.5">now</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditPost}
                      className="h-8 px-3 py-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 flex items-center gap-1.5"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit Post</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <div className="text-sm">
                      <p className="font-medium">💡 Pro Tip</p>
                      <p className="text-gray-400">
                        Highlight specific parts you want to modify or click to select the entire post
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100 p-2">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="px-6 pb-4 relative">
            {/* Thinking section sopra il post quando sta processando */}
            {isThinking && selectedText && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 text-blue-600 mb-3">
                  <span className="text-sm font-medium">AI is thinking...</span>
                </div>
              </div>
            )}

            <div className="relative">
              {(changes.added.length > 0 || changes.removed.length > 0) ? (
                // Mostra i cambiamenti AI mantenendo la struttura della textarea
                <div
                  className="w-full min-h-[60px] text-base text-gray-900 leading-relaxed resize-none bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    whiteSpace: 'pre-wrap', // Mantiene spazi e newline come nella textarea
                    wordWrap: 'break-word'
                  }}
                >
                  {renderChangesView()}
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  className="w-full min-h-[60px] text-base text-gray-900 leading-relaxed resize-none bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-500"
                  placeholder={currentAsset ? "Add a description for your media..." : "Write your brief idea here..."}
                  value={postContent}
                  onChange={(e) => {
                    setPostContent(e.target.value)
                    // Reset height to auto to get the natural height
                    e.target.style.height = 'auto'
                    // Set height to scrollHeight to expand as needed
                    e.target.style.height = Math.max(60, e.target.scrollHeight) + 'px'
                  }}
                  onMouseUp={handleTextSelection}
                  onKeyUp={handleTextSelection}
                  onSelect={handleTextSelection}
                  rows={3}
                  style={{
                    height: 'auto',
                    minHeight: '60px',
                    maxHeight: 'none',
                    background: isHighlighted && selectedText && selectedText !== postContent.trim()
                      ? 'linear-gradient(90deg, rgba(253, 224, 71, 0.2) 0%, rgba(254, 240, 138, 0.2) 100%)'
                      : 'transparent'
                  }}
                />
              )}

              {assetPreview && (
                <div className="mt-4">
                  <div className="relative rounded-lg overflow-hidden border border-gray-200">
                    {currentAsset?.type.startsWith('video/') ? (
                      <video
                        src={assetPreview}
                        className="w-full h-auto max-h-96 object-cover"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={assetPreview}
                        alt="Asset preview"
                        className="w-full h-auto max-h-96 object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {currentAsset?.type.startsWith('video/') ? 'Video' : 'Image'}
                    </div>
                  </div>
                </div>
              )}
            </div>



            {/* Custom Instruction Input */}
            {showCustomInput && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Custom Instruction</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCustomInput(false)}
                      className="h-8 w-8 p-0"
                    >
                      ✕
                    </Button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Tell AI how to modify: <span className="font-medium">"{selectedText.substring(0, 50)}..."</span>
                  </p>

                  <textarea
                    value={customInstruction}
                    onChange={(e) => setCustomInstruction(e.target.value)}
                    placeholder="e.g., Add a call to action, Make it more personal, Add statistics..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    autoFocus
                  />

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => enhanceSelection('custom', customInstruction)}
                      disabled={!customInstruction.trim()}
                      className="flex-1"
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      Apply Enhancement
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCustomInput(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                    <ThumbsUp className="w-3 h-3 text-white" />
                  </div>
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white text-xs font-bold">👏</span>
                  </div>
                </div>
                <span className="hover:text-blue-600 hover:underline cursor-pointer">393</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hover:text-blue-600 hover:underline cursor-pointer">59 comments</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-around py-2 border-t border-gray-100">
            <Button variant="ghost" size="lg" className="flex-1 text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:text-white hover:shadow-lg hover:scale-90 py-4 rounded-xl max-w-md transition-all duration-300" onClick={handlePublish}>
              <Send className="w-5 h-5 mr-2" />
              <span className="text-base font-medium">Publish Post</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {showVibeMenu && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/10"
            onClick={() => {
              setShowVibeMenu(false)
              setIsHighlighted(false) // Rimuovi anche evidenziazione
              setChanges({ added: [], removed: [], modified: [] }) // Reset changes
              setSelectedText("") // Reset selezione
            }}
          />

          <div className="fixed top-[40%] left-1/2 transform -translate-x-1/2 z-[9999] w-72">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-gray-900">
              <div className="flex items-center justify-between mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowVibeMenu(false)
                    setIsHighlighted(false)
                    setSelectedText("")
                  }}
                  className="h-6 w-6 p-0 absolute top-1 right-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => enhanceSelection('professional')}
                    className="flex items-center gap-2 p-3 text-xs text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    <MessageSquare className="w-3 h-3 text-gray-600" />
                    <span className="font-medium text-gray-700">Improve grammar</span>
                  </button>
                  <button
                    onClick={() => enhanceSelection('engaging')}
                    className="flex items-center gap-2 p-3 text-xs text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    <Sparkles className="w-3 h-3 text-gray-600" />
                    <span className="font-medium text-gray-700">Translate to English</span>
                  </button>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium px-1 mb-2">Make it more</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => enhanceSelection('engaging')}
                      className="flex items-center gap-2 p-3 text-xs text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="font-medium text-gray-700">Engaging</span>
                    </button>
                    <button
                      onClick={() => enhanceSelection('sarcastic')}
                      className="flex items-center gap-2 p-3 text-xs text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span className="font-medium text-gray-700">Humorous</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => enhanceSelection('creative')}
                      className="flex items-center gap-2 p-3 text-xs text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span className="font-medium text-gray-700">Creative</span>
                    </button>
                    <button
                      onClick={() => enhanceSelection('sarcastic')}
                      className="flex items-center gap-2 p-3 text-xs text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="font-medium text-gray-700">Sarcastic</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Give me instructions..."
                      className="w-full bg-gray-50 min-h-[60px] text-gray-900 placeholder-gray-500 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                      value={customInstruction}
                      onChange={(e) => setCustomInstruction(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customInstruction.trim()) {
                          enhanceSelection('custom', customInstruction)
                        }
                      }}
                    />
                    {customInstruction.trim() && (
                      <button
                        onClick={() => enhanceSelection('custom', customInstruction)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <PublishSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        postUrl={publishResult.url}
        postContent={publishResult.content}
      />
    </>
  )
}
