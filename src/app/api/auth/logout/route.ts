import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const response = NextResponse.json({ message: 'Logged out successfully' })
        
        // Clear auth cookies
        response.cookies.set('auth_token', '', {
            expires: new Date(0),
            path: '/'
        })
        
        response.cookies.set('user_info', '', {
            expires: new Date(0),
            path: '/'
        })

        return response
    } catch (error) {
        console.error('Error during logout:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
