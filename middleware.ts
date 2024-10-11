/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await getSession({ req: request as any });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const res = NextResponse.next();
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.headers.set('X-Frame-Options', 'ALLOW-FROM https://docs.google.com'); // Add this line
  res.cookies.set('myCookie', 'someValue', {
    sameSite: 'none', // or 'lax', 'strict', or a boolean value
    secure: true,
  });
  return res;
}

export const config = {
  matcher: '/api/:path*',
};