const authSSOServer = process.env.AUTH_SUPRA_SERVER;
const localServer = process.env.NEXT_PUBLIC_APP_API_URL;

async function verifyToken(token: string, ipAddress?: string, agent?: string): Promise<boolean> {
  console.log('Verifying token:', token)
  try {
    const response = await fetch(`${localServer}/auth/verify-token`, {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': agent || '',
        'X-Real-IP': ipAddress || '',
      }
    });
    const data = await response.json();
    console.log('Data from verify token', data)

    return response.status === 200;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

async function fetchUserInfo(token: string): Promise<any> {
  console.log('Fetching user info...')
  try {
    const response = await fetch(`${authSSOServer}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    console.log('response.status: ', response.status)

    if (response.status !== 200) {
      return false;
    }

    console.log('Response directly: ', response)

    const data = await response.json();
    console.log('Data from me', data)
    return data;

  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

// export const refreshAccessTokenService = async (access_token: string, refresh_token: string): Promise<{access_token: string, refresh_token: string} | null> => {
  
//   console.log('Trying to refresh token with access_token:', access_token, 'and refresh_token:', refresh_token)
  
//   if (!refresh_token || !access_token) {
//     return null;
//   }

//   try {
//     const response = await fetch(`${authUrl}/api/auth/refresh-token`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${access_token}`
//       },
//       body: JSON.stringify({
//         refresh_token
//       })
//     });
//     if (response.status !== 200) {
//       return null;
//     }
//     const data = await response.json();
//     const { access_token: new_access_token, refresh_token: new_refresh_token } = data;
//     return {access_token: new_access_token, refresh_token: new_refresh_token};

//   } catch (error) {
//     console.error('Error refreshing access token:', error);
//     return null;
//   }
// };


export {
  verifyToken,
  fetchUserInfo,
}