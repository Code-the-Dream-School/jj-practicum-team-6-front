import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ItemCard({ item, currentUserId }) {
  const navigate = useNavigate();
 const isOwner = item.userId === currentUserId

  const handleEdit = () => {
    navigate(`/items/edit/${item.id}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      alert('Item deleted!');
      // call API to delete
    }
  };

  return (
    <div className="border rounded shadow-sm p-3">
      <div className="mb-2">
        <span
          className={`text-xs px-2 py-1 rounded-full font-semibold ${
            item.status === 'Lost'
              ? 'bg-[#FEE2E2] text-[#E66240]'
              : 'bg-[#D1FAE5] text-[#7FD96C]'
          }`}
        >
          {item.status}
        </span>
      </div>
      <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400 overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <span>No Image</span>
        )}
      </div>
      <h4 className="font-semibold mb-1">{item.title}</h4>
      <p className="text-sm text-gray-600">{item.location}</p>
      <p className="text-sm text-gray-500">{item.date}</p>
 {isOwner && (
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={handleEdit}
          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:underline text-sm flex items-center gap-1"
        >
          <FaTrash /> Delete
        </button>
      </div>
 )}
    </div>
  );
}
