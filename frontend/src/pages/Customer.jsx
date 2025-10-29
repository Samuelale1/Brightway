import React, { useEffect, useState } from "react";

const Customer = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    address: "",
    phone: "",
    paymentMethod: "Pay on Delivery",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Add product to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ✅ Remove from cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ Handle checkout input
  const handleChange = (e) => {
    setCheckoutData({ ...checkoutData, [e.target.name]: e.target.value });
  };

  // ✅ Simulate order submission
  const handleCheckout = async (e) => {
  e.preventDefault();
  setMessage("Processing your order...");
  setLoading(true);

  try {
    const user = JSON.parse(localStorage.getItem("user")); // or your auth state

    if (!user || !user.id) {
      setMessage("⚠️ Please log in first before placing an order.");
      setLoading(false);
      return;
    }

    const orderData = {
      user_id: user.id,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      payment_method:
        checkoutData.paymentMethod === "Pay Now" ? "card" : "delivery",
      address: checkoutData.address,
      phone_number: checkoutData.phone,
      total_price: cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    };

    console.log("🟢 Sending order payload:", orderData);

  const res = await fetch("http://127.0.0.1:8000/api/orders", {
    method: "POST",
    credentials: 'include',
    headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest"
    },
    body: JSON.stringify(orderData),
});

    const text = await res.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Non-JSON response from server:", text);
    }

    if (!res.ok) {
      console.error("❌ Server response:", data || text);
      setMessage(
        data?.message?.join(" ") ||
          "❌ Failed to place order. Please check the form or try again."
      );
      return;
    }

    // ✅ Success
    setMessage("✅ Order placed successfully!");
    setCart([]);
    setShowCheckout(false);
    setShowCart(false);
  } catch (error) {
    console.error("⚠️ Network/JS Error:", error);
    setMessage("⚠️ Network error while placing order.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900"><img src="/LOGO.png" alt="Brightway Logo" className="inline-block w-19 h-19 mr-2" /> Brightway Menu</h1>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          🛒 Cart
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-2">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <svg
            aria-hidden="true"
            className="w-10 h-10 text-gray-200 animate-spin fill-cyan-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 
              100.591 50 100.591C22.3858 100.591 0 
              78.2051 0 50.5908C0 22.9766 22.3858 
              0.59082 50 0.59082C77.6142 0.59082 
              100 22.9766 100 50.5908ZM9.08144 
              50.5908C9.08144 73.1895 27.4013 91.5094 
              50 91.5094C72.5987 91.5094 90.9186 
              73.1895 90.9186 50.5908C90.9186 27.9921 
              72.5987 9.67226 50 9.67226C27.4013 
              9.67226 9.08144 27.9921 9.08144 
              50.5908Z"
              fill="currentColor"
            />
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              {product.image ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${product.image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                {product.description || "No description available."}
              </p>
              <p className="text-cyan-600 font-bold mb-4">₦{product.price}</p>

              <button
                onClick={() => addToCart(product)}
                className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🛒 Cart Sidebar */}
      {showCart && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl p-5 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <ul>
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ₦{item.price} × {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t pt-3">
                <p className="font-bold text-lg">Total: ₦{total}</p>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      )}

      {/* 💳 Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Checkout
            </h3>
            <form onSubmit={handleCheckout} className="space-y-3">
              <input
                type="text"
                name="address"
                placeholder="Delivery Address"
                value={checkoutData.address}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={checkoutData.phone}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <select
                name="paymentMethod"
                value={checkoutData.paymentMethod}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option>Pay on Delivery</option>
                <option>Pay Now</option>
              </select>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Confirm Order
              </button>
            </form>

            <button
              onClick={() => setShowCheckout(false)}
              className="mt-3 w-full text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Status message */}
      {message && (
        <p className="text-center mt-6 text-green-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default Customer;
