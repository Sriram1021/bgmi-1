import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    const targetUrl = `${baseUrl}api/tournaments/my/organized`;
    
    console.log(`📡 [ORGANIZED] Proxying GET request to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      console.error('❌ Upstream API Error:', response.status, data);
      return NextResponse.json(
        data || { message: `Upstream error: ${response.status}` }, 
        { status: response.status }
      );
    }

    return NextResponse.json(data || [], { status: 200 });
    
  } catch (error: any) {
    console.error('🔥 Proxy Internal Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Proxy Error' }, 
      { status: 500 }
    );
  }
}
