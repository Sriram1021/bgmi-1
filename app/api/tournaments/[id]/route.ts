import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://mm86oaae25.execute-api.ap-south-1.amazonaws.com/';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');

    // Ensure API_BASE_URL has a trailing slash for robust concatenation
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    
    // Forward request to AWS API
    const targetUrl = `${baseUrl}api/tournaments/${id}`;
    console.log(`📡 [SINGLE FETCH] Proxying ID: ${id} to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
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

    return NextResponse.json(data, { status: 200 });
    
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    // Ensure API_BASE_URL has a trailing slash for robust concatenation
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    
    // Forward request to AWS API
    const targetUrl = `${baseUrl}api/tournaments/${id}`;
    console.log(`📡 [UPDATE] Proxying PUT for ID: ${id}`);
    console.log(`📡 [UPDATE] Target AWS URL: ${targetUrl}`);
    console.log(`📡 [UPDATE] Request Body Preview:`, JSON.stringify(body).substring(0, 100) + '...');

    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      console.error('❌ Upstream API Error (PUT):', response.status, data);
      return NextResponse.json(
        data || { message: `Upstream error: ${response.status}` }, 
        { status: response.status }
      );
    }

    console.log(`✅ [UPDATE] Successfully updated tournament: ${id}`);
    return NextResponse.json(data, { status: 200 });
    
  } catch (error: any) {
    console.error('🔥 Proxy Internal Error (PUT):', error);
    return NextResponse.json(
      { 
        message: error.message || 'Internal Proxy Error',
        cause: error.cause ? String(error.cause) : undefined,
        stack: error.stack
      }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized: Missing token' }, { status: 401 });
    }

    // Ensure API_BASE_URL has a trailing slash
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    
    // Forward request to AWS API
    const targetUrl = `${baseUrl}api/tournaments/${id}`;
    console.log(`📡 [DELETE] Proxying DELETE for ID: ${id} to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let data = null;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }
      console.error('❌ Upstream API Error (DELETE):', response.status, data);
      return NextResponse.json(
        data || { message: `Upstream error: ${response.status}` }, 
        { status: response.status }
      );
    }

    console.log(`✅ [DELETE] Successfully deleted tournament: ${id}`);
    return NextResponse.json({ success: true, message: 'Tournament deleted successfully' }, { status: 200 });
    
  } catch (error: any) {
    console.error('🔥 Proxy Internal Error (DELETE):', error);
    return NextResponse.json(
      { message: error.message || 'Internal Proxy Error' }, 
      { status: 500 }
    );
  }
}
