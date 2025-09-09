import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaMap, FaPlus } from "react-icons/fa";
import ItemCard from "../components/items/ItemCard"; // Reusable
import axios from "axios";
// import { useAuth } from '../context/AuthContext';
// const { currentUser } = useAuth();

const mockItems = [
  {
    id: 1,
    title: "Lost Wallet",
    status: "Lost",
    location: "Central Park",
    date: "2025-08-10",
    imageUrl: "/wallet.jpg",
    userId: 123,
  },
  {
    id: 2,
    title: "Keys",
    status: "Found",
    location: "Times Square",
    date: "2025-08-08",
    imageUrl: "/keys.jpg",
    userId: 456,
  },
  // More items...
];

export default function ItemsList() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setItems(mockItems); // or fetch with axios.get(...) later
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, sort]);

  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "All" || item.status.toLowerCase() === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sort === "Name") return a.title.localeCompare(b.title);
      if (sort === "Oldest") return new Date(a.date) - new Date(b.date);
      return new Date(b.date) - new Date(a.date); // Newest
    });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [viewMode, setViewMode] = useState("list");

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          List of Lost/Found Items
        </h1>
        <button
          onClick={() => navigate("/items/new")}
          className="flex items-center gap-2 bg-[#7FD96C] hover:bg-[#69c359] text-white font-semibold px-4 py-2 rounded-[16px] transition"
        >
          <FaPlus /> Add New Item
        </button>
      </div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded ${
            viewMode === "list"
              ? "bg-[#7FD96C] text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <FaList className="inline mr-2" /> List View
        </button>
        <button
          onClick={() => setViewMode("map")}
          className={`px-4 py-2 rounded ${
            viewMode === "map"
              ? "bg-[#7FD96C] text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <FaMap className="inline mr-2" /> Map View
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch gap-4 mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[#F3F3F3] px-4 py-2 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#7FD96C]"
        />

        <div className="flex items-center gap-2">
          {["All", "Lost", "Found"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`text-sm px-4 py-2 border rounded-full transition ${
                filter === status
                  ? "bg-[#7FD96C] text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-[#F3F3F3] px-4 py-2 rounded-[16px]"
        >
          <option value="Newest">Sort by: Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="Name">Name</option>
        </select>
      </div>

      {/* Items Grid */}
      {viewMode === "list" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item) => (
              <ItemCard key={item.id} item={item} currentUserId={123} />
            ))
          ) : (
            <p>No items found.</p>
          )}
        </div>
      ) : (
        <div className="h-[500px] w-full border rounded-md flex items-center justify-center text-gray-500 bg-gray-100">
          {/* Placeholder Map View */}
          <p>🗺️ Map View Placeholder (Integrate Google Maps, Leaflet, etc.)</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === idx + 1
                  ? "bg-[#7FD96C] text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
