import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LocationMap from "../../components/LocationMap";
import { mockItems } from "../../util/itemsData";
import {
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaPaperPlane,
  FaRegEye,
  FaRegComment,
  FaTrash,
} from "react-icons/fa";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = mockItems.find((i) => String(i.id) === String(id));

  function getUserFromStorage() {
    try {
      const data = JSON.parse(localStorage.getItem("user"));
      return data || {};
    } catch {
      return {};
    }
  }

  const storageUser = getUserFromStorage();

  const [mainIndex, setMainIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Emily Carter",
      text: "I think I saw your phone — you might've left it on the bench.",
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      id: 2,
      author: "Jason Miller",
      text: "They usually keep lost items in their Lost & Found room.",
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
    },
  ]);
  const [commentInput, setCommentInput] = useState("");
  const baseSeen = typeof item.seen === "number" ? item.seen : 8;
  const [iHaveSeen, setIHaveSeen] = useState(false);
  const seenCount = baseSeen + (iHaveSeen ? 1 : 0);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-gray-500">Item not found.</p>
      </div>
    );
  }

  const images = item.photos?.length
    ? item.photos.map((p) => p.url)
    : item.imageUrl
      ? [item.imageUrl]
      : [];

  const mainImage = images[mainIndex] || null;

  const addComment = () => {
    if (!commentInput.trim()) return;
    const next = {
      id: Date.now(),
      author: "You",
      text: commentInput.trim(),
      createdAt: Date.now(),
    };
    setComments((s) => [next, ...s]);
    setCommentInput("");
  };

  const handleCommentKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  };

  function timeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  const deleteComment = (id) => {
    setComments((s) => s.filter((c) => c.id !== id));
  };

  const toggleSeen = () => {
    setIHaveSeen((v) => !v);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Image gallery */}
        <div className="lg:w-1/2">
          <div className="w-full rounded-2xl overflow-hidden bg-gray-100">
            {mainImage ? (
              // click to open lightbox
              <button
                onClick={() => setLightboxOpen(true)}
                className="w-full h-[420px] bg-gray-100 flex items-center justify-center focus:outline-none"
                aria-label="Open image"
              >
                <img
                  src={mainImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <div className="w-full h-[420px] flex items-center justify-center text-6xl">
                {item.status === "Lost" ? "\ud83d\udcf1" : "\ud83c\udf92"}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4" role="list">
            {images.length > 0 ? (
              images.map((src, idx) => (
                <button
                  key={src + idx}
                  onClick={() => setMainIndex(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 ${idx === mainIndex ? "border-black" : "border-transparent"}`}
                  aria-label={`Show image ${idx + 1}`}
                >
                  <img
                    src={src}
                    alt={`thumb-${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))
            ) : (
              <div className="text-gray-400">No images</div>
            )}
          </div>

          {/* Lightbox */}
          {lightboxOpen && mainImage && (
            <div
              className="fixed inset-0 z-[10050] bg-black/80 flex items-center justify-center"
              role="dialog"
              aria-modal="true"
              onClick={() => setLightboxOpen(false)}
            >
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  className="absolute top-6 right-6 text-white text-xl"
                  onClick={() => setLightboxOpen(false)}
                  aria-label="Close image"
                >
                  ✕
                </button>
                <img
                  src={mainImage}
                  alt={item.title}
                  className="max-w-[95%] max-h-[85%] object-contain rounded"
                />
              </div>
            </div>
          )}

          {/* Comments (moved to left column) */}
          <div className="mt-6">
            <h3 className="font-display text-xl font-semibold mb-2">
              Comments:
            </h3>
            <div className="mb-4">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={handleCommentKey}
                placeholder="Write a comment"
                className="w-full rounded-2xl border border-gray-200 p-4 min-h-[100px]"
              />
              <div className="mt-3 flex gap-3">
                <button
                  onClick={addComment}
                  className="px-5 py-2 bg-black text-white rounded-full"
                  aria-label="Add comment"
                >
                  Add comment
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {[...comments]
                .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
                .map((c) => (
                  <div
                    key={c.id}
                    className="group relative flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                      {c.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold flex items-center justify-between">
                        <div>
                          {c.author}{" "}
                          <span className="text-xs text-gray-400">
                            · {timeAgo(c.createdAt || Date.now())}
                          </span>
                        </div>
                        {c.author === "You" && (
                          <button
                            onClick={() => deleteComment(c.id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 ml-2"
                            aria-label="Delete comment"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <div className="text-gray600">{c.text}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:w-1/2">
          <div className="flex items-center gap-4 mb-4">
            {storageUser.avatarUrl ? (
              <img
                src={storageUser.avatarUrl}
                alt={storageUser.firstName || "User"}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                {(storageUser.firstName || "U")[0]}
              </div>
            )}
            <div>
              <div className="font-semibold">
                {storageUser.firstName || storageUser.name || "User"}{" "}
                {storageUser.lastName || "User"}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>
                    {storageUser.city ||
                      storageUser.zipcode ||
                      "Unknown location"}
                  </span>
                </span>
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-2">
                  <FaRegCalendarAlt className="text-gray-400" />
                  <span>{new Date().toLocaleDateString()}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <h1 className="font-display text-4xl font-bold">{item.title}</h1>
            {item.status && (
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status === "Lost" ? "bg-primary text-white" : "bg-success text-white"}`}
                aria-hidden="true"
              >
                {item.status}
              </span>
            )}
          </div>
          <p className="text-gray600 mb-6">
            {item.description || "No description provided for this item."}
          </p>

          <div className="mb-6">
            <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200">
              <LocationMap
                mode="display"
                items={[
                  {
                    ...item,
                    lat: item.lat || 40.7128,
                    lng: item.lng || -74.006,
                  },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            {/* Make both action buttons consistent size */}
            <div className="flex gap-3">
              <button
                onClick={() => setChatModalOpen(true)}
                className="bg-primary text-white px-4 py-3 rounded-full flex items-center justify-center gap-2 min-w-[180px]"
                aria-label="I found this item"
              >
                <FaPaperPlane className="text-white" />
                <span>I Found this item</span>
              </button>

              <button
                onClick={toggleSeen}
                className={`px-4 py-3 rounded-full border flex items-center justify-center gap-2 min-w-[180px] ${iHaveSeen ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200"}`}
                aria-pressed={iHaveSeen}
                aria-label={iHaveSeen ? "Marked seen" : "Mark as seen"}
              >
                <FaRegEye />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{seenCount}</span>
                  <span className="text-sm">Seen it</span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaRegComment className="text-gray-400" />
              <span>{comments.length} comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal (overlays map controls) */}
      {chatModalOpen && (
        <div
          className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/50"
          onClick={() => setChatModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 className="font-semibold mb-2">Message the owner</h3>
            <p className="text-sm text-gray-700 mb-4">
              Send a short message to the owner to let them know you found this
              item.
            </p>
            <textarea
              className="w-full border rounded-lg p-3 mb-4"
              placeholder={`Hi, I may have found your ${item.title}.`}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setChatModalOpen(false)}
                className="px-4 py-2 border rounded-full"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setChatModalOpen(false);
                  navigate("/threads");
                }}
                className="px-4 py-2 bg-primary text-white rounded-full"
              >
                Start chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
