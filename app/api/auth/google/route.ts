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
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

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
