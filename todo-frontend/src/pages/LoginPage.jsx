import { useState } from "react";
import LoginForm from "../components/LoginForm";

export default function LoginPage({ onLogin, switchToRegister }) {
  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl p-8 mt-10">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        Login
      </h1>

      <LoginForm onLogin={onLogin} switchToRegister={switchToRegister} />
    </div>
  );
}
