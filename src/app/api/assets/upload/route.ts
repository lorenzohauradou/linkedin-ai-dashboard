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
        const file = formData.get('file') as File
        
        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        console.log('📤 Frontend: Upload file to backend:', file.name, file.size, 'bytes')

        // Crea un nuovo FormData per il backend
        const backendFormData = new FormData()
        backendFormData.append('file', file)

        // Forward the request to the backend
        const response = await fetch(`${BACKEND_URL}/api/assets/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken.value}`,
                // Non impostare Content-Type per FormData, il browser lo fa automaticamente
            },
            body: backendFormData
        })

        const data = await response.json()

        console.log('✅ Backend response:', data)

        if (response.ok) {
            return NextResponse.json({
                success: true,
                asset_info: data.asset_info
            })
        } else {
            return NextResponse.json(
                { error: 'Failed to upload asset' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('❌ Error uploading asset:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
