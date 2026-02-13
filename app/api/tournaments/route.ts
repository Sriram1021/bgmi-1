import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://mm86oaae25.execute-api.ap-south-1.amazonaws.com/';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing token' }, { status: 401 });
    }

    // Ensure API_BASE_URL has a trailing slash for robust concatenation
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    
    // Forward request to AWS API
    const targetUrl = `${baseUrl}api/tournaments`;
    console.log(`📡 [CREATE] Proxying request to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader, // Pass the Bearer token through
      },
      body: JSON.stringify(body),
    });

    // Handle response content
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

    return NextResponse.json(data || { success: true }, { status: response.status || 201 });
    
  } catch (error: any) {
    console.error('🔥 Proxy Internal Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Proxy Error' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    // Ensure API_BASE_URL has a trailing slash for robust concatenation
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    
    // Forward request to AWS API
    const targetUrl = `${baseUrl}api/tournaments`;
    console.log(`📡 [LIST] Proxying GET request to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    // Handle response content
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
    const retryBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    return NextResponse.json(
      { 
        message: error.message || 'Internal Proxy Error',
        targetUrl: `${retryBaseUrl}api/tournaments`
      }, 
      { status: 500 }
    );
  }
}
