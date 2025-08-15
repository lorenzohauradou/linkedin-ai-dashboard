import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies()
        const authToken = cookieStore.get('auth_token')

        if (!authToken) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const nuggetType = searchParams.get('type')
        
        let url = `${BACKEND_URL}/api/knowledge/nuggets`
        if (nuggetType) {
            url += `?nugget_type=${nuggetType}`
        }

        const response = await fetch(url, {
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
                { error: 'Failed to get gold nuggets' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error getting gold nuggets:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
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

        const response = await fetch(`${BACKEND_URL}/api/knowledge/nuggets`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const data = await response.json()

        if (response.ok) {
            return NextResponse.json(data)
        } else {
            return NextResponse.json(
                { error: 'Failed to add gold nugget' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error adding gold nugget:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
