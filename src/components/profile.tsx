"use client";



export default function ProfileComponent({ session }: { session?: string }) {
  // const [data, setData] = useState<any>(null)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const localServer = process.env.NEXT_PUBLIC_APP_API_URL;
  //     if (session) {
  //       try {
  //         const response = await fetch(`${localServer}/auth/token`, {
  //           cache: 'no-store',
  //           method: 'GET',
  //           credentials: 'include',
  //         });
  //         if (response) {
  //           console.log("i am here!!!!")
  //           const data = await response.json();
  //           document.cookie = `session=${data.access_token}; path=/;`;
  //           setData(data);
  //         }
  //       } catch (error) {
  //         console.error('Error verifying token:', error);
  //       }
  //     }
  //   };
  //   fetchData();
  // }, []);

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