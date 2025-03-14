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

export async function registerUser(email: string): Promise<User[]> {
  const sql = getDb();
  
  const data = await sql`
    SELECT * FROM users
    WHERE wallet_address = ${email};
  ` as QueryResult<User>;

  if (data.length === 0) {
    const newUser = await sql`
      INSERT INTO users (wallet_address)
      VALUES (${email})
      RETURNING *;
    ` as QueryResult<User>;
    return newUser;
  }
  
  return data;
}

export async function fetchTasks(email: string): Promise<Task[]> {

  const sql = getDb();
  
  const data = await sql`
    SELECT * FROM tasks 
    WHERE user_wallet_address = ${email};
  ` as QueryResult<Task>;
  
  return data;
}

export async function addTask(email: string, task: string): Promise<void> {

  const sql = getDb();
  
  await sql`
    INSERT INTO tasks (user_wallet_address, task_text)
    VALUES (${email}, ${task})
  `;
}

export async function completeTask(email: string, taskId: number): Promise<void> {
  const sql = getDb();
  
  await sql`
   UPDATE tasks
    SET task_completed = TRUE, 
    date_completed = NOW()
    WHERE id = ${taskId} 
    AND user_wallet_address = ${email}
    RETURNING *;
  `;
}