import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LocationMap from "../../components/LocationMap";
import ItemGallery from "../../components/items/ItemGallery";
import CommentsSection from "../../components/items/CommentsSection";
import ConfirmModal from "../../components/ConfirmModal";
import OwnerHeader from "../../components/items/OwnerHeader";
import ItemMiniMap from "../../components/items/ItemMiniMap";
import MetaBar from "../../components/items/MetaBar";
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
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";

import { AuthContext } from "../../contexts/AuthContext";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const routedItem = location?.state?.item || null;
  const dateOverrideRaw = location?.state && location.state.dateOverride;
  let dateOverride = null;
  try {
    const ls = localStorage.getItem("itemDateOverrides");
    const map = ls ? JSON.parse(ls) : {};
    const candidate = map && id ? map[id] : null;
    const pick = dateOverrideRaw || candidate || null;
    dateOverride = pick ? new Date(pick) : null;
  } catch (e) {
    dateOverride = dateOverrideRaw ? new Date(dateOverrideRaw) : null;
  }
  const [item, setItem] = useState(routedItem || null);
  const [loading, setLoading] = useState(!routedItem);

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
  const baseSeen = typeof item?.seenCount === "number" ? item.seenCount : 0;
  const [iHaveSeen, setIHaveSeen] = useState(false);
  const [seenMeta, setSeenMeta] = useState({});
  const [seenList, setSeenList] = useState([]);
  const [mySeenId, setMySeenId] = useState(null);
  const [seenLoaded, setSeenLoaded] = useState(false);
  const seenCount = seenLoaded
    ? Array.isArray(seenList)
      ? seenList.length
      : baseSeen
    : baseSeen;
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const commentsCountDisplay = commentsLoaded
    ? comments.length
    : typeof item?.commentsCount === "number"
      ? item.commentsCount
      : comments.length;
  const [errorMsg, setErrorMsg] = useState("");
  const myId = storageUser?.id || storageUser?.userId;
  const isOwner = myId && item?.userId && String(item.userId) === String(myId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const toStatusText = (s) => {
      const x = (s || "").toString().toUpperCase();
      if (x === "LOST") return "Lost";
      if (x === "FOUND") return "Found";
      if (x === "RESOLVED") return "Resolved";
      return s || "Lost";
    };
    const normalize = (data) => {
      if (!data) return null;
      const baseStatus = toStatusText(data.status);
      return {
        ...data,
        status: data.isResolved ? "Resolved" : baseStatus,
        baseStatus,
        imageUrl:
          data.primaryPhotoUrl ||
          (Array.isArray(data.photos) && data.photos.length
            ? data.photos[0].url
            : ""),
        location: data.zipCode || data.location || "",
        date: dateOverride
          ? dateOverride.toLocaleDateString()
          : data.dateReported
            ? new Date(data.dateReported).toLocaleDateString()
            : data.createdAt
              ? new Date(data.createdAt).toLocaleDateString()
              : data.date || "",
        userId: data.ownerId ?? data.userId,
        lat: typeof data.latitude === "number" ? data.latitude : undefined,
        lng: typeof data.longitude === "number" ? data.longitude : undefined,
      };
    };

    let mounted = true;
    if (routedItem) {
      setItem(normalize(routedItem));
      itemsService
        .getItem(id)
        .then((fresh) => {
          if (!mounted) return;
          setItem(normalize(fresh));
        })
        .catch(() => {})
        .finally(() => {
          if (!mounted) return;
          setLoading(false);
        });
    } else {
      setLoading(true);
      itemsService
        .getItem(id)
        .then((data) => {
          if (!mounted) return;
          setItem(normalize(data));
        })
        .catch(() => {
          if (!mounted) return;
          setItem(null);
        })
        .finally(() => {
          if (!mounted) return;
          setLoading(false);
        });
    }

    return () => {
      mounted = false;
    };
  }, [id, routedItem]);

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
        setCommentsLoaded(true);
      })
      .catch((err) => {
        console.warn("Failed to load comments", err);
        setCommentsLoaded(true);
      });

    seenService
      .listSeen(item.id, { limit: 100 })
      .then(({ seen = [], meta = {} } = {}) => {
        if (!mounted) return;
        const list = seen || [];
        setSeenList(list);
        setSeenMeta(meta || {});
        setSeenLoaded(true);
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
        setSeenLoaded(true);
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
        try {
          localStorage.setItem(
            "lastItemUpdated",
            JSON.stringify({ id: item.id, at: Date.now(), seenDelta: -1 })
          );
        } catch {}
        try {
          window.dispatchEvent(
            new CustomEvent("item-updated", {
              detail: { id: item.id, seenDelta: -1 },
            })
          );
        } catch {}
        setItem((prev) =>
          prev && typeof prev.seenCount === "number"
            ? { ...prev, seenCount: Math.max(0, prev.seenCount - 1) }
            : prev
        );
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
          try {
            localStorage.setItem(
              "lastItemUpdated",
              JSON.stringify({ id: item.id, at: Date.now(), seenDelta: +1 })
            );
          } catch {}
          try {
            window.dispatchEvent(
              new CustomEvent("item-updated", {
                detail: { id: item.id, seenDelta: +1 },
              })
            );
          } catch {}
          setItem((prev) =>
            prev && typeof prev.seenCount === "number"
              ? { ...prev, seenCount: prev.seenCount + 1 }
              : prev
          );
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

  const ResolvedIconButton = ({ checked, onToggle }) => (
    <button
      type="button"
      onClick={() => onToggle(!checked)}
      aria-pressed={!!checked}
      aria-label="Toggle resolved"
      title="Resolved"
      className={`inline-flex items-center justify-center p-1 ${
        checked ? "text-black" : "text-gray-600 hover:text-ink"
      }`}
    >
      {checked ? <FaCheckCircle size={18} /> : <FaRegCircle size={18} />}
    </button>
  );

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
          <OwnerHeader owner={owner} item={item} />

          <div className="flex items-center gap-4 mb-4">
            <h1 className="font-display text-4xl font-bold">{item.title}</h1>
            {item.status && (
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  item.status === "Lost"
                    ? "bg-primary text-white"
                    : item.status === "Found"
                      ? "bg-success text-white"
                      : "bg-black text-white"
                }`}
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
            <ItemMiniMap item={item} />
          </div>

          {/* Meta/Actions row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              {/* Owner: Resolved control */}
              {isOwner &&
                (() => {
                  const onToggle = async (next) => {
                    try {
                      await itemsService.updateItem(item.id, {
                        isResolved: next,
                      });
                      setItem((prev) => {
                        const restored = prev.baseStatus
                          ? prev.baseStatus
                          : prev.status === "Resolved"
                            ? "Lost"
                            : prev.status;
                        try {
                          localStorage.setItem(
                            "lastItemUpdated",
                            JSON.stringify({
                              id: prev.id,
                              at: Date.now(),
                              isResolved: next,
                            })
                          );
                        } catch {}
                        try {
                          window.dispatchEvent(
                            new CustomEvent("item-updated", {
                              detail: { id: prev.id, isResolved: next },
                            })
                          );
                        } catch {}
                        return {
                          ...prev,
                          isResolved: next,
                          status: next ? "Resolved" : restored,
                        };
                      });
                    } catch (err) {
                      setErrorMsg(
                        err?.message || "Failed to update resolved state"
                      );
                    }
                  };

                  return (
                    <div className="inline-flex items-center select-none">
                      <ResolvedIconButton
                        checked={!!item.isResolved}
                        onToggle={onToggle}
                      />
                      <span
                        className="ml-1 text-sm text-gray-700 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onClick={() => onToggle(!item.isResolved)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onToggle(!item.isResolved);
                          }
                        }}
                      >
                        Resolved
                      </span>
                    </div>
                  );
                })()}

              {/* Non-owner: chat CTA first */}
              {!isOwner && (
                <button
                  onClick={async () => {
                    if (!item?.id) return;
                    setErrorMsg("");
                    try {
                      const created = await messagesService.createThread({
                        itemId: item.id,
                      });
                      const threadId =
                        created?.id || created?.threadId || created?.data?.id;
                      navigate(
                        threadId
                          ? `/threads?tid=${encodeURIComponent(threadId)}`
                          : "/threads"
                      );
                    } catch (err) {
                      setErrorMsg(err?.message || "Failed to start chat");
                    }
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-full inline-flex items-center gap-2"
                  aria-label="I found this item"
                >
                  <FaPaperPlane className="text-white" />
                  <span>I Found this item</span>
                </button>
              )}
              <MetaBar
                isOwner={isOwner}
                commentsCountDisplay={commentsCountDisplay}
                seenCount={seenCount}
                iHaveSeen={iHaveSeen}
                toggleSeen={toggleSeen}
                renderActions={false}
              />
            </div>
            <MetaBar
              isOwner={isOwner}
              onEdit={() =>
                navigate(`/items/edit/${item.id}`, { state: { item } })
              }
              onDelete={() => setConfirmDelete(true)}
              renderCounts={false}
            />
          </div>

          {/* Inline error banner for actions */}
          {errorMsg && (
            <div className="mb-6 text-sm rounded-lg bg-red-50 text-red-700 px-3 py-2 border border-red-200">
              {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* Confirm delete */}
      <ConfirmModal
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          setConfirmDelete(false);
          try {
            await itemsService.deleteItem(item.id);
            navigate("/items/list");
          } catch (err) {
            setErrorMsg(err?.message || "Failed to delete item");
          }
        }}
        text={`Delete "${item.title}"?`}
      />
    </div>
  );
}
