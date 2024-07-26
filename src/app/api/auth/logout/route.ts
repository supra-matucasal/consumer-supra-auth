import { getSession } from "@/utils/auth";
import { removeCookie } from "@/utils/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const client_id = process.env.AUTH_SUPRA_CLIENT_ID;
  const redirect_logout_url = process.env.NEXT_AUTH_REDIRECT_LOGOUT_URL;


  const session = getSession();

  if (!session || client_id === undefined || redirect_logout_url === undefined) {
    return NextResponse.redirect(`${process.env.AUTH_REDIRECT_LOGOUT_URL}`, { status: 302 });
  }
  const agent = req.headers.get('user-agent') || 'Unknown';
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';

  //Remove the cookie session
  removeCookie('session')

  // const response = 
  await fetch(`http://localhost:9000/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  });
  // console.log('response------------->', response)
  // if (response.status !== 201) {
  //   console.error('Failed to logout');
  //   return new NextResponse(JSON.stringify({ error: 'Failed to logout' }), { status: 400 });
  // }
  //Logout from the SSO
  return NextResponse.redirect(`${process.env.AUTH_SUPRA_SERVER}/api/auth/logout?client_id=${client_id}&redirect_logout_url=${redirect_logout_url}`, { status: 302 });


  // const htmlContent = `
  //   <!DOCTYPE html>
  //   <html lang="en">
  //     <head>
  //       <meta charset="UTF-8">
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <title>Redirecting...</title>
  //     </head>
  //     <body>
  //       <script>
  //         (function() {
  //           const redirectUrl = "${process.env.AUTH_SUPRA_SERVER}/logout?client_id=${client_id}&redirect_logout_url=${redirect_logout_url}";
  //           window.location.href = redirectUrl;
  //         })();
  //       </script>
  //     </body>
  //   </html>
  // `;

  // return new NextResponse(htmlContent, {
  //   headers: {
  //     'Content-Type': 'text/html'
  //   },
  // });
}