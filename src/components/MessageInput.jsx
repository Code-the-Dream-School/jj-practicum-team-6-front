import React, { useEffect, useRef } from "react";
import { FaRegSmile, FaRegImage } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

export default function MessageInput({
  value,
  setValue,
  onSend,
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick,
  onPickImage,
  filePreview,
  clearImage,
  disabled,
}) {
  const fileRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!showEmojiPicker) return;

    function handleGlobalClick(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleGlobalClick);
    document.addEventListener("touchstart", handleGlobalClick);
    return () => {
      document.removeEventListener("mousedown", handleGlobalClick);
      document.removeEventListener("touchstart", handleGlobalClick);
    };
  }, [showEmojiPicker, setShowEmojiPicker]);

  return (
    <form onSubmit={onSend} className="px-4 sm:px-6 md:px-8 py-3  bg-transparent">
      <div className="flex items-center gap-2">
        {/* message input */}
        <input
          className="flex-1 min-w-0 rounded-full border-gray-100 px-4 py-2 bg-white"
          placeholder="Type a message…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
        />

        {/* tiny attachment thumbnail (inline, right of the input) */}
        {filePreview && (
          <div className="relative h-10 w-10 flex-shrink-0">
            <img
              src={filePreview}
              alt="attachment preview"
              className="h-10 w-10 rounded-lg object-cover border"
            />
            <button
              type="button"
              aria-label="Remove attachment"
              onClick={clearImage}
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-black text-white grid place-items-center shadow"
              title="Remove"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path d="M18.3 5.7a1 1 0 0 0-1.4-1.4L12 9.17 7.1 4.3A1 1 0 1 0 5.7 5.7L10.6 10.6 5.7 15.5a1 1 0 1 0 1.4 1.4L12 12l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 10.6 18.3 5.7Z"/>
              </svg>
            </button>
          </div>
        )}

        {/* emoji */}
        <div className="relative">
          <button
            type="button"
            className="text-gray-500 text-2xl flex items-center h-12 w-12 justify-center"
            onClick={() => setShowEmojiPicker((v) => !v)}
            aria-label="Add emoji"
            disabled={disabled}
            style={{ minWidth: 48, minHeight: 48 }}
          >
            <FaRegSmile />
          </button>
          {showEmojiPicker && (
            <div ref={pickerRef} className="absolute bottom-12 right-0 z-10">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        {/* image picker */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPickImage}
        />
        <button
          type="button"
          className="text-gray-500 text-2xl flex items-center h-12 w-12 justify-center"
          onClick={() => fileRef.current?.click()}
          aria-label="Attach image"
          disabled={disabled}
          style={{ minWidth: 48, minHeight: 48 }}
          title="Attach image"
        >
          <FaRegImage />
        </button>

        {/* send */}
        <button
          type="submit"
          className={`px-4 py-2 rounded-full text-white ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-black"}`}
          disabled={disabled}
        >
          Send
        </button>
      </div>
    </form>
  );
}
