import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { selectedText, fullText, enhanceType, customInstruction } = body

    console.log('Enhance selection request:', { selectedText, enhanceType, customInstruction })

    // Call backend API per migliorare solo il testo selezionato
    const backendResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/enhance-selection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selected_text: selectedText,
        full_text: fullText,
        enhance_type: enhanceType,
        custom_instruction: customInstruction
      })
    })

    if (!backendResponse.ok) {
      throw new Error(`Backend responded with status ${backendResponse.status}`)
    }

    const data = await backendResponse.json()

    return NextResponse.json({
      success: true,
      enhanced_text: data.enhanced_text,
      original_text: selectedText
    })

  } catch (error) {
    console.error('Error in enhance-selection API:', error)
    
    // Mock response per il testing
    const { selectedText, enhanceType } = await request.json()
    
    let enhanced_text = selectedText
    
    switch (enhanceType) {
      case 'engaging':
        enhanced_text = `${selectedText} che cambierà tutto 🚀`
        break
      case 'professional':
        enhanced_text = `${selectedText} con risultati comprovati`
        break
      case 'creative':
        enhanced_text = `💡 ${selectedText} che nessuno si aspetta`
        break
      case 'sarcastic':
        enhanced_text = `${selectedText} (spoiler: non è così semplice)`
        break
      default:
        enhanced_text = `${selectedText} migliorato con AI`
    }

    return NextResponse.json({
      success: true,
      enhanced_text,
      original_text: selectedText
    })
  }
}
