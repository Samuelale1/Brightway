import React, { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import Spinner from "../../components/Spinner";
import ModalWrapper from "../../components/ModalWrapper";
import { API_BASE_URL } from "../../api"; // ✅ Import API config

const DeliveryPersonsList = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "", phone: "" });
  const [adding, setAdding] = useState(false);

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

  const handleAddPerson = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch(`${API_BASE_URL}/delivery-persons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(newPerson),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false);
        setNewPerson({ name: "", phone: "" });
        fetchItems();
      } else {
        alert(data.message || "Failed to add delivery person");
      }
    } catch (err) {
      console.error("Error adding delivery person:", err);
    } finally {
      setAdding(false);
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

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Delivery Persons</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-700 transition"
        >
          <Plus size={20} />
          Add Delivery Person
        </button>
      </div>

      <ModalWrapper
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Delivery Person"
      >
        <form onSubmit={handleAddPerson} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={newPerson.name}
              onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              required
              value={newPerson.phone}
              onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="+234..."
            />
          </div>
          <button
            type="submit"
            disabled={adding}
            className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add Delivery Person"}
          </button>
        </form>
      </ModalWrapper>

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
