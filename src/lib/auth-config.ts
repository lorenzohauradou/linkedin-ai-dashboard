// Configurazione delle route per l'autenticazione

// Route che richiedono autenticazione
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/dashboard/content-brains',
  '/dashboard/generated-posts',
  '/dashboard/post-generator'
] as const

// Route pubbliche (non richiedono autenticazione)
export const PUBLIC_ROUTES = [
  '/',
  '/login'
] as const

// Route API che richiedono autenticazione
export const PROTECTED_API_ROUTES = [
  '/api/generate-post',
  '/api/publish-post',
  '/api/continue-chat',
  '/api/enhance-selection',
  '/api/generate-multi-angle',
  '/api/knowledge',
  '/api/assets/upload',
  '/api/user-posts'
] as const

// Funzione helper per controllare se una route è protetta
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

// Funzione helper per controllare se una route è pubblica
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))
}

// Funzione helper per controllare se una API route è protetta
export function isProtectedApiRoute(pathname: string): boolean {
  return PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))
}
