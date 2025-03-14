/* eslint-disable @typescript-eslint/no-explicit-any */

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
    <div className="w-[95%] bg-[#161616] p-6">
      <h1 className=" mb-4 tracking-tight">Your Todo List</h1>
      <p className="text-white mb-2">
        Connected: {currentAccount}
      </p>
     

      <form onSubmit={addNewTask} className="mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
          className="w-full p-3 bg-[#ffffff27] text-white placeholder-white focus:outline-none disabled:opacity-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="cursor-pointer mt-3 w-full bg-[#74716E] text-white p-3 hover:bg-black transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-md"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Add Task'}
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="text-white text-center">No tasks yet. Add one above!</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => !task.task_completed && (
            
            <li
              key={task.id}
              className="flex justify-between items-center p-4 bg-[#ffffff27] transition duration-200"
            >
              <span
                className={`font-medium ${task.task_completed ? 'line-through text-gray-500' : 'text-white'}`}
              >
                {task.task_text}
              </span>
              {!task.task_completed && (
                <button
                  onClick={() => completeTask(task.id)}
                  className="cursor-pointer bg-[#74716E] text-white px-3 py-1 hover:bg-black transition duration-200 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? '...' : 'Done'}
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