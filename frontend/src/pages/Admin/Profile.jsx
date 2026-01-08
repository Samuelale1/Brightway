import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phone);
  const [message, setMessage] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/api/profile/update", {
      method: "PUT",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ name, email, phone }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } else {
      setMessage(data.message || "❌ Update failed.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const form = new FormData(e.target);

    const res = await fetch("http://127.0.0.1:8000/api/profile/password", {
      method: "PUT",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({
        current_password: form.get("current_password"),
        new_password: form.get("new_password"),
        new_password_confirmation: form.get("new_password_confirmation"),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Password changed successfully!");
      e.target.reset();
    } else {
      setMessage(data.message || "❌ Password change failed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up pb-12">
      
      {/* Header / Cover */}
      <div className="relative h-48 bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          <div className="absolute bottom-8 left-8 flex items-end gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 shadow-lg overflow-hidden">
                  <img src="/LOGO.png" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="mb-4 text-white drop-shadow-md">
                  <h1 className="text-3xl font-bold">{user?.name}</h1>
                  <p className="text-slate-300 font-medium">Administrator</p>
              </div>
          </div>
      </div>

      <div className="mt-24 grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Profile Info Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">👤 Personal Information</h3>
              <button className="text-sm text-blue-500 font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition">Edit</button>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
              <input
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
              <input
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Phone Number</label>
              <input
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition active:scale-95">
              Save Changes
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
             🔒 Security
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Current Password</label>
              <input
                name="current_password"
                type="password"
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition bg-gray-50 focus:bg-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">New Password</label>
              <input
                name="new_password"
                type="password"
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition bg-gray-50 focus:bg-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Confirm New Password</label>
              <input
                name="new_password_confirmation"
                type="password"
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition bg-gray-50 focus:bg-white"
                placeholder="••••••••"
              />
            </div>

            <button className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-slate-800/30 hover:shadow-slate-800/50 hover:-translate-y-0.5 transition active:scale-95">
              Update Password
            </button>
          </form>
        </div>
      </div>

      {message && (
        <div className={`mt-6 p-4 rounded-xl text-center font-bold text-sm ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
        </div>
      )}
    </div>
  );
};

export default Profile;
