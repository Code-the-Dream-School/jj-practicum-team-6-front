import React from "react";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";

export default function MyPostCard({
  item,
  onOpen,
  onResolve,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
    >
      <div className="mb-4">
        <span
          className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
            item.status === "Lost"
              ? "bg-primary text-white"
              : "bg-success text-white"
          }`}
        >
          {item.status}
        </span>
      </div>
      <div className="w-full h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="w-full h-full p-0 m-0 text-left rounded-xl overflow-hidden"
          aria-label={`Open ${item.title}`}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="text-4xl w-full h-full flex items-center justify-center">
              {item.status === "Lost" ? "📱" : "🎒"}
            </div>
          )}
        </button>
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-lg font-semibold text-ink leading-tight">
          {item.title}
        </h3>
        <p className="font-body text-sm text-gray600 flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-400" />
          <span>{item.location}</span>
        </p>
        <p className="font-body text-sm text-gray-500 flex items-center gap-2">
          <FaRegCalendarAlt className="text-gray-400" />
          <span>{item.date}</span>
        </p>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs sm:text-sm px-2 w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onResolve();
          }}
          className={`inline-flex items-center gap-2 whitespace-nowrap ${
            item.isResolved
              ? "text-red-600 hover:text-red-700"
              : "text-gray-500 hover:text-red-600"
          }`}
          title="Toggle Resolved"
          aria-pressed={item.isResolved}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="18"
            height="18"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span>Resolved</span>
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-ink whitespace-nowrap"
            title="Edit"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="18"
              height="18"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-ink whitespace-nowrap"
            title="Delete"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="18"
              height="18"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
