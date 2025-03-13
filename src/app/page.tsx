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
      request: (args: { method: string }) => Promise<string[]>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
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
      setIsLoading(true);
      
      // Use the properly typed window.ethereum
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
        await registerUser(accounts[0]);
        setCurrentAccount(accounts[0]);
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

  // Initialize and set up event listeners
  useEffect(() => {
    const checkWalletInstallation = () => {
      setWalletInstalled(!!window.ethereum);
    };

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected all accounts
        setCurrentAccount('');
      } else {
        // User switched to a different account or connected for the first time
        try {
          await registerUser(accounts[0]);
          setCurrentAccount(accounts[0]);
        } catch (error) {
          console.error('Error registering user after account change:', error);
        }
      }
    };

    // Initial checks
    checkWalletInstallation();

    // Add event listeners for MetaMask if available
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
      {!walletInstalled || !currentAccount ? (
        <Login 
          connectWallet={connectWallet} 
          isLoading={isLoading} 
          walletInstalled={walletInstalled}
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