import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing token' }, { status: 401 });
    }

    // Ensure API_BASE_URL has a trailing slash
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    
    // Forward request to Backend API
    const targetUrl = `${baseUrl}api/tournaments/${id}/join`;
    console.log(`📡 [JOIN] Proxying POST for ID: ${id} to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      console.error('❌ Upstream API Error (JOIN):', response.status, data);
      return NextResponse.json(
        data || { message: `Upstream error: ${response.status}` }, 
        { status: response.status }
      );
    }

    console.log(`✅ [JOIN] Successfully joined tournament: ${id}`);
    return NextResponse.json(data, { status: 200 });
    
  } catch (error: any) {
    console.error('🔥 Proxy Internal Error (JOIN):', error);
    return NextResponse.json(
      { message: error.message || 'Internal Proxy Error' }, 
      { status: 500 }
    );
  }
}
