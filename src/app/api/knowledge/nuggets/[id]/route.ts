import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        const response = await fetch(`${BACKEND_URL}/api/knowledge/nuggets/${params.id}`, {
            method: 'PUT',
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
                { error: 'Failed to update gold nugget' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error updating gold nugget:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies()
        const authToken = cookieStore.get('auth_token')

        if (!authToken) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const response = await fetch(`${BACKEND_URL}/api/knowledge/nuggets/${params.id}`, {
            method: 'DELETE',
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
                { error: 'Failed to delete gold nugget' },
                { status: response.status }
            )
        }
    } catch (error) {
        console.error('Error deleting gold nugget:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
