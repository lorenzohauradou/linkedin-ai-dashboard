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
        const { content, contentType, selectedBrains, contentUrl, assetId, outputStyle } = body

        console.log('🔍 Next.js API ricevuto:', { content, contentType, selectedBrains, contentUrl, assetId, outputStyle })

        // Prepara i dati per il backend
        const generateData = {
            content: content,
            content_type: contentType, // 'text', 'video', 'article', 'image'
            content_url: contentUrl,
            brain_ids: selectedBrains,
            assetId: assetId, // Passa l'assetId al backend
            output_style: outputStyle, // Aggiungi output style
            mode: 'multi_angle',
            angles: ['takeaways', 'personal', 'question'] // Gli angoli che vogliamo generare
        }

        console.log('📤 Dati inviati al backend:', generateData)

        // Forward the request to the backend
        const response = await fetch(`${BACKEND_URL}/api/generate-multi-angle`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(generateData)
        })

        const data = await response.json()

        if (response.ok) {
            return NextResponse.json({
                success: true,
                options: data.options || [],
                source_content: data.source_content
            })
        } else {
            return NextResponse.json(
                { error: 'Failed to generate multi-angle posts' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error generating multi-angle posts:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
