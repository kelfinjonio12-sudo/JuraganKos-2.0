import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Hanya proteksi route /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Cek apakah ada admin_session di cookies
    const adminSession = request.cookies.get('admin_session');
    
    // Kalau tidak ada session, tetap izinkan akses ke halaman login admin
    // Validasi session dilakukan di client-side (localStorage)
    // Middleware ini hanya mencegah akses langsung ke API admin
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};