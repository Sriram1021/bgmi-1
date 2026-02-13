import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const { id } = await params;
    
    // Ensure API_BASE_URL has a trailing slash for robust concatenation
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    
    // Forward request to Backend API
    const targetUrl = `${baseUrl}api/tournaments/${id}/my-registration`;
    console.log(`📡 [REGISTRATION DETAILS] Proxying GET to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      cache: 'no-store'
    });

    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      console.error('❌ Upstream API Error (Registration Details):', response.status, data);
      return NextResponse.json(
        data || { message: `Upstream error: ${response.status}` }, 
        { status: response.status }
      );
    }

    console.log(`✅ [REGISTRATION DETAILS] Successfully fetched registration for tournament ${id}`);
    return NextResponse.json(data, { status: 200 });
    
  } catch (error: any) {
    console.error('🔥 Proxy Internal Error (Registration Details):', error);
    return NextResponse.json(
      { message: error.message || 'Internal Proxy Error' }, 
      { status: 500 }
    );
  }
}
