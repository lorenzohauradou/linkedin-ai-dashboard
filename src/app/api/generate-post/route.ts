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
        const { content, contentType, selectedBrains, contentUrl, assetId } = body

        console.log('🔍 Next.js API generate-post ricevuto:', { content, contentType, selectedBrains, contentUrl, assetId })

        // Prepara i dati per il backend
        const generateData = {
            content: content,
            content_type: contentType,
            content_url: contentUrl,
            brain_ids: selectedBrains,
            assetId: assetId
        }

        console.log('Dati inviati al backend generate-post:', generateData)

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
            return NextResponse.json(data)
        } else {
            return NextResponse.json(
                { error: 'Failed to generate post' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error in generate-post API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}