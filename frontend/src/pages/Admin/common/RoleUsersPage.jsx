import React, { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import { API_BASE_URL } from "../../../api"; // ✅ Import API config

const RoleUsersPage = ({ roleName, roleKey }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_BASE_URL}/admin/users/role/${roleKey}?search=${search}`, // ✅ Use variable
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const data = await res.json();
    setUsers(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-semibold">{roleName}</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-3 border rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size={35} />
        </div>
      ) : (
        <table className="w-full mt-4 border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone}</td>
                <td className="p-3">{u.is_active ? "Active" : "Inactive"}</td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded mr-2">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RoleUsersPage;
