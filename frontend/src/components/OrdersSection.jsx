import React, { useEffect, useState } from "react";

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryPersonId, setDeliveryPersonId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Load logged-in salesperson (for tracking)
  const user = JSON.parse(localStorage.getItem("user"));

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

  // ✅ Fetch all delivery persons
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

  // ✅ Filter orders per tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending") {
      return (
        order.delivery_status === "pending" ||
        order.delivery_status === null ||
        order.delivery_status === ""
      );
    }
    if (activeTab === "treated") return order.delivery_status === "sent";
    if (activeTab === "delivered") return order.delivery_status === "delivered";
    return true;
  });

  // ✅ Assign delivery person (Treat Order)
  const handleAssignDelivery = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !deliveryPersonId) return;

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
            salesperson_id: user?.id, // ✅ track salesperson
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Delivery person assigned successfully!");
        setSelectedOrder(null);
        setDeliveryPersonId("");
        fetchOrders(); // Refresh orders after assigning
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

  // ✅ Confirm Payment
  const handleConfirmPayment = async (orderId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderId}/confirm-payment`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Payment confirmed and order marked as delivered!");
        fetchOrders(); // Refresh so it moves to Delivered tab
      } else {
        alert(data.message || "❌ Failed to confirm payment");
      }
    } catch (err) {
      console.error("Error confirming payment:", err);
      alert("⚠️ Network error while confirming payment.");
    }
  };

  // ✅ Status Colors
  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
              className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition relative"
            >
              {/* ✅ Status Labels */}
              <div className="absolute top-2 right-2 flex flex-col items-end space-y-1">
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${getDeliveryStatusColor(
                    order.delivery_status
                  )}`}
                >
                  {order.delivery_status || "pending"}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${getPaymentStatusColor(
                    order.payment_status
                  )}`}
                >
                  {order.payment_status || "unpaid"}
                </span>
              </div>

              {/* ✅ Order Header */}
              <div className="flex justify-between items-center mb-2 mt-6">
                <h3 className="font-semibold text-gray-800">
                  Order #{order.order_number}
                </h3>
              </div>

              {/* ✅ Info */}
              <p className="text-gray-600 text-sm mb-1">
                Customer: {order.user?.name}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                Address: {order.address}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                Total: ₦{order.total_price}
              </p>

              {/* ✅ Items */}
              <div className="border-t border-gray-200 pt-2 mb-3">
                <p className="text-sm font-medium mb-1">Items:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {order.items?.map((item) => (
                    <li key={item.id}>
                      - {item.product.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ✅ Buttons */}
              {activeTab === "pending" && (
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Treat Order
                </button>
              )}

              {activeTab === "treated" &&
                order.payment_status !== "paid" && (
                  <button
                    onClick={() => handleConfirmPayment(order.id)}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  >
                    Confirm Payment
                  </button>
                )}
            </div>
          ))}
        </div>
      )}

      {/* ✅ Treat Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Treat Order #{selectedOrder.order_number}
            </h3>

            {/* Customer Info */}
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

            {/* ✅ Order Items List */}
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
