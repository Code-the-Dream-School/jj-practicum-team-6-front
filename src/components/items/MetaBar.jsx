import { FaEdit, FaTrash, FaRegEye, FaRegComment } from "react-icons/fa";

export default function MetaBar({
  isOwner,
  commentsCountDisplay,
  seenCount,
  iHaveSeen,
  toggleSeen,
  onEdit,
  onDelete,
  renderCounts = true,
  renderActions = true,
  className = "",
}) {
  const Counts = () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <FaRegComment className="text-gray-400" />
        <span>{commentsCountDisplay}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={!isOwner ? toggleSeen : undefined}
          className={`inline-flex items-center gap-1 bg-transparent border-0 px-0 py-0 ${!isOwner ? "text-ink hover:underline cursor-pointer" : "text-gray-400 cursor-default pointer-events-none"}`}
          aria-pressed={iHaveSeen}
        >
          <FaRegEye className="inline-block" />
          <span className="sr-only">Seen it</span>
        </button>
        <span className="text-gray-700">{seenCount}</span>
      </div>
    </div>
  );

  const Actions = () =>
    isOwner ? (
      <div className="flex items-center gap-2 ml-2">
        <button
          onClick={onEdit}
          className="h-[42px] w-[42px] inline-flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-ink hover:border-gray-300"
          title="Edit"
          aria-label="Edit item"
          type="button"
        >
          <FaEdit size={16} />
        </button>
        <button
          onClick={onDelete}
          className="h-[42px] w-[42px] inline-flex items-center justify-center rounded-full border border-red-200 text-red-600 hover:border-red-300"
          title="Delete"
          aria-label="Delete item"
          type="button"
        >
          <FaTrash size={16} />
        </button>
      </div>
    ) : null;

  if (renderCounts && renderActions) {
    return (
      <div className={`flex items-center justify-between mb-4 ${className}`}>
        <Counts />
        <Actions />
      </div>
    );
  }

  if (renderCounts) return <Counts />;
  if (renderActions) return <Actions />;
  return null;
}
