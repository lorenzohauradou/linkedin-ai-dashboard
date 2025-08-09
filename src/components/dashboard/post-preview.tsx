"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Heart, Send, MoreHorizontal, ThumbsUp, Wand2, MessageSquare, RotateCcw, Copy, Layout, Sparkles } from 'lucide-react'

interface VibeAction {
  id: string
  label: string
  icon: React.ReactNode
  description: string
}

const VIBE_ACTIONS: VibeAction[] = [
  {
    id: 'enhance-short',
    label: 'Enhance Post (Short)',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Make it concise and punchy'
  },
  {
    id: 'enhance-long',
    label: 'Enhance Post (Long)',
    icon: <Wand2 className="w-4 h-4" />,
    description: 'Develop into detailed post'
  },
  {
    id: 'custom',
    label: 'Custom Instruction',
    icon: <MessageSquare className="w-4 h-4" />,
    description: 'Add specific changes'
  },
  {
    id: 'carousel',
    label: 'Create Carousel',
    icon: <Layout className="w-4 h-4" />,
    description: 'Turn into slide deck'
  }
]

interface PostPreviewProps {
  initialContent?: string
}

export function PostPreview({ initialContent = "Write your brief idea here..." }: PostPreviewProps) {
  const [postContent, setPostContent] = useState(initialContent)
  const [isTextSelected, setIsTextSelected] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 })
  const [showVibeMenu, setShowVibeMenu] = useState(false)
  const [customInstruction, setCustomInstruction] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [changes, setChanges] = useState<{ added: string[], removed: string[], modified: string[] }>({
    added: [],
    removed: [],
    modified: []
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Aggiorna il contenuto quando cambia initialContent
  useEffect(() => {
    if (initialContent && initialContent !== postContent) {
      setPostContent(initialContent)
      // Se è una nuova idea breve, evidenziala in giallo e apri il popup automaticamente
      if (initialContent.length < 100 && initialContent !== "Write your brief idea here...") {
        console.log("Setting highlighted and opening menu for:", initialContent)
        setIsHighlighted(true)
        setSelectedText(initialContent) // Imposta tutto il testo come selezionato
        // Usa un timeout più lungo e forza l'apertura
        setTimeout(() => {
          console.log("Opening vibe menu")
          setShowVibeMenu(true)
        }, 100)
      }
    }
  }, [initialContent, postContent])

  const handleTextSelection = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    if (start !== end) {
      const selected = textarea.value.substring(start, end).trim()
      if (selected.length > 0) {
        console.log("Manual text selection:", selected)
        setSelectedText(selected)
        setIsHighlighted(true) // Evidenzia il testo selezionato
        setShowVibeMenu(true) // Apri il menu per la selezione manuale

        // Reset dei changes precedenti
        setChanges({ added: [], removed: [], modified: [] })
      }
    } else {
      // Se non c'è selezione, chiudi tutto
      if (showVibeMenu) {
        setShowVibeMenu(false)
        setIsHighlighted(false)
        setSelectedText("")
      }
    }
  }

  const handleVibeAction = async (actionId: string) => {
    if (actionId === 'custom') {
      setShowCustomInput(true)
      setShowVibeMenu(false)
    } else {
      setIsHighlighted(true)
      setShowVibeMenu(false)

      try {
        const response = await fetch('/api/enhance-post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            selectedText,
            enhanceType: actionId.replace('enhance-', ''), // 'short' o 'long'
            selectedBrains: [] // TODO: passare i cervelli selezionati
          })
        })

        const data = await response.json()

        if (data.success) {
          setChanges(data.changes)
          // Aggiorna il contenuto con quello enhanced
          // setPostContent(data.enhanced_content) // Se necessario
        } else {
          console.error('Failed to enhance:', data.error)
          // Fallback alla logica mock
          setChanges({
            added: ['AI-enhanced content (fallback)'],
            removed: ['original rough text'],
            modified: ['improved version']
          })
        }
      } catch (error) {
        console.error('Error calling enhance API:', error)
        // Fallback alla logica mock
        setChanges({
          added: ['AI-enhanced content (fallback)'],
          removed: ['original rough text'],
          modified: ['improved version']
        })
      }
    }
  }

  const handleCustomInstruction = async () => {
    if (!customInstruction.trim()) return

    setIsHighlighted(true)
    setShowCustomInput(false)

    try {
      const response = await fetch('/api/enhance-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedText,
          enhanceType: 'custom',
          customInstruction,
          selectedBrains: [] // TODO: passare i cervelli selezionati
        })
      })

      const data = await response.json()

      if (data.success) {
        setChanges(data.changes)
      } else {
        console.error('Failed to apply custom instruction:', data.error)
        // Fallback
        setChanges({
          added: [`Modified with: ${customInstruction}`],
          removed: [],
          modified: [selectedText]
        })
      }
    } catch (error) {
      console.error('Error calling custom instruction API:', error)
      // Fallback
      setChanges({
        added: [`Modified with: ${customInstruction}`],
        removed: [],
        modified: [selectedText]
      })
    }
  }

  const acceptChanges = () => {
    // Applica i cambiamenti al postContent solo ora
    if (changes.removed.length > 0 && changes.added.length > 0) {
      const updatedContent = postContent.replace(changes.removed[0], changes.added[0])
      setPostContent(updatedContent)
    }

    setIsHighlighted(false)
    setChanges({ added: [], removed: [], modified: [] })
    setSelectedText("") // Reset della selezione
  }

  const handleSelectionEnhancement = async (enhanceType: string) => {
    if (!selectedText) return

    setShowVibeMenu(false)

    try {
      console.log('Enhancing selection:', { selectedText, enhanceType, fullText: postContent })

      const response = await fetch('/api/enhance-selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedText: selectedText,
          fullText: postContent,
          enhanceType: enhanceType
        })
      })

      const data = await response.json()

      if (data.success) {

        setChanges({
          added: [data.enhanced_text],
          removed: [data.original_text],
          modified: []
        })
      } else {
        console.error('Enhancement failed:', data.error)
        // Fallback con enhancement locale
        const enhanced = selectedText + ` (${enhanceType})`
        setChanges({
          added: [enhanced],
          removed: [selectedText],
          modified: []
        })
      }
    } catch (error) {
      console.error('Error enhancing selection:', error)
      // Fallback con enhancement locale
      const enhanced = selectedText + ` (${enhanceType})`
      setChanges({
        added: [enhanced],
        removed: [selectedText],
        modified: []
      })
    }
  }

  const handlePublish = () => {
    console.log("Publish post")
  }

  const renderChangesView = () => {
    // Ricostruisci il testo completo mostrando le modifiche inline
    const renderTextWithChanges = () => {
      if (changes.removed.length === 0 && changes.added.length === 0) {
        return <span>{postContent}</span>
      }

      // Usa sempre il postContent originale per mostrare i changes
      const displayText = postContent

      // Se c'è una sostituzione, mostra il testo originale con evidenziazione
      if (changes.removed.length > 0 && changes.added.length > 0) {
        const removedText = changes.removed[0]
        const addedText = changes.added[0]

        // Trova la posizione del testo rimosso nel contenuto originale
        const parts = displayText.split(removedText)

        return (
          <div className="text-base leading-relaxed">
            {parts.map((part, index) => (
              index < parts.length - 1 ? (
                <span key={index}>
                  {part}
                  <span
                    className="relative text-gray-900 line-through font-medium px-1 py-0.5 rounded-sm mr-1"
                    style={{
                      background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.3) 0%, rgba(248, 113, 113, 0.3) 100%)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {removedText}
                  </span>
                  <span
                    className="relative text-gray-900 font-medium px-1 py-0.5 rounded-sm"
                    style={{
                      background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.3) 0%, rgba(74, 222, 128, 0.3) 100%)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {addedText}
                  </span>
                </span>
              ) : <span key={index}>{part}</span>
            ))}
          </div>
        )
      }

      return <span>{displayText}</span>
    }

    return (
      <div className="space-y-3">
        <div className="min-h-[120px] p-2">
          {renderTextWithChanges()}
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <Button size="sm" onClick={acceptChanges} className="bg-green-600 hover:bg-green-700 text-white">
            Accept Changes
          </Button>
          <Button size="sm" variant="outline" onClick={() => {
            setIsHighlighted(false)
            setChanges({ added: [], removed: [], modified: [] })
          }}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="relative bg-transparent border border-gray-200 rounded-lg shadow-sm max-w-none overflow-hidden">
      <CardContent className="relative z-10 bg-white/80 backdrop-blur-sm p-0">
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-14 h-14">
              <AvatarImage src="/icons/emoji1.png" alt="Linkedin User Image" />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-lg">LH</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 text-base">LORENZO</h3>
                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0L10.2 5.8H16L11.6 9.4L13.8 15.2L8 11.6L2.2 15.2L4.4 9.4L0 5.8H5.8L8 0Z" />
                </svg>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="text-blue-600 text-sm font-medium">1st</span>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">Bali, Indonesia</p>
              <p className="text-sm text-gray-500 mt-0.5">now</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100 p-2">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 pb-4 relative">
          <div className="relative">
            {/* Mostro sempre il textarea, ma gestisco l'evidenziazione diversamente */}
            {(changes.added.length > 0 || changes.removed.length > 0) ? (
              // Mostra i cambiamenti AI
              <div className="min-h-[120px] text-base text-gray-900 leading-relaxed p-2">
                {renderChangesView()}
              </div>
            ) : isHighlighted && selectedText === postContent ? (
              // Evidenziazione completa per idee iniziali brevi
              <div className="min-h-[120px] text-base text-gray-900 leading-relaxed p-3 relative">
                <div className="relative inline-block">
                  <span
                    className="relative bg-gradient-to-r from-yellow-300 to-yellow-200 bg-opacity-50 px-1 py-0.5 text-gray-900 font-medium rounded-sm"
                    style={{
                      background: 'linear-gradient(90deg, rgba(253, 224, 71, 0.4) 0%, rgba(254, 240, 138, 0.4) 100%)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {postContent}
                  </span>
                </div>
              </div>
            ) : (
              // Textarea normale con possibile evidenziazione parziale 
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  className="w-full min-h-[120px] text-base text-gray-900 leading-relaxed resize-none bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-500"
                  placeholder="Write your brief idea here..."
                  value={postContent}
                  onChange={(e) => {
                    setPostContent(e.target.value)
                    e.target.style.height = 'auto'
                    e.target.style.height = e.target.scrollHeight + 'px'
                  }}
                  onSelect={handleTextSelection}
                  onMouseUp={handleTextSelection}
                  rows={5}
                  style={{ height: 'auto' }}
                />

                {/* Overlay per evidenziazione parziale se necessario */}
                {isHighlighted && selectedText !== postContent && selectedText && (
                  <div className="absolute inset-0 pointer-events-none p-3">
                    <div className="text-base leading-relaxed whitespace-pre-wrap">
                      {postContent.split(selectedText).map((part, index, array) => (
                        index < array.length - 1 ? (
                          <span key={index}>
                            {part}
                            <span
                              className="bg-gradient-to-r from-yellow-300 to-yellow-200 bg-opacity-50 px-1 py-0.5 rounded-sm"
                              style={{
                                background: 'linear-gradient(90deg, rgba(253, 224, 71, 0.4) 0%, rgba(254, 240, 138, 0.4) 100%)',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              {selectedText}
                            </span>
                          </span>
                        ) : <span key={index}>{part}</span>
                      ))}
                    </div>
                  </div>
                )}
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
                    onClick={handleCustomInstruction}
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

      {/* Vibe Menu Popup - Sotto la preview come SuperX */}
      {showVibeMenu && (
        <>
          {/* Overlay per chiudere cliccando fuori */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowVibeMenu(false)
              setIsHighlighted(false) // Rimuovi anche evidenziazione
              setChanges({ added: [], removed: [], modified: [] }) // Reset changes
              setSelectedText("") // Reset selezione
            }}
          />

          {/* Popup menu stile SuperX */}
          <div className="absolute top-full mt-3 left-4 right-4 z-50">
            <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-medium text-white">turn this into a</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowVibeMenu(false)
                    setIsHighlighted(false)
                  }}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  ✕
                </Button>
              </div>

              {/* Due colonne di azioni stile SuperX */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleVibeAction('enhance-short')}
                    className="flex items-center gap-2 p-3 text-sm text-left bg-gray-800 hover:bg-blue-600 rounded-md transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">An engaging hook</span>
                  </button>
                  <button
                    onClick={() => handleVibeAction('enhance-long')}
                    className="flex items-center gap-2 p-3 text-sm text-left bg-gray-800 hover:bg-blue-600 rounded-md transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">More details</span>
                  </button>
                </div>

                <div className="text-xs text-gray-400 px-1 py-1">Make it more</div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSelectionEnhancement('engaging')}
                    className="flex items-center gap-2 p-3 text-sm text-left bg-gray-800 hover:bg-green-600 rounded-md transition-colors"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span className="font-medium">Engaging</span>
                  </button>
                  <button
                    onClick={() => handleSelectionEnhancement('professional')}
                    className="flex items-center gap-2 p-3 text-sm text-left bg-gray-800 hover:bg-purple-600 rounded-md transition-colors"
                  >
                    <Layout className="w-4 h-4" />
                    <span className="font-medium">Professional</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSelectionEnhancement('creative')}
                    className="flex items-center gap-2 p-3 text-sm text-left bg-gray-800 hover:bg-orange-600 rounded-md transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">Creative</span>
                  </button>
                  <button
                    onClick={() => handleSelectionEnhancement('sarcastic')}
                    className="flex items-center gap-2 p-3 text-sm text-left bg-gray-800 hover:bg-red-600 rounded-md transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">Sarcastic</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
