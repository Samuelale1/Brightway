import React, { useEffect, useRef, useState } from "react";
import Spinner from "../../components/Spinner";
import { API_BASE_URL } from "../../api"; // ✅ Import API config

const DeliveryPersonsList = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const hasFetched = useRef(false); // ✅ prevents double fetch in React 18

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/delivery-persons`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      // ✅ normalize backend response
      const list = Array.isArray(data)
        ? data
        : data.data ?? data.deliveryPersons ?? data.delivery_persons ?? [];

      setItems(list);
    } catch (e) {
      console.error("Delivery persons fetch failed:", e);
      setItems([]); // ✅ prevents white screen
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <h2 className="text-xl font-semibold">Delivery Persons</h2>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="p-4 text-center text-gray-500"
                >
                  No delivery persons found
                </td>
              </tr>
            ) : (
              items.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{d.name}</td>
                  <td className="p-3">{d.phone}</td>
                  <td className="p-3">
                    <button className="px-2 py-1 bg-red-600 text-white rounded">
                      Delete
                    </button>
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

export default DeliveryPersonsList;
