// src/components/Sidebar.jsx (snip — integrate into your existing sidebar)
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64">
      <nav className="space-y-2 p-4">
        <Link to="/admin" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
        <details>
          <summary className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer">Users</summary>
          <div className="pl-4">
            <Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-100">Overview</Link>
            <Link to="/admin/users/admins" className="block px-3 py-2 rounded hover:bg-gray-100">Admins</Link>
            <Link to="/admin/users/salespersons" className="block px-3 py-2 rounded hover:bg-gray-100">Salespersons</Link>
            <Link to="/admin/users/customers" className="block px-3 py-2 rounded hover:bg-gray-100">Customers</Link>
            <Link to="/admin/users/deliveryPersons" className="block px-3 py-2 rounded hover:bg-gray-100">Delivery Persons</Link>
          </div>
        </details>
        {/* other links */}
      </nav>
    </aside>
  );
}
