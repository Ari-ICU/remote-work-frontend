import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/messages',
    '/post-job',
    '/apply',
    '/checkout',
    '/admin',
]

// Auth routes that should redirect to home if already logged in
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get token or authentication flag from cookies
    const token = request.cookies.get('token')?.value
    const isAuthenticated = request.cookies.get('is_authenticated')?.value
    const hasAuth = !!(token || isAuthenticated)

    // 1. Check if the route is protected
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

    if (isProtected && !hasAuth) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 2. Redirect logged-in users away from auth pages
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    if (isAuthRoute && hasAuth) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
}
