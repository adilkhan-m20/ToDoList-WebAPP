"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RegisterProps {
  onSuccess: (token: string) => void;
  onSwitchToLogin: () => void;
}

export default function Register({
  onSuccess,
  onSwitchToLogin,
}: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      onSuccess(data.token);
    } catch (err) {
      setError(
        "Network error. Make sure backend is running on http://localhost:3000"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-[#1a0033] p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary mb-1">TODO</h2>
          <p className="text-muted-foreground text-sm">
            Initialize Your Account
          </p>
        </div>

        {/* Register Card */}
        <div className="neon-box neon-box-primary p-6 rounded-lg backdrop-blur-sm bg-card/50 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-input border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-input border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-input border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded"
            >
              {loading ? "Creating Account..." : "JACKING IN..."}
            </Button>
          </form>
        </div>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-2">Already online?</p>
          <button
            onClick={onSwitchToLogin}
            className="text-accent hover:text-accent/80 font-semibold underline text-sm"
          >
            SIGN IN HERE
          </button>
        </div>
      </div>
    </div>
  );
}
