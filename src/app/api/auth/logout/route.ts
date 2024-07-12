import { removeCookie, getCookie } from "@/utils/cookies";
import { permanentRedirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {

  console.log('GET /api/auth/logout')

  const client_id = process.env.AUTH_SUPRA_CLIENT_ID;
  const redirect_logout_url = process.env.NEXT_AUTH_REDIRECT_LOGOUT_URL;

  const cookieValue = getCookie('session')
  const { access_token } = JSON.parse(cookieValue || '{}');




  if (!access_token || client_id === undefined || redirect_logout_url === undefined) {
    return NextResponse.redirect(`${process.env.AUTH_REDIRECT_LOGOUT_URL}`, { status: 302 });
  }


  //Remove the cookie session
  removeCookie('session')

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