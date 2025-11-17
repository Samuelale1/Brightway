import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phone);
  const [message, setMessage] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/api/profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Profile updated successfully!");

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } else {
      setMessage(data.message || "Update failed.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const res = await fetch("http://127.0.0.1:8000/api/profile/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_password: form.get("current_password"),
        new_password: form.get("new_password"),
        new_password_confirmation: form.get("new_password_confirmation"),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Password changed successfully!");
      e.target.reset();
    } else {
      setMessage(data.message || "Password change failed.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-lg mb-4">Personal Info</h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                className="border p-2 rounded w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                className="border p-2 rounded w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Phone</label>
              <input
                className="border p-2 rounded w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button className="bg-blue-600 text-white py-2 px-4 rounded">
              Update Profile
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-lg mb-4">Change Password</h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block mb-1">Current Password</label>
              <input
                name="current_password"
                type="password"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1">New Password</label>
              <input
                name="new_password"
                type="password"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1">Confirm New Password</label>
              <input
                name="new_password_confirmation"
                type="password"
                className="border p-2 rounded w-full"
              />
            </div>

            <button className="bg-green-600 text-white py-2 px-4 rounded">
              Update Password
            </button>
          </form>
        </div>
      </div>

      {message && (
        <p className="mt-5 text-center text-green-700 font-medium">{message}</p>
      )}
    </div>
  );
};

export default Profile;
