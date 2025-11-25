"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TodoList from "./todo-list";
import CategoryManager from "./category-manager";

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

interface TodoDashboardProps {
  token: string;
  onLogout: () => void;
}

const API_URL = "http://localhost:5000";

export default function TodoDashboard({ token, onLogout }: TodoDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "todo" | "in_progress" | "done"
  >("all");
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError("Failed to load tasks");
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description || null,
          status: "todo",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const newTask = data.task;
        for (const catId of selectedCategoryIds) {
          await fetch(`${API_URL}/tasks/${newTask.id}/categories/${catId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        // Refetch tasks to get updated category assignments
        await fetchTasks();
        setTitle("");
        setDescription("");
        setSelectedCategoryIds([]);
        setShowNewTaskForm(false);
      } else {
        setError(data.error || "Failed to add task");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      setTasks(tasks.map((t) => (t.id === id ? data.task : t)));
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const toggleCategorySelection = (catId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  const filteredTasks = tasks.filter((t) => {
    const statusMatch = activeTab === "all" || t.status === activeTab;
    const categoryMatch =
      selectedCategory === null ||
      (t.categories && t.categories.some((c) => c.id === selectedCategory));
    return statusMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#1a0033]">
      {/* Header */}
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <p className="text-muted-foreground text-sm">TODO SYSTEM v2.0</p>
          </div>
          <Button
            onClick={onLogout}
            className="bg-destructive/80 hover:bg-destructive text-destructive-foreground px-4 py-2 rounded"
          >
            DISCONNECT
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6 py-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <CategoryManager
            token={token}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categories={categories}
            onCategoriesChange={setCategories}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded text-destructive">
              {error}
              <button
                onClick={() => setError("")}
                className="float-right font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* New Task Form */}
          {showNewTaskForm && (
            <div className="neon-box neon-box-primary p-6 rounded-lg backdrop-blur-sm bg-card/50">
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    TASK TITLE
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task..."
                    className="bg-input border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    DESCRIPTION (OPTIONAL)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details..."
                    className="w-full bg-input border border-primary/30 text-foreground placeholder:text-muted-foreground rounded px-3 py-2 focus:outline-none focus:border-primary"
                    rows={3}
                  />
                </div>

                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">
                      CATEGORIES (OPTIONAL)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategorySelection(cat.id)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                            selectedCategoryIds.includes(cat.id)
                              ? "bg-accent text-accent-foreground"
                              : "bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 rounded"
                  >
                    {loading ? "INITIATING..." : "CREATE TASK"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowNewTaskForm(false);
                      setTitle("");
                      setDescription("");
                      setSelectedCategoryIds([]);
                    }}
                    className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold py-2 rounded"
                  >
                    CANCEL
                  </Button>
                </div>
              </form>
            </div>
          )}

          {!showNewTaskForm && (
            <Button
              onClick={() => setShowNewTaskForm(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded"
            >
              + NEW TASK
            </Button>
          )}

          {/* Status Tabs */}
          <div className="flex gap-2 border-b border-primary/20 overflow-x-auto">
            {["all", "todo", "in_progress", "done"].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status as any)}
                className={`px-4 py-2 font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === status
                    ? "border-secondary text-secondary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {status === "all"
                  ? "ALL"
                  : status.toUpperCase().replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Task List */}
          <TodoList
            tasks={filteredTasks}
            onDelete={handleDeleteTask}
            onUpdateStatus={handleUpdateStatus}
            token={token}
            onTaskUpdate={fetchTasks}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}
