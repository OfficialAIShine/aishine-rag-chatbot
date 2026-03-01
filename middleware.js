import { NextResponse } from 'next/server'
 
export function middleware(request) {
  return NextResponse.redirect(new URL('/chat', request.url))
}
 
export const config = {
  matcher: '/',
}