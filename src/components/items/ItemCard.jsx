import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FaEdit, FaTrash, FaRegComment, FaRegEye } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

export default function ItemCard({
  item,
  currentUserId,
  onDelete,
  clickable = true,
  readOnly = false,
  imageLoading = "eager",
}) {
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);
  const effectiveUserId =
    currentUserId || currentUser?.id || currentUser?.userId || null;
  const isOwner =
    effectiveUserId && Number(item.userId) === Number(effectiveUserId);

  const handleEdit = () => {
    navigate(`/items/edit/${item.id}`);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(item);
  };

  const goToItem = () => navigate(`/items/${item.id}`);

  const Wrapper = ({ children }) => {
    if (!clickable) return <div>{children}</div>;
    return (
      <div
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={goToItem}
        onKeyDown={(e) => {
          if (e.key === "Enter") goToItem();
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <Wrapper>
      <div className="border rounded shadow-sm p-3">
        <div className="mb-2">
          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold ${
              item.status === "Lost"
                ? "bg-red-50 text-primary"
                : "bg-green-50 text-success"
            }`}
          >
            {item.status}
          </span>
        </div>
        <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400 overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              loading={imageLoading}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>No Image</span>
          )}
        </div>
        <h4 className="font-semibold mb-1">{item.title}</h4>
        <p className="text-sm text-gray-600">{item.location}</p>
        <p className="text-sm text-gray-500">{item.date}</p>
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToItem();
            }}
            className="text-sm text-ink hover:underline inline-flex items-center gap-1"
            aria-label="Open item details"
          >
            More <span aria-hidden>→</span>
          </button>
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <span className="inline-flex items-center gap-1">
              <FaRegComment className="text-gray-500" />
              {typeof item.commentsCount === "number"
                ? item.commentsCount
                : Array.isArray(item.comments)
                  ? item.comments.length
                  : 0}
            </span>
            <span className="inline-flex items-center gap-1">
              <FaRegEye className="text-gray-500" />
              {typeof item.seen === "number" ? item.seen : 0}
              <span className="ml-1 hidden sm:inline">Seen it</span>
            </span>
          </div>
        </div>
        {!readOnly && isOwner && (
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="text-red-600 hover:underline text-sm flex items-center gap-1"
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
