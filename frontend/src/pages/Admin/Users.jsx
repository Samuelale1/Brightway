import React, { useEffect, useState } from "react";
import { Users, UserCog, UserCheck, Truck, ChevronRight } from "lucide-react";

const users = () => {
  const [stats, setStats] = useState({
    admins: 0,
    salespersons: 0,
    customers: 0,
    deliveryPersons: 0,
  });

  // ✅ Fetch users count (placeholder for now)
  useEffect(() => {
    // Replace this with your API endpoint later:
    // fetch("http://127.0.0.1:8000/api/admin/users-summary")
    //   .then((res) => res.json())
    //   .then((data) => setStats(data));

    const mockData = {
      admins: 3,
      salespersons: 7,
      customers: 240,
      deliveryPersons: 5,
    };
    setStats(mockData);
  }, []);

  return (
    <div className="space-y-8">
      {/* ✅ Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-700">User Overview</h2>
        <p className="text-gray-500 text-sm">View all user roles and activity</p>
      </div>

      {/* ✅ User Role Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <UserCard
          title="Admins"
          count={stats.admins}
          color="bg-blue-100 text-blue-700"
          icon={<UserCog size={24} />}
        />
        <UserCard
          title="Salespersons"
          count={stats.salespersons}
          color="bg-purple-100 text-purple-700"
          icon={<UserCheck size={24} />}
        />
        <UserCard
          title="Customers"
          count={stats.customers}
          color="bg-green-100 text-green-700"
          icon={<Users size={24} />}
        />
        <UserCard
          title="Delivery Persons"
          count={stats.deliveryPersons}
          color="bg-orange-100 text-orange-700"
          icon={<Truck size={24} />}
        />
      </div>
    </div>
  );
};

// ✅ Reusable User Card Component
const UserCard = ({ title, count, color, icon }) => (
  <div className="bg-white shadow rounded-xl p-5 hover:shadow-lg transition flex flex-col justify-between">
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm">Registered Users</p>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-gray-700">{count}</span>
      <button className="flex items-center text-blue-600 hover:text-blue-800 transition text-sm font-medium">
        View All <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  </div>
);

export default users;
