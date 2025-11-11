import React from "react";

const ModalWrapper = ({ isOpen, onClose, title, children, width = "max-w-lg" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-100/60 backdrop-sm flex items-center justify-center z-50">
      <div
        className={`bg-white p-6 rounded-xl shadow-xl w-full ${width} relative`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        >
          ✕
        </button>

        {/* Header */}
        {title && (
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
            {title}
          </h2>
        )}

        {/* Modal Body */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ModalWrapper;
