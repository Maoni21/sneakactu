import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Laisser passer la page de login et l'API d'auth
  if (pathname === '/studio-login' || pathname.startsWith('/api/studio-auth')) {
    return NextResponse.next()
  }

  // Protéger toutes les routes /studio
  if (pathname.startsWith('/studio')) {
    const validPassword = process.env.STUDIO_PASSWORD ?? 'sneakactu2025'
    const cookie = req.cookies.get('studio_auth')

    if (cookie?.value !== validPassword) {
      const loginUrl = new URL('/studio-login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/studio/:path*', '/studio-login', '/api/studio-auth'],
}
