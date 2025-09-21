import React from "react";

export default function ReportModal({
  show,
  onClose,
  onSubmit,
  reportText,
  setReportText,
  reportSent,
}) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative flex flex-col gap-4">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl"
          onClick={onClose}
          aria-label="Close"
          style={{ lineHeight: 1 }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Report Conversation
        </h2>
        {reportSent ? (
          <div className="text-green-600 font-semibold py-8 text-center text-lg">
            Report sent!
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <textarea
              className="border rounded-lg p-3 w-full min-h-[100px] text-base focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="Describe the issue..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-primary hover:bg-[#d14d2a] text-white px-6 py-2.5 rounded-full font-semibold self-end text-base shadow"
            >
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
