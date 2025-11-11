import React, { useState, useEffect } from "react";
import ModalWrapper from "../../components/ModalWrapper";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [deliveryPersonId, setDeliveryPersonId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/orders");
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
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
    } catch (err) {
      console.error("Error fetching delivery persons:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPersons();
  }, []);

  // ✅ Filter Orders by status
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending")
      return order.delivery_status === "pending" || !order.delivery_status;
    if (activeTab === "sent") return order.delivery_status === "sent";
    if (activeTab === "delivered") return order.delivery_status === "delivered";
    return true;
  });

  // ✅ Assign Delivery
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
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Delivery assigned successfully!");
        setSelectedOrder(null);
        fetchOrders();
      } else {
        setMessage(data.message || "❌ Failed to assign delivery.");
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
        alert("✅ Payment confirmed!");
        fetchOrders();
      } else {
        alert(data.message || "❌ Failed to confirm payment.");
      }
    } catch (err) {
      console.error("Error confirming payment:", err);
      alert("⚠️ Network error while confirming payment.");
    }
  };

  // ✅ Status color utilities
  const getDeliveryColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "sent":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "unpaid":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">
      {/* ✅ Page Title */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Manage Orders</h2>
      </div>

      {/* ✅ Tabs */}
      <div className="flex gap-3 mb-6">
        {["pending", "sent", "delivered"].map((tab) => (
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
              : tab === "sent"
              ? "🚚 Sent"
              : "✅ Delivered"}
          </button>
        ))}
      </div>

      {/* ✅ Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        {filteredOrders.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">Order No</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{order.order_number}</td>
                  <td className="px-4 py-3">{order.user?.name}</td>
                  <td className="px-4 py-3">₦{order.total_price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${getPaymentColor(
                        order.payment_status
                      )}`}
                    >
                      {order.payment_status || "unpaid"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${getDeliveryColor(
                        order.delivery_status
                      )}`}
                    >
                      {order.delivery_status || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:underline"
                    >
                      View / Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 py-10">
            No {activeTab} orders found.
          </p>
        )}
      </div>

      {/* ✅ Order Details Modal */}
      <ModalWrapper
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.order_number}`}
      >
        {selectedOrder && (
          <div className="space-y-4 text-sm text-gray-700">
            <div>
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

            <div>
              <p className="font-medium mb-2">Items:</p>
              <ul className="list-disc ml-5 space-y-1">
                {selectedOrder.items?.map((item) => (
                  <li key={item.id}>
                    {item.product.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            {/* ✅ Assign Delivery */}
            <form onSubmit={handleAssignDelivery} className="space-y-3">
              <label className="text-sm font-medium">Assign Delivery:</label>
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
                  Close
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

            {/* ✅ Confirm Payment */}
            {selectedOrder.payment_status !== "paid" && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleConfirmPayment(selectedOrder.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
                >
                  Confirm Payment
                </button>
              </div>
            )}

            {message && (
              <p className="mt-3 text-center text-green-600 font-medium">
                {message}
              </p>
            )}
          </div>
        )}
      </ModalWrapper>
    </div>
  );
};

export default Orders;
  