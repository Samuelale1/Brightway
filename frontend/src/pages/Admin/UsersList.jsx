import React, { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";

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
      const res = await fetch("http://127.0.0.1:8000/api/admin/users", {
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
    await fetch(`http://127.0.0.1:8000/api/admin/users/${id}/role`, {
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
    await fetch(`http://127.0.0.1:8000/api/admin/users/${id}/toggle`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchUsers();
  };

  const resetPassword = async (id) => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/admin/users/${id}/reset-password`,
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

    await fetch("http://127.0.0.1:8000/api/register", {
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={28} />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold capitalize">{currentRole} List</h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 border rounded"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          fetchUsers();
        }}
      />

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone}</td>

                <td className="p-3">
                  <select
                    className="border p-1 rounded"
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="salesperson">Salesperson</option>
                    <option value="customer">Customer</option>
            
                  </select>
                </td>

        

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() => resetPassword(u.id)}
                    className="px-2 py-1 bg-indigo-500 text-white rounded"
                  >
                    Reset Password
                  </button>

                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded"
                    onClick={() => alert("Delete endpoint not yet implemented")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Add New {currentRole}
            </h3>

            <form onSubmit={handleAddUser} className="space-y-3">
              <input
                name="name"
                className="w-full p-2 border rounded"
                placeholder="Full Name"
                required
              />

              <input
                name="email"
                className="w-full p-2 border rounded"
                placeholder="Email"
                required
              />

              <input
                name="phone"
                className="w-full p-2 border rounded"
                placeholder="Phone"
              />

              <input
                name="password"
                type="password"
                className="w-full p-2 border rounded"
                placeholder="Password"
                required
              />

              <input
                name="password_confirmation"
                type="password"
                className="w-full p-2 border rounded"
                placeholder="Confirm Password"
                required
              />

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
