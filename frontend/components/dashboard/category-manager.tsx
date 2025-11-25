"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
}

interface CategoryManagerProps {
  token: string;
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

const API_URL = "http://localhost:5000";

export default function CategoryManager({
  token,
  selectedCategory,
  onSelectCategory,
  categories,
  onCategoriesChange,
}: CategoryManagerProps) {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      onCategoriesChange(data.categories || []);
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      if (response.ok) {
        await fetchCategories();
        setCategoryName("");
      }
    } catch (err) {
      console.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neon-box neon-box-primary p-4 rounded-lg backdrop-blur-sm bg-card/50">
      <h3 className="text-sm font-bold text-secondary mb-4 uppercase">
        Categories
      </h3>

      <form onSubmit={handleAddCategory} className="space-y-3 mb-4">
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="New category..."
          className="bg-input border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary text-sm"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 rounded text-xs"
        >
          {loading ? "ADDING..." : "ADD CATEGORY"}
        </Button>
      </form>

      <div className="space-y-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full p-2 rounded text-xs font-semibold text-left transition-colors ${
            selectedCategory === null
              ? "bg-secondary/20 border border-secondary text-secondary"
              : "bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20"
          }`}
        >
          ALL TASKS
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`w-full p-2 rounded text-xs font-semibold text-left transition-colors ${
              selectedCategory === cat.id
                ? "bg-secondary/20 border border-secondary text-secondary"
                : "bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="text-muted-foreground text-xs text-center py-4">
          No categories yet
        </p>
      )}
    </div>
  );
}
