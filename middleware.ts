import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Nếu cố gắng truy cập trang /admin mà không phải là admin
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      const forbiddenUrl = new URL('/403', req.url);
      return NextResponse.rewrite(forbiddenUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        // Các route cần đăng nhập
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
