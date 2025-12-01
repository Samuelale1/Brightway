import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner"; // <-- ADD THIS

const Login = () => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // loader

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const url = isLoginMode
        ? "http://127.0.0.1:8000/api/login"
        : "http://127.0.0.1:8000/api/register";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.status === "error") {
        if (typeof data.message === "string") setError(data.message);
        else if (typeof data.message === "object")
          setError(Object.values(data.message).flat().join(" "));
        else setError("Something went wrong");

        return;
      }

      setMessage(data.message || "Success!");
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "salesperson") navigate("/sales");
      else navigate("/customer");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Network error, check if Laravel server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-items-center w-full h-screen bg-gradient-to-r from-blue-200 via-cyan-100 to-amber-100">
      <div className="w-1/4 bg-white p-8 rounded-2xl shadow-lg overflow-hidden">
        <img src="/LOGO.png" alt="Logo" className="w-20 h-20 mx-auto mb-4" />

        <h2 className="text-3xl font-semibold text-center pb-4">
          {isLoginMode ? "Login" : "Sign-up"}
        </h2>

        {/* Tabs */}
        <div className="relative flex h-12 mb-6 border border-gray-200 rounded-full overflow-hidden">
          <button
            onClick={() => setIsLoginMode(true)}
            className={`w-1/2 text-lg z-10 ${
              isLoginMode ? "text-blue-950" : "text-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginMode(false)}
            className={`w-1/2 text-lg z-10 ${
              !isLoginMode ? "text-blue-950" : "text-gray-600"
            }`}
          >
            Sign-up
          </button>

          <div
            className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-amber-200 ${
              isLoginMode ? "left-0" : "left-1/2"
            }`}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border-b-2 border-gray-300 focus:border-cyan-500"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border-b-2 border-gray-300 focus:border-cyan-500"
          />

          {!isLoginMode && (
            <input
              type="text"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border-b-2 border-gray-300 focus:border-cyan-500"
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Your Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border-b-2 border-gray-300 focus:border-cyan-500"
          />

          {!isLoginMode && (
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              className="w-full p-3 border-b-2 border-gray-300 focus:border-cyan-500"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 p-3 bg-gradient-to-r from-amber-200 via-cyan-500 to-cyan-200 text-blue-950 font-semibold rounded-full disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner size={22} />
                <span>Processing...</span>
              </div>
            ) : isLoginMode ? (
              "Login"
            ) : (
              "Sign-up"
            )}
          </button>

          {error && <p className="text-center text-red-500">{error}</p>}
          {message && <p className="text-center text-green-500">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
