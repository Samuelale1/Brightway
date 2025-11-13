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

  const user = JSON.parse(localStorage.getItem("user"));
  

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

  // ✅ Fetch delivery persons
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

  // ✅ Filter orders by tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending")
      return order.delivery_status === "pending" || !order.delivery_status;
    if (activeTab === "sent") return order.delivery_status === "sent";
    if (activeTab === "delivered") return order.status === "completed";
    return true;
  });

  // ✅ Assign delivery (Treat Order)
  const handleAssignDelivery = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !deliveryPersonId) return;
    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/orders/${selectedOrder.id}/assign-delivery`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            delivery_person_id: deliveryPersonId,
            salesperson_id: user?.id ?? null, // optional for admin
          }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Delivery assigned successfully!");
        setSelectedOrder(null);
        fetchOrders();
      } else setMessage(data.message || "❌ Failed to assign delivery.");
    } catch (err) {
      console.error("Error assigning delivery:", err);
      setMessage("⚠️ Network error while assigning delivery.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Confirm payment (for Sent tab)
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
        alert("✅ Payment confirmed and order marked as completed!");
        setSelectedOrder(null);
        fetchOrders(); // move to Delivered tab
      } else alert(data.message || "❌ Failed to confirm payment.");
    } catch (err) {
      console.error("Error confirming payment:", err);
      alert("⚠️ Network error while confirming payment.");
    }
  };

  


  // ✅ Status color helpers
  const colorClass = {
    pending: "bg-yellow-100 text-yellow-800",
    sent: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
  };
  const payClass = {
    paid: "bg-green-100 text-green-800",
    unpaid: "bg-red-100 text-red-800",
  };

  


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Orders</h2>

      {/* Tabs */}
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

      {/* Orders Table */}
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
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        payClass[order.payment_status] || "bg-gray-100"
                      }`}
                    >
                      {order.payment_status || "unpaid"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        colorClass[order.delivery_status] || "bg-gray-100"
                      }`}
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

      {/* Modal */}
      <ModalWrapper
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.order_number}`}
      >
        {selectedOrder && (
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>Customer:</strong> {selectedOrder.user?.name}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.phone_number}
            </p>

            <div className="border-t border-gray-200 pt-3 mb-2">
              <p className="font-medium mb-2">Items:</p>
              <ul className="list-disc ml-6">
                {selectedOrder.items?.map((item) => (
                  <li key={item.id}>
                    {item.product.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            {/* ✅ Pending: Assign Delivery */}
            {activeTab === "pending" && (
              <form onSubmit={handleAssignDelivery} className="space-y-3">
                <label className="text-sm font-medium">
                  Assign Delivery Person:
                </label>
                <select
                  value={deliveryPersonId}
                  onChange={(e) => setDeliveryPersonId(e.target.value)}
                  required
                  className="w-full border p-2 rounded"
                >
                  <option value="">-- Select Delivery Person --</option>
                  {deliveryPersons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.phone})
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  {loading ? "Assigning..." : "Confirm"}
                </button>
              </form>
            )}

            {/* ✅ Sent: Confirm Payment */}
            {/* ✅ Sent: Confirm Payment */}
{activeTab === "sent" && (
  <div className="flex flex-col gap-3">
   <p>
  <strong>Delivery Person:</strong>{" "}
  {selectedOrder.delivery_person_name || "N/A"}
</p>
<p>
  <strong>Delivery Phone:</strong>{" "}
  {selectedOrder.delivery_person_phone || "N/A"}
</p>

    <button
      onClick={() => handleConfirmPayment(selectedOrder.id)}
      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
    >
      Confirm Payment
    </button>
  </div>
)}


            {/* ✅ Delivered: Read Only */}
            {activeTab === "delivered" && (
              <div>
                <p>
                  <strong>Delivered By:</strong>{" "}
                  {selectedOrder.delivery_person_name || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> Completed
                </p>
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
