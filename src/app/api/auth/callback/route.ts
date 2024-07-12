import { get } from "http";
import { NextRequest, NextResponse } from "next/server";
import { getCookie, removeCookie } from "@/utils/cookies";
import { verifyState } from "@/utils/auth";

export async function GET(req: NextRequest) {

  console.log('callback route...')

  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  console.log('req.nextUrl.searchParams: ', req.nextUrl.searchParams)

  if (!code || !state) {
    return new NextResponse(JSON.stringify({ error: 'code and state are required' }), { status: 400 });
  }

  //Validate state
  const cookieState = getCookie('state');

  if (!cookieState) {
    console.error('No state stored in cookies');
    // Handle missing state (CSRF or other error)
    return new NextResponse(JSON.stringify({ error: 'Cookie of state not stored' }), { status: 400 });

  }

  // Verify the state
  const isValidState = verifyState(cookieState);

  if (!isValidState || !cookieState.startsWith(state)) {
    console.error('State is not valid');
    return new NextResponse(JSON.stringify({ error: 'Invalid state' }), { status: 400 });
  }

  //Request the token to the SSO Server with code and credentials
  // "grant_type": "authorization_code",
  // "client_id": "YOUR_CLIENT_ID",
  // "client_secret": "YOUR_CLIENT_SECRET",
  // "code": "AUTHORIZATION_CODE",
  // "redirect_uri": "YOUR_CALLBACK_URL"

  const client_id = process.env.AUTH_SUPRA_CLIENT_ID;
  const client_secret = process.env.AUTH_SUPRA_CLIENT_SECRET;
  const redirect_url = process.env.NEXT_AUTH_REDIRECT_URL;

  console.log('Trying to call this: ', `${process.env.AUTH_SUPRA_SERVER}/api/auth/token?code=${code}&client_id=${client_id}&redirect_uri=${redirect_url}&client_secret=${client_secret}`)

  // const response = await fetch(`${process.env.AUTH_SSO_SERVER}/api/auth/token?code=${code}&client_id=${client_id}&redirect_uri=${redirect_url}&client_secret=${client_secret}`, {
  //   method: 'POST',
  //   headers: headers(),
  //   credentials: 'include',
  // });
  const params = new URLSearchParams();
  params.append('code', code);
  params.append('client_id', client_id || '');
  params.append('redirect_uri', redirect_url || '');
  params.append('client_secret', client_secret || '');
  params.append('grant_type', 'authorization_code');

  const response = await fetch(`${process.env.AUTH_SUPRA_SERVER}/api/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
    credentials: 'include',
  });

  if (response.status !== 200) {
    return new NextResponse(JSON.stringify({ error: 'Invalid call to token in /callback' }), { status: 400 });
  }

  //Once I get the token I will delete the state cookie
  removeCookie('state')

  const { access_token, email, refresh_token, expires_in } = await response.json();

  const cookieValue = JSON.stringify({ access_token, refresh_token, expires_in, email});

  const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/profile`);

  res.cookies.set({
    name: process.env.SESSION_NAME || 'session',
    value: cookieValue,
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    path: '/',
    maxAge: 3600,
  });

  return res;

}