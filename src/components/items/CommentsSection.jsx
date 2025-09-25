import React from "react";
import { FaTrash } from "react-icons/fa";

export default function CommentsSection({
  comments = [],
  commentInput,
  setCommentInput,
  onAddComment,
  onDeleteComment,
  timeAgo,
  currentUser,
}) {
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAddComment();
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-display text-xl font-semibold mb-2">Comments:</h3>
      <div className="mb-4">
        <textarea
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Write a comment"
          className="w-full rounded-2xl border border-gray-200 p-4 min-h-[100px]"
        />
        <div className="mt-3 flex gap-3">
          <button
            onClick={onAddComment}
            className="px-5 py-2 bg-black text-white rounded-full"
            aria-label="Add comment"
          >
            Add comment
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {[...comments]
          .sort((a, b) => {
            const ta =
              typeof a.createdAt === "number"
                ? a.createdAt
                : Date.parse(a.createdAt);
            const tb =
              typeof b.createdAt === "number"
                ? b.createdAt
                : Date.parse(b.createdAt);
            return (tb || 0) - (ta || 0);
          })
          .map((c) => (
            <div key={c.id} className="group relative flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                {(() => {
                  if (typeof c.author === "string") return c.author[0] || "U";
                  const name = c.author?.firstName || c.author?.lastName || "U";
                  return (name && name[0]) || "U";
                })()}
              </div>
              <div className="flex-1">
                <div className="font-semibold flex items-center justify-between">
                  <div>
                    {(() => {
                      if (typeof c.author === "string") return c.author;
                      const fn = c.author?.firstName || "";
                      const ln = c.author?.lastName || "";
                      const full = `${fn}${fn && ln ? " " : ""}${ln}`.trim();
                      return full || "User";
                    })()}{" "}
                    <span className="text-xs text-gray-400">
                      · {timeAgo(c.createdAt || Date.now())}
                    </span>
                  </div>
                  {(() => {
                    const myId = currentUser?.id || currentUser?.userId;
                    const isMine =
                      c.pending ||
                      c.author === "You" ||
                      (typeof c.author === "object" &&
                        myId &&
                        String(c.author.id) === String(myId));
                    return isMine;
                  })() && (
                    <button
                      onClick={() => onDeleteComment(c.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 ml-2"
                      aria-label="Delete comment"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div className="text-gray600">{c.text || c.body}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
