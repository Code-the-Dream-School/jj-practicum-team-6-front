import React from "react";

export default function ConfirmModal({ open, onConfirm, onCancel, text }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs flex flex-col gap-4 items-center">
        <div className="text-base text-gray-800 text-center">
          {text || "Are you sure?"}
        </div>
        <div className="flex gap-4 mt-2">
          <button
            className="bg-primary hover:bg-[#d14d2a] text-white px-4 py-2 rounded-full font-semibold"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full font-semibold"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
