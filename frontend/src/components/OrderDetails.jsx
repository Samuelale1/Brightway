import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryData, setDeliveryData] = useState({
    delivery_person: "",
    delivery_phone: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/orders/${id}`);
      const data = await res.json();
      if (data.status === "success") setOrder(data.order);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setDeliveryData({ ...deliveryData, [e.target.name]: e.target.value });
  };

  const handleAssignDelivery = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/orders/${id}/assign-delivery`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deliveryData),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        alert("✅ Delivery assigned successfully!");
        fetchOrder();
      } else {
        alert("❌ Failed: " + data.message);
      }
    } catch (error) {
      console.error("Error assigning delivery:", error);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Loading order...</div>
    );

  if (!order)
    return (
      <div className="p-10 text-center text-red-500">
        Order not found or deleted.
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-cyan-600 hover:underline"
      >
        ← Back to Orders
      </button>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Order Details: {order.order_number}
        </h2>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
          <p>
            <strong>Customer:</strong> {order.user?.name || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone_number || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
          <p>
            <strong>Total:</strong> ₦{order.total_price}
          </p>
          <p>
            <strong>Payment:</strong> {order.payment_status}
          </p>
          <p>
            <strong>Delivery:</strong> {order.delivery_status}
          </p>
        </div>

        {/* Order Items */}
        <h3 className="text-lg font-semibold mb-3">Ordered Items</h3>
        <table className="w-full border rounded-lg overflow-hidden mb-6">
          <thead className="bg-cyan-600 text-white">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">{item.product?.name}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">₦{item.price}</td>
                <td className="px-4 py-2">
                  ₦{item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Assign Delivery Section */}
        {order.delivery_status === "pending" && (
          <div className="bg-gray-50 border p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3">
              Assign Delivery Person
            </h4>
            <form
              onSubmit={handleAssignDelivery}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              <input
                type="text"
                name="delivery_person"
                placeholder="Delivery Person Name"
                value={deliveryData.delivery_person}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="delivery_phone"
                placeholder="Delivery Phone Number"
                value={deliveryData.delivery_phone}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <button
                type="submit"
                className="bg-cyan-600 text-white rounded p-2 hover:bg-cyan-700"
              >
                Assign Delivery
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
