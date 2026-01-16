import React, { useEffect, useState } from "react";
import ModalWrapper from "../components/ModalWrapper";
import { API_BASE_URL } from "../api"; 

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState(null);
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
      else console.error("Failed to load orders:", data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // ✅ Fetch delivery persons
  const handleTreatOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/sales/order/${orderId}`, { 
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) setDeliveryPersons(data.delivery_persons || []);
      else console.error("Failed to load delivery persons:", data);
    } catch (err) {
      console.error("Error fetching delivery persons:", err);
    }
  };

  // ✅ Fetch delivery persons
  const fetchDeliveryPersons = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/delivery-persons`, { 
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
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
    if (activeTab === "pending")
      return (
        order.delivery_status === "pending" ||
        order.delivery_status === null ||
        order.delivery_status === ""
      );
    if (activeTab === "treated") return order.delivery_status === "sent";
    if (activeTab === "delivered") return order.delivery_status === "delivered";
    return true;
  });

 
  const handleAssignDelivery = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !deliveryPersonId) return;

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/orders/${selectedOrder.id}/assign-delivery`, 
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          },
          body: JSON.stringify({
            delivery_person_id: deliveryPersonId,
            salesperson_id: user?.id,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Delivery person assigned successfully!");
        setSelectedOrder(null);
        setDeliveryPersonId("");
        fetchOrders();
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

  const handleConfirmPayment = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/orders/${orderId}/confirm-payment`, 
        { 
          method: "PUT", 
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          } 
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Payment confirmed and order marked as delivered!");
        fetchOrders();
      } else {
        alert(data.message || "❌ Failed to confirm payment");
      }
    } catch (err) {
      console.error("Error confirming payment:", err);
      alert("⚠️ Network error while confirming payment.");
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 border border-amber-200";
      case "sent": return "bg-blue-100 text-blue-700 border border-blue-200";
      case "delivered": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      default: return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "unpaid": return "bg-rose-50 text-rose-600 border border-rose-100";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="p-4">
      {/* ✅ Tabs */}
      <div className="flex space-x-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
        {["pending", "treated", "delivered"].map((tab) => (
          <button
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300
              ${ activeTab === tab 
                ? "bg-slate-800 text-white shadow-md transform scale-[1.02]"
                : "text-gray-500 hover:text-slate-800 hover:bg-gray-50"
            }`}
          >
            {tab === "pending" ? "⏳ Pending" : tab === "treated" ? "🚚 On Delivery" : "✅ Delivered"}
          </button>
        ))}
      </div>

      {/* ✅ Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
           <span className="text-4xl mb-4">🍽️</span>
           <p className="text-gray-500 font-medium">No {activeTab} orders found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="font-bold text-lg text-gray-800 mb-1">
                    Order #{order.order_number}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    {new Date(order.created_at).toLocaleDateString()} • {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${getDeliveryStatusColor(order.delivery_status)}`}>
                    {order.delivery_status || "PENDING"}
                  </span>
                   <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${getPaymentStatusColor(order.payment_status)}`}>
                    {order.payment_status || "UNPAID"}
                  </span>
                </div>
              </div>

             {/* Customer Info */}
             <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
               <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                 {order.user?.name?.[0]}
               </div>
               <div>
                 <p className="text-sm font-semibold text-gray-800">{order.user?.name}</p>
                 <p className="text-xs text-gray-500 truncate max-w-[150px]">{order.address}</p>
               </div>
               <div className="ml-auto text-right">
                  <p className="text-sm font-bold text-slate-800">₦{Number(order.total_price).toLocaleString()}</p>
                  <p className="text-xs text-slate-400">Total</p>
               </div>
             </div>

              {/* Items Preview */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2">
                  {order.items?.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 line-clamp-1">{item.product.name}</span>
                      <span className="text-gray-400 font-medium">x{item.quantity}</span>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <p className="text-xs text-blue-500 font-medium">+ {order.items.length - 3} more items...</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              {activeTab === "pending" && (
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
                >
                  Treat Order →
                </button>
              )}

              {activeTab === "treated" && order.payment_status !== "paid" && (
                  <button
                    onClick={() => handleConfirmPayment(order.id)}
                    className="w-full py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-200"
                  >
                    Confirm Payment
                  </button>
                )}
               
               {activeTab === "treated" && order.payment_status === "paid" && (
                 <div className="w-full py-3 text-center text-sm font-medium text-emerald-600 bg-emerald-50 rounded-xl">
                   Payment Confirmed ✓
                 </div>
               )}
            </div>
          ))}
        </div>
      )}

      {/* ✅ ModalWrapper Integration */}
      <ModalWrapper
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Treat Order #${selectedOrder?.order_number}`}
      >
        {selectedOrder && (
          <>
            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone_number}</p>
            </div>

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
          </>
        )}
      </ModalWrapper>
    </div>
  );
};

export default OrdersSection;
