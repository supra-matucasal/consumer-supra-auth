import { verifyState } from "@/utils/auth";
import { getCookie, removeCookie, setCookie } from "@/utils/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log('Callback route initiated...');

    const code = req.nextUrl.searchParams.get('code');
    const state = req.nextUrl.searchParams.get('state');

    if (!code || !state) {
      return new NextResponse(JSON.stringify({ error: 'code and state are required' }), { status: 400 });
    }

    const cookieState = getCookie('state');
    if (!cookieState) {
      console.error('No state stored in cookies');
      return new NextResponse(JSON.stringify({ error: 'State not stored in cookies' }), { status: 400 });
    }

    if (!verifyState(cookieState) || !cookieState.startsWith(state)) {
      console.error('Invalid state');
      return new NextResponse(JSON.stringify({ error: 'Invalid state' }), { status: 400 });
    }

    removeCookie('state');

    const agent = req.headers.get('user-agent') || 'Unknown';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
    const client_id = process.env.AUTH_SUPRA_CLIENT_ID || '';
    const client_secret = process.env.AUTH_SUPRA_CLIENT_SECRET || '';
    const redirect_url = process.env.NEXT_AUTH_REDIRECT_URL || '';

    const params = new URLSearchParams({
      code,
      client_id,
      redirect_uri: redirect_url,
      client_secret,
      grant_type: 'authorization_code',
    });

    const response = await fetch(`${process.env.AUTH_SUPRA_SERVER}/api/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': `${process.env.NEXT_PUBLIC_APP_URL}`,
        'User-Agent': agent,
        'Real-Ip': ip,
      },
      body: params,
      credentials: 'include',
    });

    if (response.status !== 200) {
      console.error('Failed to fetch token');
      return new NextResponse(JSON.stringify({ error: 'Failed to fetch token' }), { status: 400 });
    }

    const { access_token, email, refresh_token } = await response.json();

    if (access_token) {
      const sessionData = JSON.stringify({ access_token, email, refresh_token })
      setCookie('session', sessionData);

      console.log('Access token stored in cookie');
      const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/profile`);
      res.cookies.set({
        name: process.env.SESSION_NAME || 'session',
        value: sessionData,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600,
      });
      return res;
    }

    console.error('Access token missing in response');

    // return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`, { status: 302 });
    return new NextResponse(JSON.stringify({ error: 'Access token missing' }), { status: 400 });

  } catch (error) {
    console.error('Error in callback route:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
