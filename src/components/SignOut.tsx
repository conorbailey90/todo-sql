/* eslint-disable @typescript-eslint/no-explicit-any */

function SignOut({signOut}: any) {
  return (
    <div>
        
        <button className="absolute top-1 right-[2.5%] bg-[#161616] py-1 px-5 cursor-pointer hover:opacity-[.8]" onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}

export default SignOut