import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { FaRegSmile, FaRegImage, FaFlag } from "react-icons/fa";
import ThreadList from "../components/ThreadList";
import ConfirmModal from "../components/ConfirmModal";
import MessageInput from "../components/MessageInput";
import ReportModal from "../components/ReportModal";
import dayjs from "dayjs";

export default function MessagesPage() {
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    threadId: null,
  });
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState("");
  const [input, setInput] = useState("");
  const [loadingChats] = useState(false);
  const [loadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportSent, setReportSent] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const chatContainerRef = useRef(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [nearBottom, setNearBottom] = useState(true);

  const scrollToBottom = () => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    const thread = threads.find((t) => t.id === activeThreadId);
    setMessages(thread ? thread.messages : []);
    setTimeout(() => {
      setIsUserScrolledUp(false);
      scrollToBottom();
    }, 0);
  }, [activeThreadId, threads]);

  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    if (!isUserScrolledUp || nearBottom) {
      scrollToBottom();
    }
  }, [messages, isUserScrolledUp, nearBottom]);

  const handleEmojiClick = (emojiObject) => {
    setInput((prev) => prev + (emojiObject.emoji || ""));
    setShowEmojiPicker(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    const newMsg = {
      id: Date.now(),
      sender: "me",
      body: "",
      imageUrl,
      imageName: file.name,
      createdAt: new Date().toISOString(),
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? { ...t, messages: [...t.messages, newMsg] }
          : t
      )
    );
    setMessages((prev) => [...prev, newMsg]);
    setImageFile(null);
    setImagePreview(null);
    setTimeout(scrollToBottom, 0);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChatScroll = (e) => {
    const el = e.currentTarget;
    const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
    setNearBottom(isNearBottom);
    setIsUserScrolledUp(!isNearBottom);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if ((!input.trim() && !imageFile) || !activeThreadId) return;
    setIsUserScrolledUp(false);
    const newMsg = {
      id: Date.now(),
      sender: "me",
      body: input.trim() || "",
      imageUrl: imageFile ? imagePreview : undefined,
      imageName: imageFile ? imageFile.name : undefined,
      createdAt: new Date().toISOString(),
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? { ...t, messages: [...t.messages, newMsg] }
          : t
      )
    );
    setMessages((prev) => [...prev, newMsg]);
    setTimeout(scrollToBottom, 0);
    setInput("");
    setImageFile(null);
    setImagePreview(null);
  };

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setReportSent(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportText("");
      setReportSent(false);
    }, 1500);
  };

  const HideScrollbarStyles = () => (
    <style>{`
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
    `}</style>
  );

  return (
    <>
      <HideScrollbarStyles />
      <div className="flex h-[calc(100dvh-120px)] min-h-0 w-full overflow-hidden overscroll-none bg-gradient-to-br from-blue-50 to-yellow-50">
        <ThreadList
          threads={threads}
          activeThreadId={activeThreadId}
          setActiveThreadId={setActiveThreadId}
          loadingChats={loadingChats}
          onDeleteThread={(threadId) =>
            setConfirmDelete({ open: true, threadId })
          }
        />
        <ConfirmModal
          open={confirmDelete.open}
          text="Delete this chat?"
          onConfirm={() => {
            setThreads((prev) =>
              prev.filter((t) => t.id !== confirmDelete.threadId)
            );
            if (
              activeThreadId === confirmDelete.threadId &&
              threads.length > 1
            ) {
              const next = threads.find((t) => t.id !== confirmDelete.threadId);
              setActiveThreadId(next?.id || "");
            }
            setConfirmDelete({ open: false, threadId: null });
          }}
          onCancel={() => setConfirmDelete({ open: false, threadId: null })}
        />

        <main className="flex-1 min-w-0 h-full min-h-0 flex flex-col overflow-hidden">
          {activeThread ? (
            <React.Fragment>
              <div className="flex items-center gap-3 px-4 sm:px-6 md:px-8 py-3 md:py-4 border-b bg-white shrink-0">
                {activeThread.participant?.avatarUrl ? (
                  <img
                    src={activeThread.participant.avatarUrl}
                    alt={activeThread.participant.firstName || "User"}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg border">
                    {activeThread.participant?.firstName?.[0] || "U"}
                  </div>
                )}
                <div className="font-semibold">
                  {activeThread.participant?.firstName}{" "}
                  {activeThread.participant?.lastName}
                </div>
                <button
                  className="ml-auto bg-primary hover:bg-[#d14d2a] text-white px-4 py-2 rounded-full font-semibold transition-colors flex items-center gap-2"
                  onClick={() => setShowReportModal(true)}
                  type="button"
                  title="Report"
                >
                  <FaFlag className="text-lg" />
                  Report
                </button>
                <ReportModal
                  show={showReportModal}
                  onClose={() => setShowReportModal(false)}
                  onSubmit={handleReportSubmit}
                  reportText={reportText}
                  setReportText={setReportText}
                  reportSent={reportSent}
                />
              </div>

              <div
                className="flex-1 min-h-0 w-full overflow-y-auto hide-scrollbar px-4 sm:px-6 md:px-8 py-2 flex flex-col gap-2 min-w-0"
                ref={chatContainerRef}
                onScroll={handleChatScroll}
              >
                {loadingMessages ? (
                  <div className="text-center text-gray-400">Loading...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-400">No messages</div>
                ) : (
                  messages.map((msg, idx) => {
                    const showDate =
                      idx === 0 ||
                      !dayjs(msg.createdAt).isSame(
                        messages[idx - 1].createdAt,
                        "day"
                      );
                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div className="text-center text-xs text-gray-400 my-2">
                            {dayjs(msg.createdAt).format("MMM D, YYYY")}
                          </div>
                        )}
                        <div
                          className={`shrink-0 max-w-[70%] px-4 py-2 rounded-lg text-sm flex flex-col gap-2 break-words whitespace-pre-wrap overflow-hidden ${
                            msg.sender === "me"
                              ? "bg-black text-white self-end"
                              : "bg-gray-100 text-gray-800 self-start"
                          }`}
                        >
                          {msg.body && <span>{msg.body}</span>}
                          {msg.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              alt={msg.imageName || "uploaded"}
                              className="rounded max-w-full md:max-w-[200px] h-auto max-h-[200px] border mt-1"
                            />
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
              </div>

              <MessageInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                handleEmojiClick={handleEmojiClick}
                handleImageChange={handleImageChange}
                imageFile={imageFile}
                imagePreview={imagePreview}
                handleRemoveImage={handleRemoveImage}
              />
            </React.Fragment>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a chat
            </div>
          )}
        </main>
      </div>
    </>
  );
}
