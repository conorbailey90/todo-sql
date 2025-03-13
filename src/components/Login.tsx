/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC } from 'react';

interface LoginProps {
  connectWallet: () => Promise<void>;
  isLoading: boolean;
  walletInstalled: boolean;
  isMobileDevice: boolean;
}

const Login: FC<LoginProps> = ({ connectWallet, isLoading, walletInstalled, isMobileDevice }) => {
  return (
    <div className="bg-[#2c2824] p-8 rounded-lg shadow-lg w-full max-w-md text-center">
      <h1 className="text-3xl font-bold mb-6">Task Manager</h1>
      
      {!walletInstalled && !isMobileDevice ? (
        <div className="mb-6">
          <p className="mb-4">Please install MetaMask or another Ethereum wallet to use this application.</p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#f6851b] text-white py-2 px-4 rounded hover:bg-[#e2761b] transition-colors"
          >
            Install MetaMask
          </a>
        </div>
      ) : (
        <div>
          <p className="mb-6">Connect your {isMobileDevice ? 'mobile wallet' : 'wallet'} to access your tasks.</p>
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="bg-[#f6851b] text-white py-3 px-6 rounded-full hover:bg-[#e2761b] transition-colors w-full flex items-center justify-center"
          >
            {isLoading ? (
              <span className="animate-pulse">Connecting...</span>
            ) : (
              <>
                <span>Connect Wallet</span>
              </>
            )}
          </button>
          
          {isMobileDevice && (
            <div className="mt-4 text-sm text-gray-300">
              <p>Using a mobile device? You can:</p>
              <ul className="list-disc pl-6 mt-2 text-left">
                <li>Open this page in MetaMasks browser</li>
                <li>Use WalletConnect-compatible wallets</li>
                <li>Use Trust Wallet or Coinbase Wallet</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;