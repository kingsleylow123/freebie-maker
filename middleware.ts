import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  if (host.includes('claudemalaysia.com') && req.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/malaysia', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
