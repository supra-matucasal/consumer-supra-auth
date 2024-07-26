import { NextRequest, NextResponse } from 'next/server';
import { getCookie } from './utils/cookies';

const base64Url = (str: string) => {
  return str?.replace(/-/g, '+').replace(/_/g, '/');
};

const base64Decode = (str: string) => {
  return Buffer.from(str, 'base64').toString('utf-8');
};

const parseJwt = (token: string) => {
  const [header, payload, signature] = token?.split('.');

  const decodedPayload = base64Decode(base64Url(payload));
  return JSON.parse(decodedPayload);
};

export function middleware(req: NextRequest) {
  const token = getCookie('session');
  const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}`);

  console.log('Middleware called. Current URL:', req.nextUrl.href);
  console.log('Token:', token);

  if (!token) {
    // Prevent redirect loop
    if (req.nextUrl.href !== redirectUrl.href) {
      console.log('No token found. Redirecting to login.');
      // return NextResponse.redirect(redirectUrl);
    } else {
      console.log('Already on the login page. No redirect to avoid loop.');
      return NextResponse.next();
    }
  }

  try {
    const decoded = parseJwt(token);
    const expiry = decoded.exp;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    console.log('Token expiry:', expiry);
    console.log('Current timestamp:', currentTimestamp);

    if (expiry < currentTimestamp) {
      console.log('Token has expired.');
      // Prevent redirect loop
      if (req.nextUrl.href !== redirectUrl.href) {
        console.log('Redirecting to login due to expired token.');
        // return NextResponse.redirect(redirectUrl);
      } else {
        console.log('Already on the login page. No redirect to avoid loop.');
        return NextResponse.next();
      }
    } else {
      console.log('Token is valid.');
    }
  } catch (error: any) {
    console.error('Error decoding token:', error.message);
    // Prevent redirect loop
    if (req.nextUrl.href !== redirectUrl.href) {
      console.log('Error in token. Redirecting to login.');
      // return NextResponse.redirect(redirectUrl);
    } else {
      console.log('Already on the login page. No redirect to avoid loop.');
      return NextResponse.next();
    }
  }

  console.log('Token valid or already on login page. Proceeding to next response.');
  return NextResponse.next();
}
