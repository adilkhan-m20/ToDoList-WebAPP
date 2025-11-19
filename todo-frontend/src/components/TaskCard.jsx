export default function TaskCard({ task, updateTask, deleteTask }) {
  return (
    <div className="border border-gray-200 bg-gray-50 p-4 rounded-xl shadow flex justify-between items-start">
      <div>
        <h3 className="font-bold text-lg">{task.title}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
        <p
          className={`text-xs mt-1 font-semibold ${
            task.status === "done" ? "text-green-600" : "text-yellow-600"
          }`}
        >
          Status: {task.status}
        </p>
      </div>

      <div className="flex flex-col gap-2 ml-4">
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 transition"
          onClick={() => updateTask(task)}
        >
          Toggle
        </button>

        <button
          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
          onClick={() => deleteTask(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
