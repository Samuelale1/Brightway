import React, { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import ModalWrapper from "../../components/ModalWrapper";
import { Search, Plus, Trash2, Key, ToggleLeft, ToggleRight, User } from "lucide-react";
import { API_BASE_URL } from "../../api"; // ✅ Import API config

const UsersList = ({ role, onBack, refreshCounts }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const token = localStorage.getItem("token");

  // Map role key to actual role string
  const roleMap = {
    admins: "admin",
    salespersons: "salesperson",
    customers: "customer",
  };

  const currentRole = roleMap[role];

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, { // ✅ Use variable
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // Filter users by role using FE for now
      let filtered = data.users.filter((u) => u.role === currentRole);

      // Basic search
      if (search.trim() !== "") {
        filtered = filtered.filter((u) =>
          u.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setUsers(filtered);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id, newRole) => {
    await fetch(`${API_BASE_URL}/admin/users/${id}/role`, { // ✅ Use variable
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    });

    fetchUsers();
    refreshCounts();
  };

  const toggleStatus = async (id) => {
    await fetch(`${API_BASE_URL}/admin/users/${id}/toggle`, { // ✅ Use variable
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchUsers();
  };

  const resetPassword = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to reset the password?")) return;
    
    const res = await fetch(
      `${API_BASE_URL}/admin/users/${id}/reset-password`, // ✅ Use variable
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    alert(`New password: ${data.new_password}`);
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    await fetch(`${API_BASE_URL}/register`, { // ✅ Use variable
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        password_confirmation: form.get("password_confirmation"),
        phone: form.get("phone"),
        role: currentRole,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setShowAddModal(false);
    fetchUsers();
    refreshCounts();
  };

  // Status color helper
  const getRoleBadgeColor = (r) => {
    switch (r) {
      case "admin": return "bg-blue-100 text-blue-700 border-blue-200";
      case "salesperson": return "bg-purple-100 text-purple-700 border-purple-200";
      case "customer": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={28} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
           <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-800 text-sm mb-2 flex items-center gap-1 transition"
          >
            ← Back to Overview
          </button>
          <h1 className="text-3xl font-bold text-slate-800 capitalize flex items-center gap-3">
             <User className="text-slate-400" size={32} />
             {currentRole} Management
          </h1>
          <p className="text-slate-500 mt-1">Manage {currentRole} accounts and permissions.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition transform active:scale-95 flex items-center gap-2"
        >
          <Plus size={20} />
          Add New {currentRole}
        </button>
      </div>

      {/* Controls & Search */}
      <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchUsers();
            }}
          />
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-5 font-bold">User</th>
                <th className="p-5 font-bold">Contact</th>
                <th className="p-5 font-bold">Role</th>
                <th className="p-5 font-bold text-center">Status</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50/30 transition duration-200 group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shadow-inner">
                            {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-700 text-base">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-5">
                      <div className="flex flex-col">
                          <span className="text-slate-700">{u.email}</span>
                          <span className="text-gray-400 text-xs">{u.phone || "No Phone"}</span>
                      </div>
                  </td>

                  <td className="p-5">
                     <div className="relative inline-block">
                        <select
                            className={`appearance-none pl-3 pr-8 py-1 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${getRoleBadgeColor(u.role)}`}
                            value={u.role}
                            onChange={(e) => changeRole(u.id, e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="salesperson">Salesperson</option>
                            <option value="customer">Customer</option>
                        </select>
                     </div>
                  </td>

                  <td className="p-5 text-center">
                     {/* We assume existence of 'active' or similar status, if not we toggle blindly */}
                     <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold">
                        Active
                     </span>
                  </td>

                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => toggleStatus(u.id)}
                            title="Toggle Status"
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-yellow-100 hover:text-yellow-700 transition"
                        >
                            <ToggleLeft size={18} />
                        </button>

                        <button
                            onClick={() => resetPassword(u.id)}
                            title="Reset Password"
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition"
                        >
                            <Key size={18} />
                        </button>

                        <button
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition"
                            onClick={() => alert("Delete endpoint not yet implemented")}
                            title="Delete User"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                  <tr>
                      <td colSpan="5" className="p-10 text-center text-gray-400">
                          <div className="flex flex-col items-center gap-2">
                            <User size={48} className="text-gray-200" />
                            <p>No users found matching your search.</p>
                          </div>
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <ModalWrapper
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Add New ${currentRole}`}
      >
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Full Name</label>
                <input
                name="name"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="John Doe"
                required
                />
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Email Address</label>
                <input
                name="email"
                type="email"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="john@example.com"
                required
                />
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Phone Number</label>
                <input
                name="phone"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="+234..."
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Password</label>
                    <input
                    name="password"
                    type="password"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="••••••••"
                    required
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Confirm Password</label>
                    <input
                    name="password_confirmation"
                    type="password"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="••••••••"
                    required
                    />
                </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg"
              >
                Create User
              </button>
            </div>
          </form>
      </ModalWrapper>
    </div>
  );
};

export default UsersList;
