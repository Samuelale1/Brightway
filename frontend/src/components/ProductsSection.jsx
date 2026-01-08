import React, { useState, useEffect } from "react";

const ProductsSection = () => {
  const [editModal, setEditModal] = useState(false);
const [deleteModal, setDeleteModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/products", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setNewProduct({ ...newProduct, image: files[0] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // ✅ Handle submit (with image upload)
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    // Build FormData
    const form = new FormData();
    form.append("name", newProduct.name);
    form.append("description", newProduct.description);
    form.append("price", newProduct.price);
    form.append("quantity", newProduct.quantity);
    form.append("added_by", user.id); // IMPORTANT: send user id, not name
    console.log([...form.entries()]);

    if (newProduct.image) form.append("image", newProduct.image);

    // don't set Content-Type header — browser will do it for FormData
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/api/products", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      },
      body: form,
    });

    // read response as text first (so we never crash parsing HTML)
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      // response is not JSON (likely HTML error page)
      console.error("Server responded with non-JSON:", text);
    }

    if (!res.ok) {
      // If controller returned JSON with message array -> join it
      if (data && data.message) {
        const msg = Array.isArray(data.message)
          ? data.message.join(" ")
          : (typeof data.message === "string" ? data.message : JSON.stringify(data.message));
        setMessage(msg);
      } else {
        // fallback: show raw text or generic message
        setMessage(text || `Server error: ${res.status}`);
      }
      return;
    }

    // OK (2xx)
    if (data && data.product) {
      setMessage("✅ Product added successfully!");
      setShowModal(false);
      setNewProduct({ name: "", description: "", price: "", quantity: "", image: null });
      fetchProducts();
    } else {
      setMessage("Product added but server returned unexpected response.");
      fetchProducts();
    }
  } catch (err) {
    console.error("Network/JS error:", err);
    setMessage("Network error, check console for details.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative">
      {/* ✅ Header + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Products</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>

      {/* ✅ Product Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {products.length > 0 ? (
          <table className="w-full  text-sm text-left rtl:text-right text-black dark:text-gray-400 rounded-lg overflow-hidden ">
            <thead className="text-xs text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="bg-blue-100 text-left rounded-lg">
                <th className=" px-6 py-3 text-black">S/N</th>
                <th className=" px-6 py-3 text-black">Image</th>
                <th className=" px-6 py-3 text-black">Name</th>
                <th className="  px-6 py-3 text-black">Price</th>
                <th className=" px-6 py-3 text-black">Quantity</th>
                <th className="  px-6 py-3 text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {products.map((p,index) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1 }</td>
                  <td className="p-3">{p.image ? (<img src={`http://127.0.0.1:8000/storage/${p.image}`} alt={p.name} className="w-12 h-12 object-cover rounded" />) : "No Image"}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.price}</td>
                  <td className="p-3">{p.quantity}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => { setSelectedProduct(p); setEditModal(true); }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => { setSelectedProduct(p); setDeleteModal(true); }}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))} 
            </tbody>
          </table>
        ) : (
          <p className="text-center py-4">No products found.</p>
        )}
      </div>

      {/* ✅ Add Product Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-blue-500/20 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-4">Add Product</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleChange}
                placeholder="Price (₦)"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                required
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-2 border rounded"
              ></textarea>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
              >
                {loading ? "Uploading..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
{/* Edit Product Modal Form */}
      {editModal && selectedProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 className="text-xl font-semibold mb-4 text-center">Edit Product</h3>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = new FormData();
            form.append("name", selectedProduct.name);
            form.append("description", selectedProduct.description);
            form.append("price", selectedProduct.price);
            form.append("quantity", selectedProduct.quantity);
            if (selectedProduct.image instanceof File)
              form.append("image", selectedProduct.image);

            // Spoof PUT for Laravel
            form.append("_method", "PUT");

            const token = localStorage.getItem("token");
            const res = await fetch(`http://127.0.0.1:8000/api/products/${selectedProduct.id}`, {
              method: "POST", // ✅ not PUT
              headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
              },
              body: form,
            });

          const data = await res.json();
          if (res.ok) {
            setMessage("✅ Product updated!");
            setEditModal(false);
            fetchProducts();
          } else {
            setMessage(data.message || "Error updating");
          }
        }}
        className="space-y-3"
      >
        <input
          type="text"
          value={selectedProduct.name}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, name: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          value={selectedProduct.description || ""}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, description: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          value={selectedProduct.price}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, price: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          value={selectedProduct.quantity}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, quantity: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, image: e.target.files[0] })
          }
          className="w-full border-amber-100"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => setEditModal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/* Delete Product Modal Form */}
{deleteModal && selectedProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <h3 className="text-lg mb-4">Delete "{selectedProduct.name}"?</h3>
      <p className="text-gray-600 mb-6">
        This action cannot be undone.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setDeleteModal(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://127.0.0.1:8000/api/products/${selectedProduct.id}`, {
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
              }
            });
            const data = await res.json();
            if (res.ok) {
              setMessage("🗑️ Product deleted");
              setDeleteModal(false);
              fetchProducts();
            } else {
              setMessage(data.message || "Error deleting");
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

      {message && <p className="text-center text-sm mt-4">{message}</p>}
    </div>
  );
};
export default ProductsSection;