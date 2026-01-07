// src/components/EditRoleModal.jsx
import React, { useState } from "react";
import Spinner from "./Spinner";

export default function EditRoleModal({ user, onClose, onSave }) {
  const [role, setRole] = useState(user.role || "customer");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      await onSave(user.id, role);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-[420px] shadow-lg">
        <h3 className="text-lg font-medium mb-3">Edit Role for {user.name}</h3>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="customer">Customer</option>
          <option value="salesperson">Salesperson</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={save}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner size={16} /> Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
