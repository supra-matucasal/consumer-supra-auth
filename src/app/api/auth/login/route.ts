import { generateRandomState, signState } from "@/utils/auth";
import { getCookie, setCookie } from "@/utils/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {


  //If we already have a session-cookie we should redirect to the callback URL
  const cookieName = process.env.SESSION_NAME;
  if (cookieName) {
    const cookieValue = getCookie(cookieName)
    const { access_token } = JSON.parse(cookieValue || '{}');

    if (access_token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/profile`);
    }
  }


  const redirect_url = process.env.NEXT_AUTH_REDIRECT_URL;
  const client_id = process.env.AUTH_SUPRA_CLIENT_ID;
  const state = generateRandomState();
  const signedState = signState(state)




  //Storing the state in the cookie
  setCookie('state', signedState, 'lax');

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
  //           const redirectUrl = "${process.env.AUTH_SUPRA_SERVER}/api/auth/authorize?client_id=${client_id}&redirect_uri=${redirect_url}&state=${state}";
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
  const redirectUrl = `${process.env.AUTH_SUPRA_SERVER}/api/auth/authorize?client_id=${client_id}&redirect_uri=${redirect_url}&state=${state}`;

  return new NextResponse(null, {
    status: 308,
    headers: {
      'Location': redirectUrl,
      //'Access-Control-Allow-Origin': '*',
      //Include credentials in the request
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}