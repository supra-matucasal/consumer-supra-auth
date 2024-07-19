import { getSession, getTempCode } from '@/utils/auth'
import { fetchUserInfo, verifyToken, getToken } from '@/services/auth'
import { headers } from 'next/headers'
import ProfileComponent from '@/components/profile'


export default async function Profile() {

  //const ipAddress = headers().get('x-forwarded-for') || headers().get('x-real-ip') || 'Unknown';
  //const agent = headers().get('user-agent') || 'Unknown';
  const tempCode = getTempCode();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">Welcome to Next.js + Directus</h1>
      {tempCode && <ProfileComponent tempToken={tempCode} />}
      <a href={`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/logout`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </a>
    </main>
  );
}
