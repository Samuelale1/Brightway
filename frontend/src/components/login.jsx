import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner"; 
import { API_BASE_URL } from "../api"; 

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
        ? `${API_BASE_URL}/login`
        : `${API_BASE_URL}/register`;

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
    <div className="flex w-full h-screen bg-slate-900 font-sans overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
         <div className="absolute top-1/2 -right-24 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full flex items-center justify-center relative z-10 px-4">
        
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          
          <div className="text-center mb-8">
            <img src="/LOGO.png" alt="Logo" className="w-20 h-20 mx-auto mb-4 drop-shadow-lg" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Brightway<span className="text-amber-500">.</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">{isLoginMode ? "Welcome back! Tasty food awaits." : "Join us and satisfy your cravings."}</p>
          </div>

          {/* Tabs */}
          <div className="relative flex h-14 bg-slate-950/50 rounded-2xl p-1 mb-8 overflow-hidden">
             
             {/* Slider Background */}
             <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-orange-500/20 ${isLoginMode ? "left-1" : "left-[calc(50%+4px)]"}`}
             ></div>

             <button
               onClick={() => setIsLoginMode(true)}
               className={`flex-1 relative z-10 text-sm font-bold transition-colors duration-200 ${isLoginMode ? "text-white" : "text-gray-400 hover:text-white"}`}
             >
               Login
             </button>
             <button
               onClick={() => setIsLoginMode(false)}
               className={`flex-1 relative z-10 text-sm font-bold transition-colors duration-200 ${!isLoginMode ? "text-white" : "text-gray-400 hover:text-white"}`}
             >
               Sign Up
             </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Full Name</label>
                 <input
                   type="text"
                   name="name"
                   placeholder="John Doe"
                   value={formData.name}
                   onChange={handleChange}
                   required
                   className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                 />
              </div>
            )}

            <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email Address</label>
                 <input
                   type="email"
                   name="email"
                   placeholder="you@example.com"
                   value={formData.email}
                   onChange={handleChange}
                   required
                   className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                 />
            </div>

            {!isLoginMode && (
              <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Phone Number</label>
                 <input
                   type="text"
                   name="phone"
                   placeholder="080 1234 5678"
                   value={formData.phone}
                   onChange={handleChange}
                   required
                   className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                 />
              </div>
            )}

            <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Password</label>
                 <input
                   type="password"
                   name="password"
                   placeholder="••••••••"
                   value={formData.password}
                   onChange={handleChange}
                   required
                   className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                 />
            </div>

            {!isLoginMode && (
              <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Confirm Password</label>
                 <input
                   type="password"
                   name="password_confirmation"
                   placeholder="••••••••"
                   value={formData.password_confirmation}
                   onChange={handleChange}
                   required
                   className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                 />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size={20} className="text-white" />
                  <span>Processing...</span>
                </div>
              ) : isLoginMode ? (
                "Let's Eat 🍔"
              ) : (
                "Create Account ✨"
              )}
            </button>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                    {error}
                </div>
            )}
            {message && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm text-center">
                    {message}
                </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
