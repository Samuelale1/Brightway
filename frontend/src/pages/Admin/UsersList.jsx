import React, { useEffect, useState } from "react";
import { ArrowLeft, Search, UserCheck, UserX, Trash2, Edit, Plus } from "lucide-react";
import Spinner from "../../components/Spinner";
import ModalWrapper from "../../components/ModalWrapper";
import { API_BASE_URL } from "../../api";

const roleToApiPath = {
  admins: "admin",
  salespersons: "salesperson",
  customers: "customer",
};

const roleLabels = {
  admins: "Admins",
  salespersons: "Salespersons",
  customers: "Customers",
};

const roleColors = {
  admins: "bg-blue-600 hover:bg-blue-700 ring-blue-500",
  salespersons: "bg-purple-600 hover:bg-purple-700 ring-purple-500",
  customers: "bg-green-600 hover:bg-green-700 ring-green-500",
};

const UsersList = ({ role, onBack, refreshCounts }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: roleToApiPath[role] || "customer"
  });
  const [adding, setAdding] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const apiRole = roleToApiPath[role] || role;
      const res = await fetch(`${API_BASE_URL}/admin/users?role=${apiRole}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users || data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}/toggle`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchUsers();
        refreshCounts?.();
      }
    } catch (error) {
      console.error("Error toggling user:", error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchUsers();
        refreshCounts?.();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false);
        setNewUser({ name: "", email: "", password: "", phone: "", role: roleToApiPath[role] || "customer" });
        fetchUsers();
        refreshCounts?.();
      } else {
        alert(data.message || "Failed to create user");
      }
    } catch (err) {
      console.error("Error creating user:", err);
    } finally {
      setAdding(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-gray-700">
            {roleLabels[role] || role}
          </h2>
          <p className="text-gray-500 text-sm">{users.length} users found</p>
        </div>
      </div>

      {/* Search & Add */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition ${roleColors[role] || "bg-blue-600 hover:bg-blue-700"}`}
        >
          <Plus size={20} />
          Add {roleLabels[role]?.slice(0, -1) || "User"}
        </button>
      </div>

      {/* Add User Modal */}
      <ModalWrapper
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Add New ${roleLabels[role]?.slice(0, -1) || "User"}`}
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className={`w-full p-3 rounded-xl border border-gray-200 focus:ring-2 ${roleColors[role]?.split(' ')[2]} outline-none`}
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className={`w-full p-3 rounded-xl border border-gray-200 focus:ring-2 ${roleColors[role]?.split(' ')[2]} outline-none`}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              className={`w-full p-3 rounded-xl border border-gray-200 focus:ring-2 ${roleColors[role]?.split(' ')[2]} outline-none`}
              placeholder="+234..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className={`w-full p-3 rounded-xl border border-gray-200 focus:ring-2 ${roleColors[role]?.split(' ')[2]} outline-none`}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={adding}
            className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition disabled:opacity-50 ${roleColors[role]?.split(' ').slice(0,2).join(' ')}`}
          >
            {adding ? "Creating..." : "Create User"}
          </button>
        </form>
      </ModalWrapper>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition ${
                          user.is_active
                            ? "hover:bg-red-100 text-red-600"
                            : "hover:bg-green-100 text-green-600"
                        }`}
                        title={user.is_active ? "Deactivate" : "Activate"}
                      >
                        {user.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
