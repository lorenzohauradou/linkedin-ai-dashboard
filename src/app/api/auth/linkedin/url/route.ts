import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/linkedin/url`)
        const data = await response.json()

        if (response.ok) {
            return NextResponse.json(data)
        } else {
            return NextResponse.json(
                { error: 'Failed to get LinkedIn auth URL' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error getting LinkedIn auth URL:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
