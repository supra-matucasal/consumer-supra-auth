import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('Authorization');
  const bearerToken = authorization?.replace('Bearer ', '');
  
  //const client_id = process.env.AUTH_SUPRA_CLIENT_ID;
  //const client_secret = process.env.AUTH_SUPRA_CLIENT_SECRET;

  //const params = new URLSearchParams();
  //params.append('client_id', client_id || '');
  //params.append('client_secret', client_secret || '');


  const response = await fetch(`${process.env.AUTH_SUPRA_SERVER}/api/auth/verify-token`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
    },
  });

  console.log('Response status from token', response.status)

  if (response.status !== 200) {
    return new NextResponse(JSON.stringify({ error: 'Invalid call to token in /verify-token' }), { status: 400 });
  }
  const { id, email } = await response.json();
  
  return new NextResponse(JSON.stringify({ id, email }), { status: 200 });

}