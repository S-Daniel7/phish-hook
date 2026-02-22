import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.EXPRESS_BACKEND_URL || 'http://10.136.9.104.:5000/login';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to submit attempt' },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Visual quiz attempt proxy error:', error);
    return NextResponse.json(
      { error: 'Could not reach quiz backend. Is Express running?' },
      { status: 502 }
    );
  }
}
