import React from "react";
import { FaRegSmile, FaRegImage } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

export default function MessageInput({
  input,
  setInput,
  handleSend,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
  handleImageChange,
  imageFile,
  imagePreview,
  handleRemoveImage,
}) {
  return (
    <>
      {imagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white border rounded p-4 flex flex-col items-center max-w-xs shadow-lg pointer-events-auto">
            <img
              src={imagePreview}
              alt="preview"
              className="max-w-[250px] max-h-[250px] mb-2 rounded"
            />
            <button
              type="button"
              className="text-xs text-red-500"
              onClick={handleRemoveImage}
            >
              Remove
            </button>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-3 md:py-4 border-t bg-white shrink-0"
      >
        <input
          className="flex-1 min-w-0 rounded-full border px-4 py-2"
          placeholder="Hi! I think I may have found the item you posted about. Let's connect"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="relative flex items-center h-full">
          <button
            type="button"
            className="text-gray-400 text-2xl flex items-center h-12 w-12 justify-center"
            onClick={() => setShowEmojiPicker((v) => !v)}
            aria-label="Add emoji"
            style={{ minWidth: 48, minHeight: 48 }}
          >
            <FaRegSmile />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 right-0 z-10 max-w-[90vw] overflow-hidden">
              <div className="max-w-full">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  disableAutoFocus={true}
                />
              </div>
            </div>
          )}
        </div>

        <div className="relative flex items-center h-full">
          <label
            className="text-gray-400 text-2xl flex items-center cursor-pointer h-12 w-12 justify-center"
            style={{ minWidth: 48, minHeight: 48 }}
          >
            <FaRegImage />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </form>
    </>
  );
}
