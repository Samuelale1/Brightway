// src/components/DeleteConfirmModal.jsx
import React from "react";

export default function DeleteConfirmModal({ user, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-[420px] shadow-lg">
        <h3 className="text-lg font-medium mb-3">Delete user</h3>
        <p className="text-sm text-gray-600">Are you sure you want to delete <strong>{user.name}</strong> ({user.email})? This action cannot be undone.</p>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  );
}
