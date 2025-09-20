import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function ThreadList({
  threads,
  activeThreadId,
  setActiveThreadId,
  loadingChats,
  onDeleteThread,
}) {
  const [search, setSearch] = useState("");
  const handleContextMenu = (e, threadId) => {
    e.preventDefault();
    onDeleteThread && onDeleteThread(threadId);
  };
  return (
    <aside className="shrink-0 w-64 sm:w-72 md:w-80 h-full min-h-0 border-r bg-white flex flex-col overflow-hidden">
      <div className="p-4 pb-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FaSearch />
          </span>
          <input
            className="w-full rounded-full border pl-10 pr-4 py-2"
            placeholder="Search chats"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 min-h-0 h-full overflow-y-auto hide-scrollbar">
        {loadingChats ? (
          <div className="text-center text-gray-400 mt-8">Loading...</div>
        ) : threads.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">No threads</div>
        ) : (
          threads
            .filter((thread) => {
              const item = thread.item || {};
              const status =
                item.title?.toLowerCase().includes("lost") ||
                thread.type === "lost"
                  ? "Lost"
                  : "Found";
              const lastMsg = thread.messages?.[0]?.body || "";
              const q = search.toLowerCase();
              return (
                item.title?.toLowerCase().includes(q) ||
                status.toLowerCase().includes(q) ||
                lastMsg.toLowerCase().includes(q)
              );
            })
            .map((thread) => {
              const item = thread.item || {};
              const isLost =
                item.title?.toLowerCase().includes("lost") ||
                thread.type === "lost";
              const status = isLost ? "Lost" : "Found";
              const photo = item.primaryPhotoUrl || "/placeholder.png";
              return (
                <div
                  key={thread.id}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                    activeThreadId === thread.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setActiveThreadId(thread.id)}
                  onContextMenu={(e) => handleContextMenu(e, thread.id)}
                  title="Right click to delete"
                >
                  <img
                    src={photo}
                    alt={item.title || "item"}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm truncate">
                      {status}: {item.title || "Item"}
                    </span>
                    <span className="text-xs text-gray-500 break-words whitespace-normal">
                      {(() => {
                        const msg = thread.messages?.[0]?.body || "No messages";
                        return msg.length > 40 ? msg.slice(0, 40) + "..." : msg;
                      })()}
                    </span>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </aside>
  );
}
