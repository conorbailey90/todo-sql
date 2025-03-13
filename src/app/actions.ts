// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

// Define interfaces for database entities
interface User {
  id: number;
  wallet_address: string;
  created_at?: Date;
}

interface Task {
    id: number;
    task_text: string;
    task_completed: boolean;
    date_added: Date    
  }
  

// Type for SQL query results
type QueryResult<T> = T[];

/**
 * Get database connection
 */
function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }
  return neon(databaseUrl);
}

/**
 * Validate wallet address format
 */
function validateWalletAddress(walletAddress: string): void {
  if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error("Invalid MetaMask wallet address");
  }
}

export async function registerUser(walletAddress: string): Promise<User[]> {
  validateWalletAddress(walletAddress);
  const sql = getDb();
  
  const data = await sql`
    SELECT * FROM users
    WHERE wallet_address = ${walletAddress};
  ` as QueryResult<User>;

  if (data.length === 0) {
    const newUser = await sql`
      INSERT INTO users (wallet_address)
      VALUES (${walletAddress})
      RETURNING *;
    ` as QueryResult<User>;
    return newUser;
  }
  
  return data;
}

export async function fetchTasks(walletAddress: string): Promise<Task[]> {
  validateWalletAddress(walletAddress);
  const sql = getDb();
  
  const data = await sql`
    SELECT * FROM tasks 
    WHERE user_wallet_address = ${walletAddress};
  ` as QueryResult<Task>;
  
  return data;
}

export async function addTask(walletAddress: string, task: string): Promise<void> {
  validateWalletAddress(walletAddress);
  const sql = getDb();
  
  await sql`
    INSERT INTO tasks (user_wallet_address, task_text)
    VALUES (${walletAddress}, ${task})
  `;
}

export async function completeTask(walletAddress: string, taskId: number): Promise<void> {
  validateWalletAddress(walletAddress);
  const sql = getDb();
  
  await sql`
   UPDATE tasks
    SET task_completed = TRUE, 
    date_completed = NOW()
    WHERE id = ${taskId} 
    AND user_wallet_address = ${walletAddress}
    RETURNING *;
  `;
}