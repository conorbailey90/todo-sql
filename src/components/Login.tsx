
interface LoginProps {
  connectWallet: () => void; // Type for connectWallet function
  isLoading: boolean; // Type for isLoading
  walletInstalled: boolean
}

function Login({ connectWallet, isLoading , walletInstalled}: LoginProps) {


  return (
    <div className="text-center bg-[#000000] p-8 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 tracking-tight">Decentralized Todo App</h1>
      
      {walletInstalled ? (
        <div>
             <p className="text-gray-400 mb-4">Connect your wallet to get started</p>
            <button
                onClick={connectWallet}
                className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                CONNECT WALLET
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