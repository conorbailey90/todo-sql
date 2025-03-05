'use client';

import { useState, useEffect, useCallback } from 'react';
import Login from '@/components/Login';
import TaskList from '@/components/TaskList';

// Define Task interface for consistency across the app
interface Task {
  id: number;
  taskText: string;
  isComplete: boolean;
}

export default function Home() {
    // ===== STATE MANAGEMENT =====
    // Check if MetaMask is installed on initial load
    const [walletInstalled, setWalletInstalled] = useState(false);

    // Store the connected wallet address
    const [currentAccount, setCurrentAccount] = useState<string>('');
    // Store tasks retrieved from the blockchain
    const [tasks, setTasks] = useState<Task[]>([]);
    // Store the new task input value
    const [input, setInput] = useState<string>('');
    // Track loading state during transactions
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                setWalletInstalled(false);
                return;
            }
        
            // Request access to the user's MetaMask accounts
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
    
            // Set the first account as the current account
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
            }

            console.log(accounts[0])
        } catch (err) {
            console.error('Failed to connect wallet:', err);
        }
    }


    const addNewTask = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
    }, [])
  


    const completeTask = useCallback(async (taskId: number) => {

    }, []) 

  // Initial useEffect to check if wallet is installed and get selectedCahin from LS
  useEffect(() => {
    setWalletInstalled(!!window.ethereum);

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected all accounts
        setCurrentAccount('');
      } else {
        // User switched to a different account or connected for the first time
        setCurrentAccount(accounts[0]);
        
      }
    }

    // Add event listeners for MetaMask
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Silently check for connected accounts without prompting
    if (window.ethereum.selectedAddress) {
      // If MetaMask already has a selected address in this tab
      setCurrentAccount(window.ethereum.selectedAddress);
    }

    // Clean up event listeners when component unmounts
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  },[]);

  // ===== COMPONENT RENDERING =====
  return (
    <main className="min-h-screen bg-[#161616] text-white flex items-center justify-center p-6">
      
      {/* Show login component if not connected, otherwise show task list */}
      {!walletInstalled || !currentAccount ? (
        <Login 
          connectWallet={connectWallet} 
          isLoading={isLoading} 
          walletInstalled={walletInstalled}
        />
      ) : (
        <TaskList 
          addNewTask={addNewTask}
          completeTask={completeTask}
          isLoading={isLoading}
          tasks={tasks}
          input={input}
          setInput={setInput}
          currentAccount={currentAccount}
        />
      )}
    </main>
  );
}