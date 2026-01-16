import React, { useState, useEffect } from "react";
import ModalWrapper from "../../components/ModalWrapper";
import { API_BASE_URL } from "../../api"; // ✅ Import API config

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
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        }
      });
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // ✅ Fetch delivery persons
  const fetchDeliveryPersons = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/delivery-persons`, { // ✅ Use variable
         headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
         }
      });
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
        `${API_BASE_URL}/orders/${selectedOrder.id}/assign-delivery`, // ✅ Use variable
        {
          method: "PUT",
          headers: { 
             "Content-Type": "application/json",
             "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
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
        `${API_BASE_URL}/orders/${orderId}/confirm-payment`, // ✅ Use variable
        {
          method: "PUT",
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
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
  const getStatusColor = (status) => {
      switch(status) {
          case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
          case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'delivered': 
          case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
          default: return 'bg-gray-100 text-gray-600 border-gray-200';
      }
  };

  const getPaymentColor = (status) => {
      return status === 'paid' 
          ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
          : 'bg-rose-100 text-rose-700 border-rose-200';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">📦 Order Management</h1>
            <p className="text-slate-500 mt-1">Track and manage customer orders efficiently.</p>
          </div>
          
          {/* Tabs */}
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
            {["pending", "sent", "delivered"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-slate-800 text-white shadow-md"
                    : "text-gray-500 hover:text-slate-700 hover:bg-gray-50"
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
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="p-5 font-bold">Order No</th>
                    <th className="p-5 font-bold">Customer</th>
                    <th className="p-5 font-bold">Items</th>
                    <th className="p-5 font-bold text-right">Total</th>
                    <th className="p-5 font-bold text-center">Payment</th>
                    <th className="p-5 font-bold text-center">Status</th>
                    <th className="p-5 font-bold text-right">Action</th>
                </tr>
                </thead>
                <tbody className="text-sm text-slate-600 divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-blue-50/30 transition duration-200 group">
                    <td className="p-5 font-bold text-slate-800">#{order.order_number}</td>
                    <td className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                {order.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-slate-700">{order.user?.name}</span>
                                <span className="text-xs text-gray-400">{order.address?.substring(0, 15)}...</span>
                            </div>
                        </div>
                    </td>
                    <td className="p-5 text-gray-500">
                        {order.items?.length || 0} items
                    </td>
                    <td className="p-5 font-bold text-slate-800 text-right">₦{Number(order.total_price).toLocaleString()}</td>
                    <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPaymentColor(order.payment_status)}`}>
                        {order.payment_status || "unpaid"}
                        </span>
                    </td>
                    <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.delivery_status || 'pending')}`}>
                        {order.delivery_status || "pending"}
                        </span>
                    </td>
                    <td className="p-5 text-right">
                        <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition"
                        >
                        Manage ➝
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="text-6xl mb-4 opacity-50">📦</div>
             <h3 className="text-xl font-bold text-slate-700">No {activeTab} orders found</h3>
             <p className="text-gray-400">Wait for new orders to come in!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <ModalWrapper
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.order_number}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            
            {/* Customer Details */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Customer Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500 text-xs">Name</p>
                        <p className="font-semibold text-slate-700">{selectedOrder.user?.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Phone</p>
                        <p className="font-semibold text-slate-700">{selectedOrder.phone_number}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-gray-500 text-xs">Delivery Address</p>
                        <p className="font-semibold text-slate-700">{selectedOrder.address}</p>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Order Items</h4>
                <div className="space-y-3">
                    {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center text-lg">🍲</div>
                            <div>
                                <p className="font-bold text-slate-700">{item.product.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <p className="font-bold text-slate-700">₦{Number(item.subtotal || 0).toLocaleString()}</p>
                    </div>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <span className="font-bold text-gray-500">Total Amount</span>
                    <span className="text-xl font-extrabold text-blue-600">₦{Number(selectedOrder.total_price).toLocaleString()}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
                {/* ✅ Pending: Assign Delivery */}
                {activeTab === "pending" && (
                <form onSubmit={handleAssignDelivery} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                        Assign Delivery Person
                        </label>
                        <select
                        value={deliveryPersonId}
                        onChange={(e) => setDeliveryPersonId(e.target.value)}
                        required
                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                        <option value="">-- Select Person --</option>
                        {deliveryPersons.map((p) => (
                            <option key={p.id} value={p.id}>
                            {p.name} ({p.phone})
                            </option>
                        ))}
                        </select>
                    </div>

                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition transform active:scale-95"
                    >
                    {loading ? "Assigning..." : "Confirm Assignment"}
                    </button>
                </form>
                )}

                {/* ✅ Sent: Confirm Payment */}
                {activeTab === "sent" && (
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-800 mb-1">
                            <strong>Delivery Person:</strong> {selectedOrder.delivery_person_name || "N/A"}
                        </p>
                        <p className="text-sm text-blue-800">
                            <strong>Phone:</strong> {selectedOrder.delivery_person_phone || "N/A"}
                        </p>
                    </div>
                
                    <button
                    onClick={() => handleConfirmPayment(selectedOrder.id)}
                    className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition transform active:scale-95"
                    >
                    ✅ Confirm Payment & Complete
                    </button>
                </div>
                )}

                {/* ✅ Delivered: Read Only */}
                {activeTab === "delivered" && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                    <p className="text-green-700 font-bold flex items-center justify-center gap-2">
                        <span className="text-xl">🎉</span> Order Completed
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                    Delivered by {selectedOrder.delivery_person_name || "Unknown"}
                    </p>
                </div>
                )}
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-center text-sm font-bold ${message.includes("success") || message.includes("confirmed") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {message}
              </div>
            )}
          </div>
        )}
      </ModalWrapper>
    </div>
  );
};

export default Orders;
