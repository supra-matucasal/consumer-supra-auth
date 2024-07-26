import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './utils/auth';

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
  const session: any = getSession();
  const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}`);

  if (!session) {
    // Prevent redirect loop
    if (req.nextUrl.href !== redirectUrl.href) {
      // return NextResponse.redirect(redirectUrl);
    } else {
      return NextResponse.next();
    }
  }

  try {
    const decoded = parseJwt(session?.access_token);
    const expiry = decoded.exp;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (expiry < currentTimestamp) {
      // Prevent redirect loop
      if (req.nextUrl.href !== redirectUrl.href) {
        // return NextResponse.redirect(redirectUrl);
      } else {
        return NextResponse.next();
      }
    } else {
      console.log('Token is valid.');
    }
  } catch (error: any) {
    // Prevent redirect loop
    if (req.nextUrl.href !== redirectUrl.href) {
      // return NextResponse.redirect(redirectUrl);
    } else {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}
