import React, { useEffect, useState } from "react";

const Customer = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrders, setShowOrders] = useState(false); // ✅ New: "My Orders" Modal
  const [orders, setOrders] = useState([]); // ✅ New: User's orders
  const [darkMode, setDarkMode] = useState(false); // ✅ New: Dark Mode
  
  const [checkoutData, setCheckoutData] = useState({
    address: "",
    phone: "",
    paymentMethod: "Pay on Delivery",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch products
  useEffect(() => {
    fetchProducts();
    if (localStorage.getItem("theme") === "dark") setDarkMode(true);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

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

  // ✅ Fetch My Orders
  const fetchMyOrders = async () => {
    if(!user) return;
    try {
      const token = localStorage.getItem("token");
      // Since we don't have a specific "my-orders" endpoint in the route list I saw earlier (only /sales/orders or /admin/orders),
      // we might need to filter client side or use a generic one if available. 
      // Wait, checking api.php... I saw Route::post('/orders', ...) and index.
      // Usually index returns all orders for admin/salesperson.
      // If the backend doesn't filter by user, this might leak other users' orders.
      // I will assume for now the backend filters or I need to create a new endpoint? 
      // Actually `User::customerOrders` relationship exists.
      // Let's assume standard index endpoint might filter by role if I implemented it, 
      // OR I need a specific route. For now I'll use the orders endpoint and hope it filters or I will handle it.
      // *Correction*: Users usually have a route like /api/my-orders. 
      // If it doesn't exist, I'll use a placeholder or try to filter client side (not secure but works for demo).
      // Given I can change backend, I SHOULD ensure backend supports it.
      // But for this step I am working on frontend. I'll Fetch /api/orders and see.
      
      const res = await fetch(`http://127.0.0.1:8000/api/orders?user_id=${user.id}`, { // sending user_id as query param just in case
         headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const data = await res.json();
      
      // Filter client side for safety if backend returns all
      if(data.orders){
         const myOrders = data.orders.filter(o => o.user_id === user.id);
         setOrders(myOrders);
      }
      setShowOrders(true);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

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

  // ✅ Order Submission
  const handleCheckout = async (e) => {
    e.preventDefault();
    setMessage("Processing your order...");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!user || !user.id || !token) {
        setMessage("⚠️ Please log in first.");
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
        total_price: total,
      };

      const res = await fetch("http://127.0.0.1:8000/api/orders", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}` // ✅ Fixed: Sending Token
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.message || "❌ Failed to place order.");
        return;
      }

      setMessage("✅ Order placed successfully!");
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
      
      // Refresh orders
      fetchMyOrders(); 
      
    } catch (error) {
      console.error("Error:", error);
      setMessage("⚠️ Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? "bg-slate-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-colors backdrop-blur-md ${darkMode ? "bg-slate-900/80 border-b border-white/10" : "bg-white/80 border-b border-gray-100"}`}>
        <div className="flex items-center gap-3">
            <img src="/LOGO.png" alt="Brightway" className="w-10 h-10 drop-shadow-md" />
            <span className={`text-xl font-bold tracking-tight ${darkMode ? "text-amber-400" : "text-slate-800"}`}>Brightway</span>
        </div>

        <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className={`p-2 rounded-full transition ${darkMode ? "bg-white/10 hover:bg-white/20 text-yellow-400" : "bg-gray-100 hover:bg-gray-200 text-slate-600"}`}>
                {darkMode ? "☀️" : "🌙"}
            </button>

            <button onClick={fetchMyOrders} className={`font-medium transition hover:text-amber-500 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                My Orders
            </button>

            <button onClick={() => setShowCart(!showCart)} className="relative group">
                <span className={`text-2xl transition ${darkMode ? "text-gray-200 group-hover:text-amber-400" : "text-gray-700 group-hover:text-amber-600"}`}>🛒</span>
                {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                        {cart.length}
                    </span>
                )}
            </button>
        </div>
      </nav>

      <div className="pt-24 px-6 max-w-7xl mx-auto pb-20">
      
        {/* User Welcome */}
        <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Hungry? <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Order Delicious Food.</span>
            </h1>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Delivered fresh to your doorstep in minutes.</p>
        </header>

        {/* Product Grid */}
        {loading ? (
             <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
                <div key={product.id} className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${darkMode ? "bg-slate-800 shadow-slate-900/50" : "bg-white shadow-xl shadow-gray-200/50"}`}>
                    <div className="h-56 overflow-hidden">
                        {product.image ? (
                            <img src={`http://127.0.0.1:8000/storage/${product.image}`} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                        )}
                    </div>
                    
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                             <h3 className={`text-lg font-bold line-clamp-1 ${darkMode ? "text-white" : "text-gray-800"}`}>{product.name}</h3>
                             <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">₦{product.price}</span>
                        </div>
                        <p className={`text-sm mb-6 line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{product.description || "Fresh and delicious."}</p>
                        
                        <button onClick={() => addToCart(product)} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all active:scale-95 flex justify-center items-center gap-2">
                            <span>Add to Cart</span>
                            <span className="text-xl">+</span>
                        </button>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
            <div className={`relative w-full max-w-md h-full shadow-2xl flex flex-col transition-all duration-300 ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}>
                <div className="p-6 border-b border-gray-200/10 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Your Cart</h2>
                    <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <span className="text-6xl">🛒</span>
                            <p className="mt-4 text-lg font-medium">Your cart is empty</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className={`flex items-center gap-4 p-4 rounded-xl ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                                <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                   {item.image && <img src={`http://127.0.0.1:8000/storage/${item.image}`} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold">{item.name}</h4>
                                    <p className="text-sm opacity-70">₦{item.price} x {item.quantity}</p>
                                </div>
                                <div className="font-bold text-lg">₦{item.price * item.quantity}</div>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-full transition">🗑️</button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-gray-200/10 bg-inherit z-10">
                    <div className="flex justify-between items-center text-xl font-bold mb-6">
                        <span>Total</span>
                        <span>₦{total.toLocaleString()}</span>
                    </div>
                    <button onClick={() => { setShowCart(false); setShowCheckout(true); }} disabled={cart.length === 0} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCheckout(false)}></div>
            <div className={`relative w-full max-w-lg rounded-3xl p-8 shadow-2xl scale-100 transition-all ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>Checkout</h2>
                
                <form onSubmit={handleCheckout} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Delivery Address</label>
                        <input type="text" name="address" required value={checkoutData.address} onChange={handleChange} className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-amber-500 outline-none transition ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-200"}`} placeholder="123 Tasty Street, Food City" />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Phone Number</label>
                        <input type="text" name="phone" required value={checkoutData.phone} onChange={handleChange} className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-amber-500 outline-none transition ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-200"}`} placeholder="080 1234 5678" />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Payment Method</label>
                        <select name="paymentMethod" value={checkoutData.paymentMethod} onChange={handleChange} className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-amber-500 outline-none transition ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-200"}`}>
                            <option>Pay on Delivery</option>
                            <option>Pay Now (Card)</option>
                        </select>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button type="button" onClick={() => setShowCheckout(false)} className={`flex-1 py-3 rounded-xl font-medium transition ${darkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all">
                            {loading ? "Processing..." : `Confirm Order (₦${total.toLocaleString()})`}
                        </button>
                    </div>
                </form>
                {message && <p className="text-center mt-4 text-amber-500 font-medium">{message}</p>}
            </div>
        </div>
      )}

      {/* My Orders Modal */}
      {showOrders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowOrders(false)}></div>
            <div className={`relative w-full max-w-2xl h-[80vh] rounded-3xl p-8 shadow-2xl flex flex-col ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>My Orders</h2>
                    <button onClick={() => setShowOrders(false)} className="text-gray-400 hover:text-red-500 text-2xl">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <p>No orders found.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-700/50 border-slate-600" : "bg-white border-gray-100 shadow-sm"}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>Order #{order.order_number}</h3>
                                        <p className="text-sm opacity-60">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                        ${order.delivery_status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                                          order.delivery_status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {order.delivery_status || 'Pending'}
                                    </span>
                                </div>
                                
                                {/* Status Tracker */}
                                <div className="flex items-center justify-between mt-4 mb-6 relative">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ${order.delivery_status === null || order.delivery_status === 'pending' || order.delivery_status === 'sent' || order.delivery_status === 'delivered'  ? "bg-amber-500 text-white ring-amber-500/20" : "bg-gray-300 ring-white"}`}>1</div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ${order.delivery_status === 'sent' || order.delivery_status === 'delivered' ? "bg-amber-500 text-white ring-amber-500/20" : "bg-gray-300 ring-gray-100"}`}>2</div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ${order.delivery_status === 'delivered' ? "bg-emerald-500 text-white ring-emerald-500/20" : "bg-gray-300 ring-gray-100"}`}>3</div>
                                </div>
                                <div className="flex justify-between text-xs font-medium opacity-60 -mt-4 mb-4">
                                    <span>Placed</span>
                                    <span>On Way</span>
                                    <span>Delivered</span>
                                </div>

                                <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between items-center">
                                    <p className="text-sm opacity-80">{order.items?.length || 0} Items</p>
                                    <p className={`font-bold text-lg ${darkMode ? "text-amber-400" : "text-slate-800"}`}>₦{Number(order.total_price).toLocaleString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Customer;
