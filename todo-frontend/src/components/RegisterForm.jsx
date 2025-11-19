import { useState } from "react";

export default function RegisterForm({ onRegister, switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
        placeholder="Full Name"
        onChange={(e) => setName(e.target.value)}
      />

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
        onClick={() => onRegister(name, email, password)}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Register
      </button>

      <p className="text-sm text-center mt-3">
        Already have an account?
        <span
          className="text-indigo-600 font-semibold cursor-pointer ml-1"
          onClick={switchToLogin}
        >
          Login
        </span>
      </p>
    </div>
  );
}
