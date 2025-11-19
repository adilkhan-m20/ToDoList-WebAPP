import { useEffect } from "react";
import TaskCard from "../components/TaskCard";

export default function TaskPage({
  tasks,
  form,
  setForm,
  loadTasks,
  addTask,
  updateTask,
  deleteTask,
}) {
  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-10">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        Your Tasks
      </h1>

      {/* Add Task Form */}
      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Task Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      ></textarea>

      <button
        onClick={addTask}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Add Task
      </button>

      {/* Tasks List */}
      <div className="mt-6 space-y-4">
        {tasks.length === 0 && (
          <p className="text-center text-gray-500">No tasks yet.</p>
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}
