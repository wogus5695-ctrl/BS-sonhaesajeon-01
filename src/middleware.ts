import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Let robots.txt bypass and return its normal 200 OK response from the server route
  if (pathname === '/robots.txt') {
    return NextResponse.next();
  }

  // Return a true HTTP 404 Not Found response with operations ended notice
  return new Response(
    `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>든든손해사정 홈페이지 운영 종료 안내</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #f8f9fa;
      color: #333;
      text-align: center;
      padding: 20px;
      box-sizing: border-box;
    }
    h1 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #222;
    }
    p {
      font-size: 16px;
      color: #666;
      margin: 0;
    }
  </style>
</head>
<body>
  <h1>든든손해사정 홈페이지 운영이 종료되었습니다.</h1>
  <p>이 페이지는 더 이상 제공되지 않습니다.</p>
</body>
</html>`,
    {
      status: 404,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.png, icon.svg, apple-icon.png (other icons)
     * - og-image.png (OG image)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|icon.svg|apple-icon.png|og-image.png).*)',
  ],
};
