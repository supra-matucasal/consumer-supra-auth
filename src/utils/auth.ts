import { fetchUserInfo } from '@/services/auth';
import { getCookie, setCookie } from './cookies';
import crypto from 'crypto';

export const getSession = (): { access_token: string, email: string } | null => {
  const cookieValue = getCookie(process.env.SESSION_NAME || 'session');
  const { access_token, email } = JSON.parse(cookieValue || '{}');

  return { access_token, email };
};

export const getTempCode = (): string | null => {
  const cookieValue = getCookie('tempCode');
  const  tempCode  = cookieValue || null;

  return tempCode;
};

export const getUserFromSession = async (token: string) => {
  if (!token) return null;
  return await fetchUserInfo(token);
};


export const generateRandomState = (): string => {
  const array = crypto.randomBytes(14);
  return array.toString('hex');
}

export const signState = (state: string): string => {
  const secret = process.env.AUTH_SUPRA_SECRET_FOR_STATE || '';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(state);
  const signature = hmac.digest('hex');
  return `${state}.${signature}`;
}


export const verifyState = (stateWithSignature: string): boolean => {
  const secret = process.env.AUTH_SUPRA_SECRET_FOR_STATE || '';
  const [state, signature] = stateWithSignature.split('.');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(state);
  const expectedSignature = hmac.digest('hex');
  return signature === expectedSignature;
}

export const saveSession = (session: { access_token: string, refresh_token: string }) => {

  const cookieValue = JSON.stringify(session);
  setCookie('session', cookieValue, 'lax');

  // res.cookies.set({
  //   name: process.env.SESSION_NAME || 'session',
  //   value: cookieValue,
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV !== 'development',
  //   sameSite: 'lax',
  //   path: '/',
  //   maxAge: 3600,
  // });
}

// export const refreshAccessToken = async () => {
//   const cookieValue = getCookie(process.env.SESSION_NAME || 'session');
//   const { access_token, refresh_token } = JSON.parse(cookieValue || '{}');

//   if (!refresh_token) {
//     return null;
//   }

//   try {
//     // const response = await axios.post('/api/auth/token', {
//     //   grant_type: 'refresh_token',
//     //   refresh_token,
//     // });
//     // const { access_token } = response.data;

//     const { access_token: new_access_token, refresh_token: new_refresh_token } = await refreshAccessTokenService(access_token, refresh_token) || { access_token: null, refresh_token: null };

//     if (!new_access_token || !new_refresh_token) {
//       return null;
//     }

//     saveSession({ access_token: new_access_token, refresh_token: new_refresh_token });

//     console.log('Access token refreshed:', new_access_token);

//     return new_access_token
//   } catch (error) {
//     console.error('Error refreshing access token:', error);
//     return null;
//   }
// };