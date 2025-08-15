import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const authToken = cookieStore.get('auth_token')

        if (!authToken) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { 
            chatHistory, 
            newInstruction, 
            selectedBrains, 
            outputStyle,
            assetId 
        } = body

        console.log('🔍 Next.js API continue-chat ricevuto:', { 
            chatHistoryLength: chatHistory?.length, 
            newInstruction, 
            selectedBrains, 
            outputStyle,
            assetId 
        })

        // Costruisci il prompt contestuale per ChatGPT
        let contextualPrompt = "This is a chat conversation where I'm helping the user create LinkedIn posts. Here's the conversation history:\n\n"
        
        if (chatHistory && chatHistory.length > 0) {
            chatHistory.forEach((message: any, index: number) => {
                if (message.type === 'user') {
                    contextualPrompt += `Message ${index + 1} (User): ${message.content}\n`
                } else if (message.type === 'ai') {
                    contextualPrompt += `Message ${index + 1} (AI): ${message.content}\n`
                }
            })
        }

        contextualPrompt += `\nNow the user wants to modify the latest generated post with this instruction: "${newInstruction}"`
        contextualPrompt += "\n\nPlease generate an improved version of the latest post based on the user's feedback, maintaining the context of our conversation."

        // Prepara i dati per il backend
        const generateData = {
            content: contextualPrompt,
            content_type: 'text',
            content_url: null,
            brain_ids: selectedBrains,
            assetId: assetId,
            output_style: outputStyle,
            mode: 'continue_chat'
        }

        console.log('📤 Dati inviati al backend continue-chat:', generateData)

        const response = await fetch(`${BACKEND_URL}/api/generate-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken.value}`
            },
            body: JSON.stringify(generateData)
        })

        const data = await response.json()

        if (response.ok) {
            return NextResponse.json({
                success: true,
                generated_post: data.generated_post || data.content,
                context: 'continue_chat'
            })
        } else {
            return NextResponse.json(
                { error: 'Failed to continue chat' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error in continue-chat API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
