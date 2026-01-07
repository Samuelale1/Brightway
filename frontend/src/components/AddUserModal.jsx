// src/components/AddUserModal.jsx
import React, { useState } from "react";
import Spinner from "./Spinner";

export default function AddUserModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      // REGISTER USER — always creates customer by default
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Register failed"
        );
      }

      // Optional: Promote role if admin selected something else
      if (form.role !== "customer") {
        await fetch(
          `http://127.0.0.1:8000/api/admin/users/${data.user.id}/role`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role: form.role }),
          }
        );
      }

      onClose();
    } catch (e) {
      setErr(e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-[520px] shadow-lg">
        <h3 className="text-lg font-medium mb-3">Add new user</h3>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
            className="w-full p-2 border rounded"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Password"
              required
              className="p-2 border rounded"
            />

            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={(e) =>
                setForm({
                  ...form,
                  password_confirmation: e.target.value,
                })
              }
              placeholder="Confirm Password"
              required
              className="p-2 border rounded"
            />
          </div>

          {/* ONLY VALID ROLES */}
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="customer">Customer</option>
            <option value="salesperson">Salesperson</option>
            <option value="admin">Admin</option>
          </select>

          {err && <div className="text-sm text-red-500">{err}</div>}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner size={16} /> Creating...
                </span>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
