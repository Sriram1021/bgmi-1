import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Ensure API_BASE_URL has a trailing slash
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    
    // Forward request to Backend API
    const targetUrl = `${baseUrl}api/payments/verify`;
    console.log(`📡 [VERIFY PAYMENT] Proxying POST to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ [VERIFY PAYMENT] Upstream Error:', response.status, data);
      return NextResponse.json(
        data || { message: `Verification failed: ${response.status}` }, 
        { status: response.status }
      );
    }

    console.log('✅ [VERIFY PAYMENT] Success');
    return NextResponse.json(data, { status: 200 });
    
  } catch (error: any) {
    console.error('🔥 [VERIFY PAYMENT] Proxy Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Proxy Error' }, 
      { status: 500 }
    );
  }
}
