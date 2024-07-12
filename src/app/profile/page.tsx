import { getSession } from '@/utils/auth'
import { fetchUserInfo, verifyToken } from '@/services/auth'


export default  async function Profile() {

  const session = getSession();
  const access_token = session?.access_token;
  const email = session?.email;

  let tokenIsValid = null;

  if (access_token && email) {
    tokenIsValid = await verifyToken(access_token)
    console.log('tokenIsValid: ', tokenIsValid)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">Welcome to Next.js + Directus</h1>
      <div className="text-1x1">
        This is my profile:
        <li>Email: {email}</li>
        <li>
          Access token:{" "}
          {access_token && access_token.length > 20 ? (
            <span className="break-all">{access_token}</span>
          ) : (
            access_token
          )}
        </li>
        <li>
        tokenIsValid:{" "}
          {tokenIsValid !== null ? (
            <pre>{tokenIsValid.toString()}</pre>
          ) : (
            "Loading..."
          )}
        </li>
      </div>
      <a href={`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/logout`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </a>
    </main>
  );
}
