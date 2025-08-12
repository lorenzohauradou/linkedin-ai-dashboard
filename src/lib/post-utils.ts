/**
 * Utilities condivise per il processamento dei contenuti dei post
 */

/**
 * Processa il contenuto del post rimuovendo virgolette e normalizzando line breaks
 */
export const processPostContent = (content: string): string => {
  if (!content) return content

  // Rimuovi virgolette all'inizio e alla fine
  let processed = content.trim()
  if (processed.startsWith('"') && processed.endsWith('"')) {
    processed = processed.slice(1, -1)
  }
  if (processed.startsWith("'") && processed.endsWith("'")) {
    processed = processed.slice(1, -1)
  }

  // Converti escape sequences in veri line break
  processed = processed.replace(/\\n/g, '\n')

  // Aggiungi spazi eleganti: doppio line break dopo paragrafi
  processed = processed.replace(/\n\n/g, '\n\n')

  return processed.trim()
}

/**
 * Genera opzioni di post fallback quando l'API fallisce
 */
export const generateFallbackOptions = (input: any) => {
  return [
    {
      id: '1',
      angle: 'Key Takeaways',
      style: 'takeaways' as const,
      content: `🔑 Just analyzed this content and here are the 3 key insights every professional should know:\n\n1. ${input.message}\n2. Implementation requires strategic thinking\n3. The future is collaborative\n\nWhich point resonates most with your experience?`,
      estimated_engagement: 85
    },
    {
      id: '2',
      angle: 'Personal Reflection',
      style: 'personal' as const,
      content: `This really got me thinking about my own journey...\n\n${input.message}\n\nIt reminds me of when I first started in this industry. The challenges seemed overwhelming, but that's where the growth happens.\n\nAnyone else experienced something similar?`,
      estimated_engagement: 72
    },
    {
      id: '3',
      angle: 'Provocative Question',
      style: 'question' as const,
      content: `Controversial take: ${input.message}\n\nBut here's what I think most people miss...\n\nWe're so focused on the obvious benefits that we ignore the potential downsides. What if the opposite approach is actually more effective?\n\nChange my mind 👇`,
      estimated_engagement: 91
    }
  ]
}

/**
 * Ottiene informazioni di stile per i post
 */
export const getStyleInfo = (style: 'personal' | 'data' | 'howto' | 'takeaways' | 'question' | 'story') => {
  switch (style) {
    case 'personal': return { label: 'Personal Story', color: 'bg-blue-500' }
    case 'data': return { label: 'Data-Driven', color: 'bg-green-500' }
    case 'howto': return { label: 'How-To Guide', color: 'bg-purple-500' }
    case 'takeaways': return { label: 'Key Insights', color: 'bg-blue-500' }
    case 'question': return { label: 'Question', color: 'bg-purple-500' }
    default: return { label: 'Story', color: 'bg-orange-500' }
  }
}

/**
 * Valida se un file è un'immagine
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

/**
 * Crea un'anteprima di un file
 */
export const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
