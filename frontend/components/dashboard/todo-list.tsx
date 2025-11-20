"use client";
import TodoCard from "./todo-card";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
  categories: Array<{ id: number; name: string }>;
}

interface TodoListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: string) => void;
  token: string;
}

export default function TodoList({
  tasks,
  onDelete,
  onUpdateStatus,
  token,
}: TodoListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 neon-box neon-box-primary p-8 rounded-lg">
        <p className="text-muted-foreground text-lg">NO TASKS DETECTED</p>
        <p className="text-muted-foreground text-sm mt-2">
          Create a new task to begin
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TodoCard
          key={task.id}
          task={task}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
          token={token}
        />
      ))}
    </div>
  );
}
