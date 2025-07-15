import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");

  const navigate = useNavigate();

  const signup = async () => {
    try {
      await axios.post("http://localhost:8000/signup", {
        email,
        password,
        name,
        company,
        contact,
      });
      alert("Signup successful");
      navigate("/login");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-slate-100 relative">
      {/* Logo top right */}
      <img
        src="/logo.png"
        alt="Logo"
        className="absolute top-4 right-4 w-28 h-28 object-contain"
      />

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
          Create Your Account
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Company"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setCompany(e.target.value)}
          />
          <input
            type="text"
            placeholder="Contact Number"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setContact(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition"
            onClick={signup}
          >
            Signup
          </button>
          <p className="text-center text-sm">
            Already have an account?{" "}
            <span
              className="text-green-600 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
