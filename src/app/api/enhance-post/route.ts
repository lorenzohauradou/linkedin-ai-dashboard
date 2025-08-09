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
        const { selectedText, enhanceType, customInstruction, selectedBrains } = body

        // Prepara i dati per il backend
        const enhanceData = {
            selected_text: selectedText,
            enhance_type: enhanceType, // 'short', 'long', 'custom', 'carousel'
            custom_instruction: customInstruction,
            brain_ids: selectedBrains,
            mode: 'enhance'
        }

        // Forward the request to the backend
        const response = await fetch(`${BACKEND_URL}/api/enhance-post`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(enhanceData)
        })

        const data = await response.json()

        if (response.ok) {
            return NextResponse.json({
                success: true,
                enhanced_content: data.enhanced_content,
                changes: data.changes || {
                    added: [],
                    removed: [],
                    modified: []
                }
            })
        } else {
            return NextResponse.json(
                { error: 'Failed to enhance post' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error enhancing post:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
