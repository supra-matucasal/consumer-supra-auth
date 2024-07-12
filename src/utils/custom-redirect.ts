import { NextResponse } from "next/server";


export const customRedirect = (url: string) => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redirecting...</title>
    </head>
    <body>
      <script>
        (function() {
          const redirectUrl = "${url}";
          window.location.href = redirectUrl;
        })();
      </script>
    </body>
  </html>
`;

//return NextResponse.redirect(`${process.env.AUTH_SUPRA_SERVER}/api/auth/authorize?client_id=${client_id}&redirect_uri=${redirect_url}&state=${state}`);
return new NextResponse(htmlContent, {
  headers: {
    'Content-Type': 'text/html'
  },
});


};