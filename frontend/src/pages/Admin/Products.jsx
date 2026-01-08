import React, { useState, useEffect } from "react";
import ModalWrapper from "../../components/ModalWrapper";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
  });

  // ✅ Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setNewProduct({ ...newProduct, image: files[0] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // ✅ Add Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("name", newProduct.name);
      form.append("description", newProduct.description);
      form.append("price", newProduct.price);
      form.append("quantity", newProduct.quantity);
      form.append("added_by", user.id);
      if (newProduct.image) form.append("image", newProduct.image);

      const res = await fetch("http://127.0.0.1:8000/api/products", {
        method: "POST",
        body: form,
      });

      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
      }

      if (res.ok) {
        setMessage("✅ Product added successfully!");
        setShowModal(false);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          quantity: "",
          image: null,
        });
        fetchProducts();
      } else {
        setMessage(data?.message || text || "Server error");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("⚠️ Network error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit Product
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", selectedProduct.name);
      form.append("description", selectedProduct.description);
      form.append("price", selectedProduct.price);
      form.append("quantity", selectedProduct.quantity);
      if (selectedProduct.image instanceof File)
        form.append("image", selectedProduct.image);
      form.append("_method", "PUT");

      const res = await fetch(
        `http://127.0.0.1:8000/api/products/${selectedProduct.id}`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Product updated!");
        setEditModal(false);
        fetchProducts();
      } else {
        setMessage(data.message || "Error updating product");
      }
    } catch (err) {
      console.error("Error updating:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Product
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/products/${selectedProduct.id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("🗑️ Product deleted");
        setDeleteModal(false);
        fetchProducts();
      } else {
        setMessage(data.message || "Error deleting");
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div className="relative">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Manage Products</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>

      {/* ✅ Product Table */}
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">S/N</th>
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Quantity</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-slate-600 text-sm">
              {products.map((p, index) => (
                <tr key={p.id} className="hover:bg-amber-50/50 transition duration-200">
                  <td className="p-4 font-medium text-slate-400">{index + 1}</td>
                  <td className="p-4">
                    {p.image ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${p.image}`}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                  </td>
                  <td className="p-4 font-bold text-slate-800">{p.name}</td>
                  <td className="p-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium border border-gray-200">
                          {p.category || 'General'}
                      </span>
                  </td>
                  <td className="p-4 font-bold text-amber-600">₦{p.price}</td>
                  <td className="p-4">
                      {p.availability === 'unavailable' ? (
                          <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded-full">Unavailable</span>
                      ) : p.availability === 'wait_time' ? (
                          <span className="text-orange-500 font-bold text-xs bg-orange-50 px-2 py-1 rounded-full">Wait Time</span>
                      ) : (
                          <span className="text-emerald-500 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full">Available</span>
                      )}
                  </td>
                  <td className="p-4">{p.quantity}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setEditModal(true);
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setDeleteModal(true);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-500">No products found. Start by adding one!</p>
          </div>
        )}
      </div>

      {/* ✅ Add Modal */}
      <ModalWrapper
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Product"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={newProduct.name} onChange={handleChange} placeholder="Product Name" required className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" />
          <div className="grid grid-cols-2 gap-4">
             <input type="number" name="price" value={newProduct.price} onChange={handleChange} placeholder="Price (₦)" required className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" />
             <input type="number" name="quantity" value={newProduct.quantity} onChange={handleChange} placeholder="Quantity" required className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <select name="category" value={newProduct.category || ""} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition bg-white">
                 <option value="">Select Category</option>
                 {["Breakfast", "Lunch", "Dinner", "Swallow", "Drinks", "Rice", "Beverages", "Snacks", "Proteins", "Others"].map(c => <option key={c} value={c}>{c}</option>)}
             </select>
             <select name="availability" value={newProduct.availability || "available"} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition bg-white">
                 <option value="available">✅ Available</option>
                 <option value="wait_time">⏳ Wait Time</option>
                 <option value="unavailable">❌ Unavailable</option>
             </select>
          </div>

          <textarea name="description" value={newProduct.description} onChange={handleChange} placeholder="Description" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" rows="3"></textarea>
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
          
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all active:scale-95">
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </ModalWrapper>

      {/* ✅ Edit Modal */}
      <ModalWrapper
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Product"
      >
        {selectedProduct && (
          <form onSubmit={handleEdit} className="space-y-4">
            <input type="text" value={selectedProduct.name} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" />
            
             <div className="grid grid-cols-2 gap-4">
                <input type="number" value={selectedProduct.price} onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" />
                <input type="number" value={selectedProduct.quantity} onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <select value={selectedProduct.category || ""} onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition bg-white">
                    <option value="">Select Category</option>
                    {["Breakfast", "Lunch", "Dinner", "Swallow", "Drinks", "Rice", "Beverages", "Snacks", "Proteins", "Others"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={selectedProduct.availability || "available"} onChange={(e) => setSelectedProduct({ ...selectedProduct, availability: e.target.value })} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition bg-white">
                    <option value="available">✅ Available</option>
                    <option value="wait_time">⏳ Wait Time</option>
                    <option value="unavailable">❌ Unavailable</option>
                </select>
             </div>

            <textarea value={selectedProduct.description || ""} onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" rows="3" />
            <input type="file" onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.files[0] })} className="w-full border border-gray-200 p-3 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
            
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all active:scale-95">Save Changes</button>
          </form>
        )}
      </ModalWrapper>

      {/* ✅ Delete Modal */}
      <ModalWrapper
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Product"
      >
        {selectedProduct && (
          <>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete <strong>{selectedProduct.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </>
        )}
      </ModalWrapper>

      {message && <p className="text-center text-sm mt-4">{message}</p>}
    </div>
  );
};

export default Products;
