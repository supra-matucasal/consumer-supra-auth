import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  //TODO: Implenet this
  // const authorization = req.headers.get('Authorization');
  // const bearerToken = authorization?.replace('Bearer ', '');

  // const client_id = process.env.AUTH_SUPRA_CLIENT_ID;
  // const client_secret = process.env.AUTH_SUPRA_CLIENT_SECRET;

  // const params = new URLSearchParams();
  // params.append('client_id', client_id || '');
  // params.append('client_secret', client_secret || '');


  // const { refresh_token } = await req.json();

  // const response = await fetch(`${process.env.AUTH_SUPRA_SERVER}/api/auth/refresh-token?${params.toString()}`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${bearerToken}`,
  //   },
  //   body: JSON.stringify({
  //     refresh_token
  //   })
  // });

  // console.log('Response status from token', response.status)

  // if (response.status !== 200) {
  //   return new NextResponse(JSON.stringify({ error: 'Invalid call to token' }), { status: 400 });
  // }
  // //const { id, email } = await response.json();
  // //const { access_token: new_access_token, refresh_token: new_refresh_token } = data;
  // const { access_token: new_access_token, refresh_token: new_refresh_token } = await response.json();

  // return new NextResponse(JSON.stringify({
  //   access_token: new_access_token,
  //   refresh_token: new_refresh_token
  // }), { status: 200 });

}