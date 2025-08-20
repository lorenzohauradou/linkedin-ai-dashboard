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

        // Ottieni il FormData dalla richiesta
        const formData = await request.formData()
        
        console.log('🔍 Next.js API get-upload-url per file:', formData.get('filename'))

        // Inoltra la richiesta al backend
        const response = await fetch(`${BACKEND_URL}/api/assets/get-upload-url`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken.value}`,
            },
            body: formData
        })

        const data = await response.json()

        if (response.ok) {
            console.log('✅ Presigned URL generato:', data.upload_info?.unique_filename)
            return NextResponse.json(data)
        } else {
            console.error('❌ Errore generazione presigned URL:', data)
            return NextResponse.json(
                { error: 'Failed to generate upload URL' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error in get-upload-url API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
