/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { useState, useEffect, useCallback } from 'react';
import LoginGoogle from '@/components/LoginGoogle';
import TaskList from '@/components/TaskList';
import { registerUser, fetchTasks, addTask, completeTask } from './actions';
import SignOut from "@/components/SignOut";

// Define Task interface for consistency across the app
interface Task {
  id: number;
  task_text: string;
  task_completed: boolean;
  date_added: Date
}

export default function Home() {

  // Store the connected wallet address
  const [currentAccount, setCurrentAccount] = useState<string>('');
  // Store tasks retrieved from the blockchain
  const [tasks, setTasks] = useState<Task[]>([]);
  // Store the new task input value
  const [input, setInput] = useState<string>('');
  // Track loading state during transactions
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Track what device type is being used

  const { data: session } = useSession();
  console.log(!session)

    // Update to use email from session
    useEffect(() => {
      if (session && session.user?.email) {
        setCurrentAccount(session.user.email);
        // Register user with email when they sign in
        registerUser(session.user.email).catch(error => {
          console.error('Error registering user:', error);
        });
      } else {
        setCurrentAccount('');
      }
    }, [session]);
  
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


  // Fetch tasks when account changes
  useEffect(() => {
    if (currentAccount) {
      handleFetchTasks();
    }
  }, [currentAccount, handleFetchTasks]);

  // ===== COMPONENT RENDERING =====
  return (
    <main className="min-h-screen w-full bg-[#74716E] text-white flex items-center justify-center">
      {session && (
        <SignOut signOut={signOut} />
      )}
  
      {!session ? (
        <LoginGoogle signIn={signIn} />
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