"use client";


import { useEffect, useState } from 'react'

export default function ProfileComponent({ tempToken }: { tempToken?: string }) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const localServer = process.env.NEXT_PUBLIC_APP_API_URL;

      if (tempToken) {
        try {
          const response = await fetch(`${localServer}/auth/token`, {
            cache: 'no-store',
            method: 'GET',
            credentials: 'include',
          });
          const data = await response.json();
          document.cookie = `session=${data.access_token}; path=/;`;

          setData(data);
        } catch (error) {
          console.error('Error verifying token:', error);
        }
      }
    };

    fetchData();
  }, [tempToken]);

  return (
    <div>
      {data && (
        <div>

          Access token:{" "}
          {data.access_token && data.access_token.length > 20 ? (
            <span className="break-all">{data.access_token}</span>
          ) : (
            data.access_token
          )}

          <br />

          Refresh token:{" "}
          {data.refresh_token && data.refresh_token.length > 20 ? (
            <span className="break-all">{data.refresh_token}</span>
          ) : (
            data.refresh_token
          )}

        </div>
      )}
    </div>
  )
}