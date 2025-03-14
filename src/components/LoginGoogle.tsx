/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface LoginGoogleProps {
  signIn: any;
}

export default function LoginGoogle({ signIn }: LoginGoogleProps) {

  return (
    <div className="bg-[#161616] p-6">
      <button className="cursor-pointer flex gap-2 justify-center items-center hover:opacity-[.6]" onClick={() => signIn("google")}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 256 256"><path d="M224,128a96,96,0,1,1-21.95-61.09,8,8,0,1,1-12.33,10.18A80,80,0,1,0,207.6,136H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128Z"></path></svg>Sign in with Google</button>
    </div>
  );
}

