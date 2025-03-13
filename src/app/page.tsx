/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Login from '@/components/Login';
import TaskList from '@/components/TaskList';
import { registerUser, fetchTasks, addTask, completeTask } from './actions';

// Define Task interface for consistency across the app
interface Task {
  id: number;
  task_text: string;
  task_completed: boolean;
  date_added: Date
}

// Create a proper type for the ethereum property on window
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

export default function Home() {
  // ===== STATE MANAGEMENT =====
  // Check if wallet is available (MetaMask or mobile wallet)
  const [walletAvailable, setWalletAvailable] = useState(false);
  // Store the connected wallet address
  const [currentAccount, setCurrentAccount] = useState<string>('');
  // Store tasks retrieved from the blockchain
  const [tasks, setTasks] = useState<Task[]>([]);
  // Store the new task input value
  const [input, setInput] = useState<string>('');
  // Track loading state during transactions
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Track what device type is being used
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);

  // Detect if user is on a mobile device
  useEffect(() => {
    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    };
    
    setIsMobileDevice(checkMobileDevice());
  }, []);

  // Check if wallet is available without triggering connection
  useEffect(() => {
    const checkWalletAvailability = () => {
      // Check if MetaMask or other injected wallet is available
      const hasInjectedWallet = typeof window !== 'undefined' && !!window.ethereum;
      setWalletAvailable(hasInjectedWallet);
    };

    checkWalletAvailability();
  }, []);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      // Handle mobile device specific wallet connection
      if (isMobileDevice) {
        // For mobile devices using in-app browsers like MetaMask Mobile or Trust Wallet
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          if (accounts.length > 0) {
            await registerUser(accounts[0]);
            setCurrentAccount(accounts[0]);
          }
        } 
        // For mobile devices without an injected wallet, provide deeplink options
        else {
          // Option 1: Open in MetaMask mobile app
          const dappUrl = window.location.href;
          const metamaskAppDeepLink = `https://metamask.app.link/dapp/${dappUrl.replace(/^https?:\/\//, '')}`;
          
          if (confirm("No wallet detected. Open in MetaMask app?")) {
            window.location.href = metamaskAppDeepLink;
            return;
          }
        }
      } 
      // Desktop flow
      else {
        if (!window.ethereum) {
          alert("Please install MetaMask or another Ethereum wallet to use this application.");
          setWalletAvailable(false);
          return;
        }
        
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          await registerUser(accounts[0]);
          setCurrentAccount(accounts[0]);
        }
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchTasks = useCallback(async () => {
    if (!currentAccount) return;
    
    try {
      setIsLoading(true);
      const fetchedTasks: Task[] = await fetchTasks(currentAccount);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount]);

  const handleAddTask = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      alert('Please enter a task!')
      return;
    }
    
    try {
      setIsLoading(true);
      await addTask(currentAccount, input);
      setInput(''); // Clear input after adding
      await handleFetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  }, [input, currentAccount, handleFetchTasks]);
  
  const handleCompleteTask = useCallback(async (taskId: number) => {
    try {
      console.log(`CURRENT: ${currentAccount}`)
      setIsLoading(true);
      await completeTask(currentAccount, taskId);
      await handleFetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount, handleFetchTasks]);

  // Initialize and set up event listeners without automatically connecting
  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected all accounts
        setCurrentAccount('');
      } else {
        // User switched to a different account
        try {
          await registerUser(accounts[0]);
          setCurrentAccount(accounts[0]);
        } catch (error) {
          console.error('Error registering user after account change:', error);
        }
      }
    };

    // Add event listeners for wallet if available
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    // Clean up event listeners when component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  // Fetch tasks when account changes
  useEffect(() => {
    if (currentAccount) {
      handleFetchTasks();
    }
  }, [currentAccount, handleFetchTasks]);

  // ===== COMPONENT RENDERING =====
  return (
    <main className="min-h-screen bg-[#74716E] text-white flex items-center justify-center p-6">
      {!currentAccount ? (
        <Login 
          connectWallet={connectWallet} 
          isLoading={isLoading} 
          walletInstalled={walletAvailable}
          isMobileDevice={isMobileDevice}
        />
      ) : (
        <TaskList 
          addNewTask={handleAddTask}
          completeTask={handleCompleteTask}
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