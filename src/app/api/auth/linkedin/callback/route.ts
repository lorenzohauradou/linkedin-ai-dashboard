import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        // Handle OAuth error
        if (error) {
            console.error('LinkedIn OAuth error:', error)
            return NextResponse.redirect(new URL('/login?error=oauth_error', request.url))
        }

        // Validate required parameters
        if (!code || !state) {
            console.error('Missing code or state parameter')
            return NextResponse.redirect(new URL('/login?error=missing_params', request.url))
        }

        // Exchange code for token with backend
        const response = await fetch(`${BACKEND_URL}/api/auth/linkedin/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                state
            })
        })

        const data = await response.json()

        if (response.ok && data.success && data.token) {
            // Create response with redirect to dashboard
            const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url))
            
            // Set auth token as httpOnly cookie
            redirectResponse.cookies.set('auth_token', data.token.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: data.token.expires_in,
                path: '/'
            })

            // Also set user info as a regular cookie for client-side access
            redirectResponse.cookies.set('user_info', JSON.stringify(data.token.user), {
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: data.token.expires_in,
                path: '/'
            })

            return redirectResponse
        } else {
            console.error('Backend authentication failed:', data)
            return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
        }

    } catch (error) {
        console.error('LinkedIn callback error:', error)
        return NextResponse.redirect(new URL('/login?error=server_error', request.url))
    }
}
