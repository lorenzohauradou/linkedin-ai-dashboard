import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

// Configurazione per Vercel Pro
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minuti con piano Pro

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
        
        console.log('🔍 Next.js API analyze-temp ricevuto file:', formData.get('file'))

        // Inoltra la richiesta al backend
        const response = await fetch(`${BACKEND_URL}/api/assets/analyze-temp`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken.value}`,
                // Non impostare Content-Type per FormData, lascia che fetch lo gestisca
            },
            body: formData
        })

        const data = await response.json()

        if (response.ok) {
            console.log('✅ Analisi temporanea completata:', data.temp_analysis?.temp_id)
            return NextResponse.json(data)
        } else {
            console.error('❌ Errore analisi temporanea:', data)
            return NextResponse.json(
                { error: 'Failed to analyze asset temporarily' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error in analyze-temp API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
