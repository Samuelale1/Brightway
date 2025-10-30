import React, { useEffect, useState } from "react";

const OrdersSection = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryPersonId, setDeliveryPersonId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/orders");
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
      else console.error("Failed to load orders:", data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // ✅ Fetch delivery persons
  const fetchDeliveryPersons = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/delivery-persons");
      const data = await res.json();
      if (res.ok) setDeliveryPersons(data.delivery_persons || []);
      else console.error("Failed to load delivery persons:", data);
    } catch (err) {
      console.error("Error fetching delivery persons:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPersons();
  }, []);

  // ✅ Filter orders by tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending") {
      return (
        order.delivery_status === "pending" ||
        order.delivery_status === null ||
        order.delivery_status === ""
      );
    }
    if (activeTab === "treated") {
      return order.delivery_status === "sent";
    }
    if (activeTab === "delivered") {
      return (
        order.delivery_status === "delivered" || order.status === "completed"
      );
    }
    return true;
  });

  // ✅ Assign delivery person
 const handleAssignDelivery = async (e) => {
  e.preventDefault();
  if (!selectedOrder || !deliveryPersonId) return;

  const user = JSON.parse(localStorage.getItem("user")); // ✅ Get logged-in salesperson
  if (!user || !user.id) {
    setMessage("⚠️ Salesperson not identified. Please log in again.");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/orders/${selectedOrder.id}/assign-delivery`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          delivery_person_id: deliveryPersonId,
          salesperson_id: user.id, // ✅ send salesperson_id
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Delivery person assigned successfully!");
      alert(`Order #${selectedOrder.order_number} is now out for delivery 🚚`);
      setSelectedOrder(null);
      setDeliveryPersonId("");
      fetchOrders(); // refresh order list
    } else {
      setMessage(data.message || "❌ Failed to assign delivery person");
    }
  } catch (err) {
    console.error("Error assigning delivery:", err);
    setMessage("⚠️ Network error while assigning delivery.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-4">
      {/* ✅ Tabs */}
      <div className="flex space-x-4 mb-6">
        {["pending", "treated", "delivered"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab === "pending"
              ? "⏳ Pending"
              : tab === "treated"
              ? "🚚 Treated"
              : "✅ Delivered"}
          </button>
        ))}
      </div>

      {/* ✅ Orders Grid */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No {activeTab} orders at the moment.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-blue-50 rounded-xl shadow p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">
                  Order #{order.order_number}
                </h3>
                
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    activeTab === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : activeTab === "treated"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.delivery_status || "pending"}
                </span>
                
              </div>

              <p className="text-gray-600 text-sm mb-1">
                Customer: {order.user?.name}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                Address: {order.address}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                Total: ₦{order.total_price}
              </p>

              {/* ✅ Order Items */}
              <div className="border-t border-gray-200 pt-2 mb-3">
                <p className="text-sm font-medium mb-1">Items:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {order.items?.map((item) => (
                    <li key={item.id}>
                      - {item.product.name} × {item.quantity}
                    </li>
                  ))}
                </ul>

                <button className=" bg-blue-400 px-10 py-2 text-gray-200 border-0 rounded-md "> Paid</button>
              </div>

              {activeTab === "pending" && (
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Treat Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ✅ Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Treat Order #{selectedOrder.order_number}
            </h3>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p>
                <strong>Customer:</strong> {selectedOrder.user?.name}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.address}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.phone_number}
              </p>
            </div>

            {/* ✅ Order Items in Modal */}
            <div className="border-t border-gray-200 pt-3 mb-4">
              <p className="font-medium mb-2">Order Items:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {selectedOrder.items?.map((item) => (
                  <li key={item.id}>
                    - {item.product.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            {/* ✅ Delivery Person Dropdown */}
            <form onSubmit={handleAssignDelivery} className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Assign Delivery Person:
              </label>
              <select
                value={deliveryPersonId}
                onChange={(e) => setDeliveryPersonId(e.target.value)}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">-- Select Delivery Person --</option>
                {deliveryPersons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name} ({person.phone})
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {loading ? "Assigning..." : "Confirm"}
                </button>
              </div>
            </form>

            {message && (
              <p className="mt-3 text-center text-sm text-green-600 font-medium">
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
