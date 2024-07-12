import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">Welcome to Next.js + Directus</h1>
      <a href={`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go to Login
      </a>
    </main>
  );
}
