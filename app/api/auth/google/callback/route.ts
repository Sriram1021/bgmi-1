import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function GET(request: NextRequest) {
  try {
    // Get the full query string from the incoming request (code, scope, etc.)
    const { searchParams } = request.nextUrl;
    const code = searchParams.get('code');
    const scope = searchParams.get('scope');
    const state = searchParams.get('state');

    if (!code) {
      console.error('❌ [GOOGLE_CALLBACK] No authorization code received');
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    console.log(`📡 [GOOGLE_CALLBACK] Received code, forwarding to backend...`);

    // Forward the entire callback to the backend
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;

    // Build the backend callback URL with all query params
    const backendCallbackUrl = new URL(`${baseUrl}api/auth/google/callback`);
    // Forward all query parameters to the backend
    searchParams.forEach((value, key) => {
      backendCallbackUrl.searchParams.set(key, value);
    });

    console.log(`📡 [GOOGLE_CALLBACK] Proxying to: ${backendCallbackUrl.toString()}`);

    const response = await fetch(backendCallbackUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'manual', // Don't follow redirects - we want to handle them
    });

    console.log(`📡 [GOOGLE_CALLBACK] Backend response status: ${response.status}`);

    // Case 1: Backend responds with a redirect (3xx)
    if (response.status >= 300 && response.status < 400) {
      const redirectLocation = response.headers.get('location');
      console.log(`📡 [GOOGLE_CALLBACK] Backend redirecting to: ${redirectLocation}`);

      if (redirectLocation) {
        let redirectUrl: URL;
        try {
          // If it's a full URL
          redirectUrl = new URL(redirectLocation);
        } catch {
          // If it's a relative path
          redirectUrl = new URL(redirectLocation, request.url);
        }

        // Extract token and user data from the redirect URL
        const token = redirectUrl.searchParams.get('token');
        const role = redirectUrl.searchParams.get('role');

        // Build the frontend redirect URL dynamically
        const frontendRedirect = new URL(request.url);

        // Use the path from the backend redirect, or determine from role
        let targetPath = redirectUrl.pathname;

        // If the backend redirect is to a backend URL, extract the path
        if (targetPath.includes('/participant/dashboard') || targetPath.includes('/organizer/dashboard') || targetPath.includes('/admin/dashboard')) {
          // Keep the path as-is
        } else {
          // Default to participant dashboard
          targetPath = '/participant/dashboard';
        }

        // Fix double path issue from backend
        let cleanPath = targetPath;
        if (cleanPath.includes('/participant/dashboard/participant/dashboard')) {
          cleanPath = '/participant/dashboard';
        } else if (cleanPath.includes('/organizer/dashboard/organizer/dashboard')) {
          cleanPath = '/organizer/dashboard';
        }

        frontendRedirect.pathname = cleanPath;
        // Clear existing search params and set new ones from backend redirect
        frontendRedirect.search = redirectUrl.search;

        console.log(`📡 [GOOGLE_CALLBACK] Redirecting user to: ${frontendRedirect.toString()}`);
        return NextResponse.redirect(frontendRedirect);
      }
    }

    // Case 2: Backend responds with JSON (200) containing token and user data
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`📡 [GOOGLE_CALLBACK] Got JSON response:`, JSON.stringify(data).substring(0, 200));

        const token = data.token || data.accessToken || data.access_token;
        const user = data.user;
        const role = user?.role || data.role || '';

        if (token) {
          // Determine dashboard based on role
          let dashboardPath = '/participant/dashboard';
          if (role?.toUpperCase() === 'ORGANIZER') {
            dashboardPath = '/organizer/dashboard';
          } else if (role?.toUpperCase() === 'ADMIN') {
            dashboardPath = '/admin/dashboard';
          }

          // Build redirect URL with token and user data
          const redirectUrl = new URL(dashboardPath, request.url);
          redirectUrl.searchParams.set('token', token);
          if (role) redirectUrl.searchParams.set('role', role);

          if (user) {
            // Pass essential user fields
            if (user.email) redirectUrl.searchParams.set('email', user.email);
            if (user.id || user._id) redirectUrl.searchParams.set('id', user.id || user._id);
            if (user.name || user.displayName) redirectUrl.searchParams.set('name', user.name || user.displayName);
          }

          console.log(`📡 [GOOGLE_CALLBACK] Redirecting to dashboard: ${redirectUrl.pathname}`);
          return NextResponse.redirect(redirectUrl);
        }
      }
    }

    // Case 3: Error response from backend
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error(`❌ [GOOGLE_CALLBACK] Backend error (${response.status}):`, errorText.substring(0, 500));
    return NextResponse.redirect(new URL(`/login?error=auth_failed&status=${response.status}`, request.url));

  } catch (error: any) {
    console.error('🔥 [GOOGLE_CALLBACK] Internal Error:', error);
    return NextResponse.redirect(new URL(`/login?error=internal_error&message=${encodeURIComponent(error.message || 'Unknown error')}`, request.url));
  }
}
