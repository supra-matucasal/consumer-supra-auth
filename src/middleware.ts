import { NextRequest, NextResponse, userAgent } from 'next/server';

const allowedOrigins = [
  process.env.AUTH_SUPRA_SERVER,
]

export async function middleware(req: NextRequest) {

    console.log('Req: ', req.url)

  let referer = req.headers.get('Referer');
  console.log('referer: ', referer)

  if (!referer) {
    return NextResponse.redirect('http://supra.com');
  }
  const url = new URL(referer);
  const origin = url.origin;

  
  console.log('origin: ', origin)
  console.log('allowedOrigins: ', allowedOrigins)

  if (origin && allowedOrigins.includes(origin)) {
    const response = NextResponse.next();

    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { headers: response.headers });
    }

    return NextResponse.next();
  } else {
    return new NextResponse('Not allowed', { status: 403, headers: { 'Content-Type': 'text/plain' } });
  }

}

export const config = {
  matcher: ['/api/auth/callback'],
};
