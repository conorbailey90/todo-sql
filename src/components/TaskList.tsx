// Define Task interface for consistency across the app
interface Task {
  id: number;
  task_text: string;
  task_completed: boolean;
  date_added: Date
}

interface TaskListProps {
  addNewTask: (e: React.FormEvent) => Promise<void>; // Function to add a new task
  completeTask: (taskId: number) => Promise<void>; // Function to mark a task as complete
  isLoading: boolean; // Indicates if a transaction is in progress
  tasks: Task[]; // List of tasks retrieved from the blockchain
  input: string; // The current value of the task input field
  setInput: (value: string) => void; // Function to update the input field
  currentAccount: string; // The connected user's wallet address
}

function TaskList({ addNewTask, completeTask, isLoading, tasks, input, setInput, currentAccount}: TaskListProps) {
 
  return (
    <div className="w-full max-w-lg bg-gray-800 p-6 rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold mb-4 tracking-tight">Your Todo List</h1>
      <p className="text-sm text-gray-400 mb-2">
        Connected: <span className="font-mono">{currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}</span>
      </p>
     

      <form onSubmit={addNewTask} className="mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="mt-3 w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-md"
          disabled={isLoading}
        >
          {isLoading ? 'UPDATING...' : 'ADD TASK'}
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="text-gray-400 text-center">No tasks yet. Add one above!</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-sm hover:bg-gray-600 transition duration-200"
            >
              <span
                className={`font-medium ${task.task_completed ? 'line-through text-gray-500' : 'text-white'}`}
              >
                {task.task_text}
              </span>
              {!task.task_completed && (
                <button
                  onClick={() => completeTask(task.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? '...' : 'DONE'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
  </div>
  )
}

export default TaskList;