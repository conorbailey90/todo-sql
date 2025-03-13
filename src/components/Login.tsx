
interface LoginProps {
  connectWallet: () => void; // Type for connectWallet function
  isLoading: boolean; // Type for isLoading
  walletInstalled: boolean
}

function Login({ connectWallet, isLoading , walletInstalled}: LoginProps) {


  return (
    <div className="text-center bg-[#161616] p-8 ">
      <h1 className="text-xl font-bold mb-4 tracking-tight">Decentralized Todo App</h1>
      
      {walletInstalled ? (
        <div>
             <p className="text-[#ffffffcf] mb-4">Connect your wallet to get started</p>
            <button
                onClick={connectWallet}
                className="cursor-pointer bg-[#74716eb8] text-white px-6 py-3 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                Connect Wallet
            </button>
        </div>
        )
    :
        (
            <p>Please install Metamask to use this app.</p>
        )}
    </div>
  );
}

export default Login;