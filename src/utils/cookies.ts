import { cookies } from "next/headers";

const cookieDomain = process.env.SESSION_COOKIE_DOMAIN || 'localhost';

export const setCookie = (cookieName: string, value: string, sameSite?: 'lax' | 'strict', cookieMaxAge: string = '3600') => {

  cookies().set({
    name: cookieName,
    value: value,
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: sameSite || 'strict',
    path: '/',
    domain: cookieDomain,
    maxAge: +cookieMaxAge
  });

};

export const getCookie = (cookieName: string): string => {
  return cookies().get(cookieName)?.value || '{}' as string;
};


export const removeCookie = (cookieName: string) => {
  cookies().delete(cookieName);
}

