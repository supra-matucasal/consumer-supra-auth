"use client";
export default function ProfileComponent({ session }: { session?: string }) {
  return (
    <div>
      {session && (
        <div>
          Access token:{" "}
          <span className="break-all">{session}</span>
          <br />
        </div>
      )}
    </div>
  )
}