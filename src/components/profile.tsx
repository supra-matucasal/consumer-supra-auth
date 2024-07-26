"use client";
export default function ProfileComponent({ session }: { session?: any }) {
  return (
    <div>
      {session && (
        <div>
          Access token:{" "}
          <span className="break-all">{session.access_token}</span>
          <br />
        </div>
      )}
    </div>
  )
}