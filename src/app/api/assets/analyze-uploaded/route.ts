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
        
        console.log('🔍 Next.js API analyze-uploaded per file:', formData.get('original_filename'))

        // Inoltra la richiesta al backend
        const response = await fetch(`${BACKEND_URL}/api/assets/analyze-uploaded`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken.value}`,
            },
            body: formData
        })

        const data = await response.json()

        if (response.ok) {
            console.log('✅ File analizzato da storage:', data.temp_analysis?.temp_id)
            return NextResponse.json(data)
        } else {
            console.error('❌ Errore analisi file da storage:', data)
            return NextResponse.json(
                { error: 'Failed to analyze uploaded file' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error in analyze-uploaded API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
