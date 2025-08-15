import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const authToken = cookieStore.get('auth_token')

        if (!authToken) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const response = await fetch(`${BACKEND_URL}/api/knowledge/summary`, {
            headers: {
                'Authorization': `Bearer ${authToken.value}`,
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()

        if (response.ok) {
            return NextResponse.json(data)
        } else {
            return NextResponse.json(
                { error: 'Failed to get knowledge summary' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error getting knowledge summary:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
