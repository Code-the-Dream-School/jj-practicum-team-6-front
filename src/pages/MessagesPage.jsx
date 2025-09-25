import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ThreadList from "../components/ThreadList";
import MessageInput from "../components/MessageInput";
import ReportModal from "../components/ReportModal";
import { listThreads, getMessages, postMessage } from "../services/messagesService";
import { getUploadSignature } from "../services/uploadsService";
import { useAuth } from "../contexts/AuthContext.jsx";

const AVATAR_PLACEHOLDER = "/images/avatar-placeholder.svg";

export default function MessagesPage() {
  // Threads (left)
  const [threads, setThreads] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [threadsError, setThreadsError] = useState("");

  // URL / selection
  const { search } = useLocation();
  const navigate = useNavigate();
  const threadFromUrl = useMemo(() => new URLSearchParams(search).get("thread"), [search]);
  const [selectedId, setSelectedId] = useState(null);

  // Messages
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  // Current user id (robust)
  const auth = (typeof useAuth === "function" ? useAuth() : {}) || {};
  const [myId, setMyId] = useState(null);
  useEffect(() => {
    // try useAuth().user?.id, then localStorage fallback
    const fromHook =
      auth?.user?.id ??
      auth?.user?.user?.id ?? // some apps store nested object
      auth?.currentUser?.id ??
      null;

    if (fromHook) {
      setMyId(fromHook);
      return;
    }
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      setMyId(parsed?.id || null);
    } catch {
      setMyId(null);
    }
  }, [auth?.user, auth?.currentUser]);

  // Composer state
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const isDesktop = useIsDesktop();

  function setThreadInUrl(id, { replace = false } = {}) {
    const q = new URLSearchParams(search);
    if (id) q.set("thread", id);
    else q.delete("thread");
    const qs = q.toString();
    navigate({ search: qs ? `?${qs}` : "" }, { replace });
  }

  // Report modal state
const [showReport, setShowReport] = useState(false);
const [reportText, setReportText] = useState("");
const [reportSent, setReportSent] = useState(false);

function openReport() {
  setReportText("");
  setReportSent(false);
  setShowReport(true);
}
function closeReport() {
  setShowReport(false);
}
function submitReport(e) {
  e.preventDefault();
  setReportSent(true);
  setTimeout(() => setShowReport(false), 1200);
}


  // Load threads
  useEffect(() => {
    (async () => {
      setLoadingThreads(true);
      try {
        const res = await listThreads();
        const items = res?.threads || res?.data || [];
        setThreads(items);

        let initial = null;
        if (threadFromUrl && items.some((t) => t.id === threadFromUrl)) initial = threadFromUrl;
        else if (items.length && isDesktop) initial = items[0].id;

        setSelectedId(initial);
        setThreadInUrl(initial, { replace: true });
        setThreadsError("");
      } catch (e) {
        setThreadsError(e?.message || "Failed to load conversations");
      } finally {
        setLoadingThreads(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, threadFromUrl]);

  // React to ?thread changes
  useEffect(() => {
    if (!threads.length || !threadFromUrl) return;
    if (threads.some((t) => t.id === threadFromUrl)) setSelectedId(threadFromUrl);
  }, [threadFromUrl, threads]);

  // Load messages for selected
  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    (async () => {
      setLoadingMessages(true);
      try {
        const res = await getMessages(selectedId, { limit: 30 });
        const arr = res?.messages || res?.data || [];
        setMessages(arr);
        setMessagesError("");
      } catch (e) {
        setMessagesError(e?.message || "Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    })();
  }, [selectedId]);

  function handleSelectThread(id) {
    setSelectedId(id);
    setThreadInUrl(id);
  }

  // Client-side Cloudinary upload (returns secure_url)
  async function uploadToCloudinary(localFile, sig) {
    const fd = new FormData();
    fd.append("file", localFile);
    fd.append("api_key", sig.apiKey);
    fd.append("timestamp", String(sig.timestamp));
    if (sig.folder) fd.append("folder", sig.folder);
    fd.append("signature", sig.signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
      { method: "POST", body: fd }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.secure_url) throw new Error(data?.error?.message || "Upload failed");
    return data.secure_url;
  }

  // Send message
  async function handleSend(e) {
    e?.preventDefault();
    if (!selectedId || busy) return;

    const text = draft.trim();
    if (!text && !file) return;

    const bodyToSend = text || "📷"; // backend requires non-empty body

    setBusy(true);
    try {
      let attachmentUrl = null;
      if (file) {
        const sig = await getUploadSignature();
        attachmentUrl = await uploadToCloudinary(file, sig);
      }

      const optimistic = {
        id: `optimistic-${Date.now()}`,
        threadId: selectedId,
        senderId: myId,
        body: bodyToSend,
        attachmentUrl,
        createdAt: new Date().toISOString(),
        __optimistic: true,
      };
      setMessages((prev) => [optimistic, ...prev]);

      const saved = await postMessage(selectedId, { body: bodyToSend, attachmentUrl });
      const savedMsg = saved?.data || saved;

      setMessages((prev) => {
        const withoutOpt = prev.filter((m) => !m.__optimistic);
        return [savedMsg, ...withoutOpt];
      });

      setDraft("");
      clearImage();
    } catch (err) {
      setMessages((prev) => prev.filter((m) => !m.__optimistic));
      alert(err?.message || "Failed to send");
    } finally {
      setBusy(false);
    }
  }

  // Emoji & image handlers
  function onEmojiClick(emojiData) {
    setDraft((v) => v + (emojiData?.emoji || ""));
  }
  function onPickImage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
  }
  function clearImage() {
    setFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview("");
  }

  const selectedThread = useMemo(() => threads.find((t) => t.id === selectedId), [threads, selectedId]);
  const hasThreads = threads.length > 0;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/images/chat-bg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="grid grid-cols-12 max-w-7xl mx-auto gap-4 px-4 py-6">
        {/* LEFT */}
        <div className={selectedId ? "hidden md:block col-span-12 md:col-span-3" : "block col-span-12 md:col-span-3"}>
          <ThreadList
            threads={threads}
            selectedId={selectedId}
            loading={loadingThreads}
            error={threadsError}
            onSelect={handleSelectThread}
          />
        </div>

        {/* RIGHT */}
        <section
          className={[
            "col-span-12 md:col-span-9 rounded-2xl overflow-hidden md:flex flex-col h-[calc(100vh-160px)]",
            selectedId ? "flex" : "hidden md:flex",
          ].join(" ")}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
                aria-label="Back to conversations"
                onClick={() => {
                  setSelectedId(null);
                  setThreadInUrl(null);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M14.7 6.3a1 1 0 0 1 0 1.4L10.41 12l4.3 4.3a1 1 0 0 1-1.42 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.42 0Z" />
                </svg>
              </button>

              <Avatar
                src={selectedThread?.otherUser?.avatarUrl}
                alt={selectedThread?.otherUser ? otherPartyName(selectedThread) : "User"}
                size={32}
              />
              <div className="text-[14px] font-semibold">
                {selectedThread?.otherUser
                  ? otherPartyName(selectedThread)
                  : hasThreads
                  ? "Select a conversation"
                  : "No conversations yet"}
              </div>
            </div>

            <button
              type="button"
              className="rounded-full bg-[#FF725E] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              disabled={!selectedId}
              onClick={openReport}
            >
              Report
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-6">
            {loadingMessages ? (
              <div className="text-sm text-gray-700">Loading messages…</div>
            ) : messagesError ? (
              <div className="text-sm text-red-600">{messagesError}</div>
            ) : !messages.length ? (
              <div className="text-sm text-gray-700">
                {selectedId ? "No messages yet" : hasThreads ? "Choose a chat on the left." : "No conversations yet"}
              </div>
            ) : (
              <div className="mx-auto max-w-2xl space-y-3">
                {messages
                  .slice()
                  .reverse()
                  .map((m) =>
                    m.senderId && myId && m.senderId === myId ? (
                      <BubbleRight key={m.id} {...m} />
                    ) : (
                      <BubbleLeft key={m.id} {...m} />
                    )
                  )}
              </div>
            )}
          </div>

          {/* Composer */}
          <MessageInput
            value={draft}
            setValue={setDraft}
            onSend={handleSend}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            onEmojiClick={onEmojiClick}
            onPickImage={onPickImage}
            filePreview={filePreview}
            clearImage={clearImage}
            disabled={!selectedId || busy}
          />
          <ReportModal
            show={showReport}
            onClose={closeReport}
            onSubmit={submitReport}
            reportText={reportText}
            setReportText={setReportText}
            reportSent={reportSent}
          />


        </section>
      </div>
    </div>
  );
}

/* helpers */

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

function Avatar({ src, alt = "avatar", size = 40 }) {
  const dim = `${size}px`;
  return (
    <div className="rounded-full bg-gray-200 overflow-hidden flex-shrink-0" style={{ width: dim, height: dim }}>
      <img
        src={src || AVATAR_PLACEHOLDER}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = AVATAR_PLACEHOLDER;
        }}
      />
    </div>
  );
}

function otherPartyName(thread) {
  const other = thread?.otherUser;
  if (!other) return "Conversation";
  const full = `${other.firstName || ""} ${other.lastName || ""}`.trim();
  return full || other.name || "Conversation";
}

function isImageUrl(url = "") {
  return /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(url);
}

function BubbleLeft({ body: text, createdAt: time, attachmentUrl }) {
  return (
    <div className="flex items-start gap-2">
      <div className="rounded-2xl px-3 py-2 bg-gray-200 text-[13px] text-gray-900 max-w-[66%] md:max-w-[640px] space-y-2 shadow-sm">
        {text && <div className="whitespace-pre-wrap break-words">{text}</div>}
        {attachmentUrl &&
          (isImageUrl(attachmentUrl) ? (
            <img src={attachmentUrl} alt="attachment" className="rounded-xl max-w-full" loading="lazy" />
          ) : (
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-3 py-1 text-sm bg-black text-white rounded-md"
            >
              Open attachment
            </a>
          ))}
      </div>
      <div className="self-end text-[10px] text-gray-500">{formatTime(time)}</div>
    </div>
  );
}

function BubbleRight({ body: text, createdAt: time, attachmentUrl }) {
  return (
    <div className="flex items-start gap-2 justify-end">
      <div className="self-end text-[10px] text-gray-500">{formatTime(time)}</div>
      <div className="rounded-2xl px-3 py-2 bg-black text-white text-[13px] max-w-[66%] md:max-w-[640px] space-y-2 shadow-sm">
        {text && <div className="whitespace-pre-wrap break-words">{text}</div>}
        {attachmentUrl &&
          (isImageUrl(attachmentUrl) ? (
            <img src={attachmentUrl} alt="attachment" className="rounded-xl max-w-full" loading="lazy" />
          ) : (
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-3 py-1 text-sm bg-white text-black rounded-md"
            >
              Open attachment
            </a>
          ))}
      </div>
    </div>
  );
}

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
}
