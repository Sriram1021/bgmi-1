import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // FIX: Handle double redirect path issue from backend
    // If we see /participant/dashboard/participant/dashboard, redirect to /participant/dashboard
    if (pathname.includes('/participant/dashboard/participant/dashboard')) {
        const url = new URL('/participant/dashboard', request.url);
        url.search = search; // Preserve the token query param
        return NextResponse.redirect(url);
    }

    // Get user from cookie
    // Get user from cookie
    const authToken = request.cookies.get('auth_token')?.value || 
                      request.cookies.get('connect.sid')?.value ||
                      request.cookies.get('token')?.value ||
                      request.cookies.get('access_token')?.value ||
                      request.cookies.get('jwt')?.value;
    
    console.log('Middleware - Path:', pathname);
    console.log('Middleware - Cookies:', request.cookies.getAll().map(c => c.name).join(', '));
    console.log('Middleware - Auth Token Found:', !!authToken);

    const isAuthenticated = !!authToken;

    // Redirect logged-in users away from login/register pages
    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
        // Since we don't know the role here, we redirect to a common base or let the client handle it.
        // But /login usually redirects to /participant/dashboard by default if role is unknown.
        // A better way is to NOT redirect in middleware if we don't know the role, 
        // and let the LoginPage handle it on mount if authenticated.
        // However, the user wants "old way" which might mean no middleware redirection here.
        return NextResponse.next();
    }

    // Protected participant routes
    if (pathname.startsWith('/participant')) {
        // Handled client-side
    }

    // Protected organizer routes
    if (pathname.startsWith('/organizer')) {
        // Handled client-side
    }

    // Protected admin routes
    if (pathname.startsWith('/admin')) {
        // Handled client-side
    }

    return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        '/participant/:path*',
        '/organizer/:path*',
        '/admin/:path*',
        '/login',
        '/register',
    ],
};
