import { useState } from "react";

export default function LoginForm({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={() => onLogin(email, password)}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Login
      </button>

      <p className="text-sm text-center mt-3">
        Don’t have an account?
        <span
          className="text-indigo-600 font-semibold cursor-pointer ml-1"
          onClick={switchToRegister}
        >
          Register
        </span>
      </p>
    </div>
  );
}
