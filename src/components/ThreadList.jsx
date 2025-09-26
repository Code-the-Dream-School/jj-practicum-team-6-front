import React from "react";

const PLACEHOLDER_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM8.5 11.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5Z" />
  </svg>
);

export default function ThreadList({ threads = [], selectedId, loading, error, onSelect }) {
  return (
    <aside className="col-span-12 md:col-span-3 rounded-2xl bg-white overflow-hidden h-[calc(100vh-160px)]">
      <div className="p-3 border-b border-gray-100 bg-white">
        <input
          type="text"
          placeholder="Search chats"
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none"
          disabled
        />
      </div>

      <div className="h-full overflow-y-auto">
        {loading ? (
          <div className="p-4 text-sm text-gray-600">Loading…</div>
        ) : error ? (
          <div className="p-4 text-sm text-red-600">{error}</div>
        ) : !threads.length ? (
          <div className="p-4 text-sm text-gray-600">No conversations yet</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {threads.map((t) => {
              const item = t.item || {};

              const rawStatus =
                item.status || t.type || (item.title || "").toLowerCase().includes("lost") ? "LOST" : "";

              const status =
                rawStatus === "FOUND" || rawStatus?.toLowerCase() === "found"
                  ? "Found"
                  : rawStatus === "LOST" || rawStatus?.toLowerCase() === "lost"
                  ? "Lost"
                  : "";

              const titleLine = [status, item.title].filter(Boolean).join(": ") || "Conversation";
          
              const preview =
                (t.lastMessage?.body || t.lastMessage?.text || "").trim() ||
                (Array.isArray(t.messages) && (t.messages.at(-1)?.body || t.messages.at(-1)?.text || "").trim()) ||
                "No messages yet";

              const thumb = item.primaryPhotoUrl;

              return (
                <li key={t.id}>
                  <button
                    onClick={() => onSelect?.(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 ${
                      selectedId === t.id ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="h-10 w-10 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                      {thumb ? (
                        <img src={thumb} alt="item" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          {PLACEHOLDER_ICON}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-gray-900 truncate">{titleLine}</div>
                      <div className="text-[12px] text-gray-500 truncate">{preview}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}