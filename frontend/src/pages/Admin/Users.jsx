import React, { useEffect, useState } from "react";
import { UserCog, UserCheck, Users as UsersIcon, Truck, ChevronRight } from "lucide-react";
import Spinner from "../../components/Spinner";
import UsersList from "./UsersList";
import DeliveryPersonsList from "./DeliveryPersonsList";

const cardsMeta = [
  { key: "admins", title: "Admins", color: "bg-blue-100 text-blue-700", icon: <UserCog size={20} /> },
  { key: "salespersons", title: "Salespersons", color: "bg-purple-100 text-purple-700", icon: <UserCheck size={20} /> },
  { key: "customers", title: "Customers", color: "bg-green-100 text-green-700", icon: <UsersIcon size={20} /> },
  { key: "deliveryPersons", title: "Delivery Persons", color: "bg-orange-100 text-orange-700", icon: <Truck size={20} /> },
];

const Users = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/users-count", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      const data = await res.json();
      setCounts(data);
    } catch (err) {
      console.error("Error fetching counts:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !counts) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={28} />
      </div>
    );
  }

 if (selectedRole === "deliveryPersons") {
  return (
    <DeliveryPersonsList
      onBack={() => setSelectedRole(null)}
    />
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
      <h2 className="text-2xl font-semibold text-gray-700">User Overview</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardsMeta.map((c) => (
          <div
            key={c.key}
            onClick={() => setSelectedRole(c.key)}
            className="bg-white shadow rounded-xl p-5 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-full ${c.color}`}>{c.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>
                <p className="text-gray-500 text-sm">Registered Users</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-700">
                {counts[c.key]}
              </span>
              <ChevronRight size={17} className="text-blue-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
