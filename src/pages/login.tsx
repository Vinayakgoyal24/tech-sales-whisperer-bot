import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/login",
        new URLSearchParams({
          username: email,
          password,
        })
      );
      localStorage.setItem("token", res.data.access_token);
      navigate("/");
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-slate-100 relative">
      {/* Logo top right */}
      <img
        src="/logo.png"
        alt="Logo"
        className="absolute top-4 right-4 w-32 h-32 object-contain"
      />

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          AI SALES AGENT - OTSUKA SHOKAI
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
            onClick={login}
          >
            Login
          </button>
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
