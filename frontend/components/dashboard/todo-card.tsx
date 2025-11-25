"use client";

import { useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
  categories: Array<{ id: number; name: string }>;
}

interface TodoCardProps {
  task: Task;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: string) => void;
  token: string;
  onTaskUpdate: () => void;
  categories: Category[];
}

const statusColors = {
  todo: "border-primary/50 bg-primary/5",
  in_progress: "border-accent/50 bg-accent/5",
  done: "border-secondary/50 bg-secondary/5",
};

const statusLabels = {
  todo: "TODO",
  in_progress: "IN PROGRESS",
  done: "COMPLETED",
};

const API_URL = "http://localhost:5000";

export default function TodoCard({
  task,
  onDelete,
  onUpdateStatus,
  token,
  onTaskUpdate,
  categories,
}: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [saving, setSaving] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  const handleSave = async () => {
    if (editTitle.trim() === task.title) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle }),
      });
      if (response.ok) {
        setIsEditing(false);
        onTaskUpdate();
      }
    } catch (err) {
      console.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignCategory = async (categoryId: number) => {
    try {
      await fetch(`${API_URL}/tasks/${task.id}/categories/${categoryId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskUpdate();
    } catch (err) {
      console.error("Failed to assign category");
    }
  };

  const handleRemoveCategory = async (categoryId: number) => {
    try {
      await fetch(`${API_URL}/tasks/${task.id}/categories/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskUpdate();
    } catch (err) {
      console.error("Failed to remove category");
    }
  };

  const taskCategoryIds = task.categories?.map((c) => c.id) || [];
  const unassignedCategories = categories.filter(
    (c) => !taskCategoryIds.includes(c.id)
  );

  const borderClass =
    statusColors[task.status as keyof typeof statusColors] || statusColors.todo;

  return (
    <div
      className={`neon-box p-4 rounded-lg backdrop-blur-sm border ${borderClass}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {isEditing ? (
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="w-full bg-input border border-primary/30 text-foreground px-2 py-1 rounded text-lg font-semibold"
            />
          ) : (
            <h3
              onClick={() => setIsEditing(true)}
              className="text-lg font-semibold text-foreground cursor-pointer hover:text-secondary transition-colors"
            >
              {editTitle}
            </h3>
          )}

          {task.description && (
            <p className="text-muted-foreground text-sm mt-1">
              {task.description}
            </p>
          )}

          <div className="flex gap-2 mt-2 flex-wrap items-center">
            {task.categories &&
              task.categories.length > 0 &&
              task.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent text-xs rounded font-semibold group"
                >
                  {cat.name}
                  <button
                    onClick={() => handleRemoveCategory(cat.id)}
                    className="ml-1 text-accent/60 hover:text-destructive transition-colors"
                    title="Remove category"
                  >
                    ×
                  </button>
                </span>
              ))}

            <div className="relative">
              <button
                onClick={() => setShowCategorySelector(!showCategorySelector)}
                className="px-2 py-1 bg-primary/10 border border-primary/30 text-primary text-xs rounded font-semibold hover:bg-primary/20 transition-colors"
              >
                + TAG
              </button>

              {showCategorySelector && unassignedCategories.length > 0 && (
                <div className="absolute top-full left-0 mt-1 z-10 bg-card border border-primary/30 rounded shadow-lg min-w-[120px]">
                  {unassignedCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleAssignCategory(cat.id);
                        setShowCategorySelector(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-xs text-foreground hover:bg-primary/20 transition-colors"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}

              {showCategorySelector && unassignedCategories.length === 0 && (
                <div className="absolute top-full left-0 mt-1 z-10 bg-card border border-primary/30 rounded shadow-lg p-2">
                  <p className="text-xs text-muted-foreground">
                    No more categories
                  </p>
                </div>
              )}
            </div>
          </div>

          {task.due_date && (
            <p className="text-muted-foreground text-xs mt-2">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <select
            value={task.status}
            onChange={(e) => onUpdateStatus(task.id, e.target.value)}
            className="bg-input border border-primary/30 text-foreground text-xs px-2 py-1 rounded font-semibold"
          >
            <option value="todo">TODO</option>
            <option value="in_progress">IN PROGRESS</option>
            <option value="done">DONE</option>
          </select>

          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1 bg-destructive/20 hover:bg-destructive/30 text-destructive text-xs rounded font-semibold transition-colors"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}
