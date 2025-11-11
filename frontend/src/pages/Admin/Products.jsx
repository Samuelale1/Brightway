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
      <div className="bg-white p-6 rounded-lg shadow-md">
        {products.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">S/N</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p, index) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    {p.image ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${p.image}`}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-4 py-3">₦{p.price}</td>
                  <td className="px-4 py-3">{p.quantity}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setEditModal(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setDeleteModal(true);
                      }}
                      className="text-red-600 hover:underline"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-4 text-gray-500">No products found.</p>
        )}
      </div>

      {/* ✅ Add Modal */}
      <ModalWrapper
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Product"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="name" value={newProduct.name} onChange={handleChange} placeholder="Product Name" required className="w-full border p-2 rounded" />
          <input type="number" name="price" value={newProduct.price} onChange={handleChange} placeholder="Price (₦)" required className="w-full border p-2 rounded" />
          <input type="number" name="quantity" value={newProduct.quantity} onChange={handleChange} placeholder="Quantity" required className="w-full border p-2 rounded" />
          <textarea name="description" value={newProduct.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded"></textarea>
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded" />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
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
          <form onSubmit={handleEdit} className="space-y-3">
            <input type="text" value={selectedProduct.name} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} className="w-full border p-2 rounded" />
            <textarea value={selectedProduct.description || ""} onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })} className="w-full border p-2 rounded" />
            <input type="number" value={selectedProduct.price} onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })} className="w-full border p-2 rounded" />
            <input type="number" value={selectedProduct.quantity} onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })} className="w-full border p-2 rounded" />
            <input type="file" onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.files[0] })} className="w-full border p-2 rounded" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">Save</button>
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
