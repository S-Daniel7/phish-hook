import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.EXPRESS_BACKEND_URL || 'http://10.136.9.104.:3000/login';


export async function GET(request: NextRequest) {
  const level = request.nextUrl.searchParams.get('level') || '1';
  try {
    const res = await fetch(`${BACKEND_URL}/quiz?level=${level}`, {
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to load quiz' },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Visual quiz proxy error:', error);
    return NextResponse.json(
      { error: 'Could not reach quiz backend. Is Express running?' },
      { status: 502 }
    );
  }
}
