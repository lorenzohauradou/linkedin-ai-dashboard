import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isProtectedRoute, isPublicRoute } from './src/lib/auth-config'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Controlla se la route corrente è protetta
  const isProtected = isProtectedRoute(pathname)
  
  // Controlla se la route corrente è pubblica
  const isPublic = isPublicRoute(pathname)
  
  // Ottieni il token di autenticazione dai cookie
  const authToken = request.cookies.get('auth_token')
  const userInfo = request.cookies.get('user_info')
  
  // Se l'utente sta cercando di accedere a una route protetta senza essere autenticato
  if (isProtected && (!authToken || !userInfo)) {
    // Redirect alla pagina di login
    const loginUrl = new URL('/login', request.url)
    // Aggiungi il parametro redirect per tornare alla pagina originale dopo il login
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Se l'utente è autenticato e sta cercando di accedere alla pagina di login
  if (pathname === '/login' && authToken && userInfo) {
    // Controlla se c'è un redirect parameter
    const redirectTo = request.nextUrl.searchParams.get('redirect')
    if (redirectTo && redirectTo.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
    // Altrimenti redirect alla dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

// Configura su quali route eseguire il middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
