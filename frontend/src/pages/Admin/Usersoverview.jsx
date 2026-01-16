// src/pages/admin/UsersOverview.jsx
import React, { useEffect, useState } from "react";
import { UserCog, UserCheck, Users, Truck, ChevronRight } from "lucide-react";
import Spinner from "../../components/Spinner";
import UsersList from "./UsersList"; // role-specific table & actions
import { API_BASE_URL } from "../../api"; // ✅ Import API config

const cardsMeta = [
  { key: "admins", title: "Admins", icon: <UserCog size={20} />, color: "bg-blue-100 text-blue-700" },
  { key: "salespersons", title: "Salespersons", icon: <UserCheck size={20} />, color: "bg-purple-100 text-purple-700" },
  { key: "customers", title: "Customers", icon: <Users size={20} />, color: "bg-green-100 text-green-700" },
  { key: "deliveryPersons", title: "Delivery Persons", icon: <Truck size={20} />, color: "bg-orange-100 text-orange-700" },
];

export default function UsersOverview() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // null => overview
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users-count`, { // ✅ Use variable
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch counts");
      const data = await res.json();
      setCounts(data);
    } catch (err) {
      console.error("Counts fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !counts) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={28} />
      </div>
    );
  }

  if (selectedRole) {
    return (
      <UsersList
        role={selectedRole}
        onBack={() => setSelectedRole(null)}
        refreshCounts={fetchCounts}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-700">User Overview</h2>
        <p className="text-gray-500 text-sm">View all user roles and activity</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardsMeta.map((c) => (
          <div
            key={c.key}
            className="bg-white shadow rounded-xl p-5 hover:shadow-lg transition flex flex-col justify-between cursor-pointer"
            onClick={() => setSelectedRole(c.key)}
            role="button"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-full ${c.color}`}>{c.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>
                <p className="text-gray-500 text-sm">Registered Users</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-700">{counts[c.key]}</span>
              <div className="flex items-center text-blue-600 hover:text-blue-800 transition text-sm font-medium">
                View <ChevronRight size={16} className="ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
