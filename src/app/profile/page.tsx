import ProfileComponent from '@/components/profile';
import { getTempCode } from '@/utils/auth';


export default async function Profile() {

  //const ipAddress = headers().get('x-forwarded-for') || headers().get('x-real-ip') || 'Unknown';
  //const agent = headers().get('user-agent') || 'Unknown';
  const session = getTempCode();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">Welcome to Next.js + Directus</h1>
      {session && <ProfileComponent session={session} />}
      <a href={`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/logout`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </a>
    </main>
  );
}
