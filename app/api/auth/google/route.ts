import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function GET(request: NextRequest) {
  // If no API URL is configured, we can't redirect
  if (!API_BASE_URL) {
    console.error("❌ [AUTH_REDIRECT] NEXT_PUBLIC_API_BASE_URL is not defined");
    return NextResponse.json(
      { error: "System configuration error: API URL missing" },
      { status: 500 },
    );
  }

  try {
    const { searchParams } = request.nextUrl;

    // Construct the backend URL
    // Handle potential double slashes or missing slashes
    const baseUrl = API_BASE_URL.endsWith("/")
      ? API_BASE_URL
      : `${API_BASE_URL}/`;
    const targetUrl = new URL(`${baseUrl}api/auth/google`);

    // Forward all query parameters (role, redirect path, etc.)
    // Forward all query parameters (role, redirect path, etc.)
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    // CRITICAL FIX: Ensure 'redirect' param is absolute so backend knows where to return
    const redirectParam = searchParams.get('redirect');
    const origin = request.nextUrl.origin;
    
    if (redirectParam && !redirectParam.startsWith('http')) {
       // Convert relative path (e.g. /participant/dashboard) to absolute (e.g. https://site.com/participant/dashboard)
       const absoluteRedirect = new URL(redirectParam, origin).toString();
       targetUrl.searchParams.set('redirect', absoluteRedirect);
       console.log(`📡 [AUTH_REDIRECT] Converted relative redirect to: ${absoluteRedirect}`);
    } else if (!redirectParam) {
       // Default to dashboard if no redirect specified
       const defaultRedirect = new URL('/participant/dashboard', origin).toString();
       targetUrl.searchParams.set('redirect', defaultRedirect);
    }

    console.log(
      `📡 [AUTH_REDIRECT] Redirecting from ${request.url} to ${targetUrl.toString()}`,
    );

    // 307 Temporary Redirect preserves the method (GET)
    return NextResponse.redirect(targetUrl);
  } catch (error: any) {
    console.error("🔥 [AUTH_REDIRECT] Error constructing redirect:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
