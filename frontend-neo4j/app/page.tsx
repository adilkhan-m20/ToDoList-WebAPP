"use client";

import { useState, useEffect } from "react";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import TodoDashboard from "@/components/dashboard/todo-dashboard";

export default function Home() {
  const [authState, setAuthState] = useState<
    "login" | "register" | "dashboard"
  >("login");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setAuthState("dashboard");
    }
  }, []);

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setAuthState("dashboard");
  };

  const handleRegisterSuccess = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setAuthState("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthState("login");
  };

  return (
    <main className="min-h-screen bg-background">
      {authState === "login" && !token && (
        <Login
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setAuthState("register")}
        />
      )}
      {authState === "register" && !token && (
        <Register
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setAuthState("login")}
        />
      )}
      {authState === "dashboard" && token && (
        <TodoDashboard token={token} onLogout={handleLogout} />
      )}
    </main>
  );
}
