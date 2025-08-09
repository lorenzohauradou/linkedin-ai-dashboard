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

        // Get form data from request
        const formData = await request.formData()

        // Forward the request to the backend
        const response = await fetch(`${BACKEND_URL}/api/generate-post`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken.value}`,
            },
            body: formData
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
        console.error('Error generating post:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
