import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    const { pathname } = req.nextUrl;

    if (!token && (pathname.startsWith('/admin')))
        return NextResponse.redirect(new URL('/login', req.url));

    if (pathname.startsWith('/login') && token)
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login']
};