import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api"; 

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(state?.cart || []);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("delivery");
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  
    if (!state?.cart && !localStorage.getItem("cart")) {
       navigate("/customer");
    }
    
    if (cartItems.length > 0) {
        const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(totalAmount);
    }
  }, [cartItems, state, navigate]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id; 

      const payload = {
        user_id: userId,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        total_price: total,
        address,
        phone,
        payment_method: paymentMethod,
      };

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload), 
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Order placed successfully!");
        localStorage.removeItem("cart"); 
        setTimeout(() => navigate("/customer"), 2000);
      } else {
        setMessage("❌ " + (data.message || "Failed to place order."));
      }
    } catch (error) {
      setMessage("⚠️ Network error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Checkout</h2>

      <form onSubmit={handleOrderSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Address</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Phone</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Payment Method</label>
          <select
            className="w-full border p-2 rounded"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="delivery">Pay on Delivery</option>
            <option value="card">Pay with Card</option>
          </select>
        </div>

        <div className="flex justify-between text-lg font-semibold mt-4">
          <span>Total:</span>
          <span>₦{total.toLocaleString()}</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

        {message && (
          <div className="text-center mt-3 text-sm font-medium text-gray-700">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
