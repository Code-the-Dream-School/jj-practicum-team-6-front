import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LocationMap from "../../components/LocationMap";
import ItemGallery from "../../components/items/ItemGallery";
import CommentsSection from "../../components/items/CommentsSection";
import Modal from "../../components/Modal";
import itemsService from "../../services/itemsService";
import messagesService from "../../services/messagesService";
import commentsService from "../../services/commentsService";
import seenService from "../../services/seenService";
import {
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaPaperPlane,
  FaRegEye,
  FaRegComment,
  FaTrash,
} from "react-icons/fa";

import { AuthContext } from "../../contexts/AuthContext";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useContext(AuthContext);
  const storageUser = currentUser || {};

  const owner =
    item?.owner ||
    item?.user ||
    (item?.userId
      ? storageUser &&
        (String(storageUser.id) === String(item.userId) ||
          String(storageUser.userId) === String(item.userId))
        ? storageUser
        : { id: item.userId, firstName: null, lastName: null }
      : null) ||
    null;

  const resolveUserId = () => {
    const uid = storageUser?.id || storageUser?.userId || null;
    if (uid) return uid;
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.id || parsed?.userId || null;
    } catch (e) {
      return null;
    }
  };

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const baseSeen = typeof item?.seen === "number" ? item.seen : 8;
  const [iHaveSeen, setIHaveSeen] = useState(false);
  const [seenMeta, setSeenMeta] = useState({});
  const [seenList, setSeenList] = useState([]);
  const [mySeenId, setMySeenId] = useState(null);
  const seenCount = seenMeta?.count || seenList?.length || baseSeen;
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [creatingThread, setCreatingThread] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    itemsService
      .getItem(id)
      .then((data) => {
        if (!mounted) return;
        if (!data) return setItem(null);
        const toStatusText = (s) => {
          const x = (s || "").toString().toUpperCase();
          if (x === "LOST") return "Lost";
          if (x === "FOUND") return "Found";
          if (x === "RESOLVED") return "Resolved";
          return s || "Lost";
        };
        const normalized = {
          ...data,
          status: toStatusText(data.status),
          imageUrl:
            data.primaryPhotoUrl ||
            (Array.isArray(data.photos) && data.photos.length
              ? data.photos[0].url
              : ""),
          location: data.zipCode || data.location || "",
          date: data.dateReported
            ? new Date(data.dateReported).toLocaleDateString()
            : data.createdAt
              ? new Date(data.createdAt).toLocaleDateString()
              : data.date || "",
          userId: data.ownerId ?? data.userId,
          lat: typeof data.latitude === "number" ? data.latitude : undefined,
          lng: typeof data.longitude === "number" ? data.longitude : undefined,
        };
        setItem(normalized);
      })
      .catch(() => {
        if (!mounted) return;
        setItem(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!item?.id) return;
    let mounted = true;
    commentsService
      .listComments(item.id, { limit: 50 })
      .then(({ comments: list = [], meta = {} } = {}) => {
        if (!mounted) return;
        const ts = (v) => {
          if (typeof v === "number") return v;
          const t = Date.parse(v);
          return Number.isFinite(t) ? t : 0;
        };
        const sorted = (list || []).sort(
          (a, b) => ts(b.createdAt) - ts(a.createdAt)
        );
        setComments(sorted);
      })
      .catch((err) => {
        console.warn("Failed to load comments", err);
      });

    seenService
      .listSeen(item.id, { limit: 100 })
      .then(({ seen = [], meta = {} } = {}) => {
        if (!mounted) return;
        const list = seen || [];
        setSeenList(list);
        setSeenMeta(meta || {});
        try {
          const uid = resolveUserId();
          if (uid) {
            const mine = list.find(
              (m) =>
                String(m.userId) === String(uid) ||
                (m.user && String(m.user.id) === String(uid))
            );
            if (mine) {
              setIHaveSeen(true);
              setMySeenId(mine.id);
            } else {
              setIHaveSeen(false);
              setMySeenId(null);
            }
          }
        } catch (e) {}
      })
      .catch((err) => {
        console.warn("Failed to load seen marks", err);
      });

    return () => {
      mounted = false;
    };
  }, [item?.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-gray-500">Loading item…</p>
      </div>
    );
  }
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

  const addComment = () => {
    if (!commentInput.trim()) return;
    const body = commentInput.trim();
    const temp = {
      id: `temp-${Date.now()}`,
      author:
        storageUser && (storageUser.firstName || storageUser.lastName)
          ? {
              id: storageUser.id || storageUser.userId,
              firstName: storageUser.firstName || storageUser.name || "You",
              lastName: storageUser.lastName || "",
              avatarUrl: storageUser.avatarUrl || null,
            }
          : "You",
      body,
      text: body,
      createdAt: Date.now(),
      pending: true,
    };
    setComments((s) => [temp, ...s]);
    setCommentInput("");
    commentsService
      .postComment(item.id, body)
      .then((created) => {
        setComments((s) => [created, ...s.filter((c) => c.id !== temp.id)]);
      })
      .catch((err) => {
        console.error("postComment failed", err);
        setComments((s) => s.filter((c) => c.id !== temp.id));
      });
  };

  // key handling moved into CommentsSection

  function timeAgo(tsInput) {
    const ts = typeof tsInput === "number" ? tsInput : Date.parse(tsInput);
    const base = Number.isFinite(ts) ? ts : Date.now();
    const diff = Math.floor((Date.now() - base) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
  const deleteComment = (id) => {
    const prev = comments;
    setComments((s) => s.filter((c) => c.id !== id));
    commentsService.deleteComment(id).catch(() => setComments(prev));
  };

  const toggleSeen = async () => {
    const uid = resolveUserId();
    if (!uid) {
      setErrorMsg("Please sign in to mark seen");
      return;
    }

    if (iHaveSeen && mySeenId) {
      setIHaveSeen(false);
      const prevMySeenId = mySeenId;
      try {
        await seenService.unmarkSeen(item.id, prevMySeenId);
        setSeenList((s) => s.filter((x) => x.id !== prevMySeenId));
        setMySeenId(null);
      } catch (err) {
        setIHaveSeen(true);
        setMySeenId(prevMySeenId);
        const msg =
          err?.response?.data?.message ||
          err.message ||
          "Failed to unmark seen";
        setErrorMsg(msg);
      }
    } else {
      const prev = seenList;
      const temp = {
        id: `temp-${Date.now()}`,
        userId: uid,
        user: { id: uid },
        createdAt: Date.now(),
      };
      setSeenList((s) => [temp, ...(s || [])]);
      setIHaveSeen(true);
      try {
        const res = await seenService.markSeen(item.id);
        const created = res?.data ?? res;
        if (created) {
          setSeenList((s) => [created, ...s.filter((m) => m.id !== temp.id)]);
          setMySeenId(created.id);
        } else {
          const { seen = [], meta = {} } = await seenService.listSeen(item.id);
          setSeenList(seen || []);
          setSeenMeta(meta || {});
          const mine = (seen || []).find(
            (m) =>
              String(m.userId) === String(uid) ||
              (m.user && String(m.user.id) === String(uid))
          );
          if (mine) {
            setIHaveSeen(true);
            setMySeenId(mine.id);
          }
        }
      } catch (err) {
        console.error("markSeen error:", err);
        try {
          if (err && typeof err === "object") {
            console.error("err keys:", Object.keys(err));
            console.error("err json:", err);
            if (err?.status) console.error("status:", err.status);
            if (err?.error) console.error("error:", err.error);
            if (err?.message) console.error("message:", err.message);
            if (err?.data) console.error("data:", err.data);
          }
        } catch (e) {
          console.error("failed to stringify error", e);
        }
        setSeenList(prev);
        setIHaveSeen(false);
        setMySeenId(null);
        const serverErr = err?.response?.data || err || {};
        if (
          serverErr?.error?.code === "UNAUTHORIZED" ||
          serverErr?.status === 401 ||
          serverErr?.code === "UNAUTHORIZED"
        ) {
          setErrorMsg("Please sign in to mark this item as seen");
          return;
        }
        if (
          serverErr?.errorCode === "DUPLICATE" ||
          serverErr?.code === "DUPLICATE"
        ) {
          seenService
            .listSeen(item.id)
            .then(({ seen = [], meta = {} } = {}) => {
              setSeenList(seen || []);
              setSeenMeta(meta || {});
              const mine = (seen || []).find(
                (m) =>
                  String(m.userId) === String(uid) ||
                  (m.user && String(m.user.id) === String(uid))
              );
              if (mine) {
                setIHaveSeen(true);
                setMySeenId(mine.id);
              }
            })
            .catch(() => {});
        } else {
          const msg =
            err?.response?.data?.message ||
            err.message ||
            "Failed to mark seen";
          setErrorMsg(msg);
        }
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Image gallery */}
        <div className="lg:w-1/2">
          <ItemGallery images={images} title={item.title} />
          <CommentsSection
            comments={comments}
            commentInput={commentInput}
            setCommentInput={setCommentInput}
            onAddComment={addComment}
            onDeleteComment={deleteComment}
            timeAgo={timeAgo}
            currentUser={storageUser}
          />
        </div>

        {/* Right: Details */}
        <div className="lg:w-1/2">
          <div className="flex items-center gap-4 mb-4">
            {owner && owner.avatarUrl ? (
              <img
                src={owner.avatarUrl}
                alt={owner.firstName || "User"}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                {owner && (owner.firstName || owner.name)
                  ? (owner.firstName || owner.name)[0]
                  : "U"}
              </div>
            )}
            <div>
              <div className="font-semibold">
                {(owner && (owner.firstName || owner.name)) || "User"}{" "}
                {owner && owner.lastName ? owner.lastName : ""}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>
                    {item.location ||
                      (owner &&
                        (owner.zipCode || owner.zipcode || owner.city)) ||
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
                    lat: typeof item.lat === "number" ? item.lat : undefined,
                    lng: typeof item.lng === "number" ? item.lng : undefined,
                  },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex gap-3">
            <button
  onClick={async () => {
    if (!item?.id) return;
    setErrorMsg("");

    const participantId =
      (typeof resolveUserId === "function" && resolveUserId()) ||
      storageUser?.id ||
      storageUser?.userId;

    if (!participantId) {
      setErrorMsg("Please sign in to start a chat.");
      return;
    }

    try {
      // 1) check existing thread for this item
      let threadId = null;
      try {
        const { threads } = await messagesService.listThreads({
          itemId: item.id,
          page: 1,
          size: 1,
        });
        threadId = threads?.[0]?.id || null;
      } catch (_) {}

      // 2) create if missing
      if (!threadId) {
        const created = await messagesService.createThread({
          itemId: item.id,
          participantId,
        });
        threadId = created?.id || created?.threadId || created?.data?.id || created?.data?.threadId || null;
      }

      if (!threadId) {
        setErrorMsg("Chat was created, but no thread id returned.");
        return;
      }

      // 3) open exactly this thread via query param (your router supports /threads?tid=)
      navigate(`/threads?tid=${encodeURIComponent(threadId)}`);
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to start chat";
      if (err?.response?.status === 401) {
        setErrorMsg("Please sign in to start a chat.");
        return;
      }
      setErrorMsg(msg);
    }
  }}
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
            {errorMsg && (
              <div className="ml-auto text-sm rounded-lg bg-red-50 text-red-700 px-3 py-2 border border-red-200">
                {errorMsg}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaRegComment className="text-gray-400" />
              <span>{comments.length} comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal (overlays map controls) */}
      <Modal
        open={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        title="Message the owner"
        footer={
          <>
            <button
              onClick={() => setChatModalOpen(false)}
              className="px-4 py-2 border rounded-full"
            >
              Close
            </button>
            <button
              onClick={async () => {
                if (!item?.id) return;
                setCreatingThread(true);
                try {
                  const created = await messagesService.createThread({
                    itemId: item.id,
                  });
                  const threadId =
                    created?.id || created?.threadId || created?.data?.id;
                  if (threadId && chatMessage.trim()) {
                    try {
                      await messagesService.postMessage(threadId, {
                        body: chatMessage.trim(),
                      });
                    } catch (e) {}
                  }
                  setChatModalOpen(false);
                  setChatMessage("");
                  if (threadId) {
                    navigate(`/threads?tid=${encodeURIComponent(threadId)}`);
                  } else {
                    navigate("/threads");
                  }
                } catch (err) {
                  setErrorMsg(err?.message || "Failed to start chat");
                } finally {
                  setCreatingThread(false);
                }
              }}
              className="px-4 py-2 bg-primary text-white rounded-full disabled:opacity-60"
              disabled={creatingThread}
            >
              {creatingThread ? "Starting..." : "Start chat"}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-700 mb-4">
          Send a short message to the owner to let them know you found this
          item.
        </p>
        <textarea
          className="w-full border rounded-lg p-3 mb-2"
          placeholder={`Hi, I may have found your ${item.title}.`}
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
        />
      </Modal>
    </div>
  );
}
