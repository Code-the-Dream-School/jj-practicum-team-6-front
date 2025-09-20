import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaMap, FaEdit, FaTrash } from "react-icons/fa";
import LocationMap from "../components/LocationMap";
import { mockItems, filterItems } from "../util/itemsData";

export default function ItemsList() {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState(mockItems);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");

  const itemsPerPage = 8;
  const currentUserId = 123;

  // Apply filters whenever search, filter, or sort changes
  useEffect(() => {
    const filtered = filterItems(allItems, { search, status: filter, sort });
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [allItems, search, filter, sort]);

  const handleEdit = (item) => {
    navigate(`/items/edit/${item.id}`);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      setAllItems((prev) => prev.filter((i) => i.id !== item.id));
      alert("Item deleted!");
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="font-display text-4xl font-bold text-ink">
            List of Lost/Found Items
          </h1>
        </div>

        {/* View Toggle */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setViewMode("list")}
            className={`px-6 py-3 rounded-full flex items-center gap-2 font-medium text-sm transition-all duration-200 ${
              viewMode === "list"
                ? "bg-ink text-white shadow-md"
                : "bg-gray-100 text-gray600 hover:bg-gray-200"
            }`}
          >
            <FaList size={16} />
            List of Items
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-6 py-3 rounded-full flex items-center gap-2 font-medium text-sm transition-all duration-200 ${
              viewMode === "map"
                ? "bg-ink text-white shadow-md"
                : "bg-gray-100 text-gray600 hover:bg-gray-200"
            }`}
          >
            <FaMap size={16} />
            Map View
          </button>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center">
          {/* Search Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, description or zipcode"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-primary font-body text-ink placeholder:text-gray-400"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("All")}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                filter === "All"
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-gray600 border-gray-300 hover:border-gray-400"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Lost")}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                filter === "Lost"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray600 border-gray-300 hover:border-gray-400"
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => setFilter("Found")}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                filter === "Found"
                  ? "bg-success text-white border-success"
                  : "bg-white text-gray600 border-gray-300 hover:border-gray-400"
              }`}
            >
              Found
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative self-stretch flex items-center">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-sm font-medium text-gray600 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="Newest">Sort by: Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Name">Name</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <>
            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                  >
                    {/* Status Badge */}
                    <div className="mb-4">
                      <span
                        className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                          item.status === "Lost"
                            ? "bg-red-50 text-primary border border-red-100"
                            : "bg-green-50 text-success border border-green-100"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Image Placeholder */}
                    <div className="w-full h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="text-4xl">
                          {item.status === "Lost" ? "📱" : "🎒"}
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="space-y-2">
                      <h3 className="font-display text-lg font-semibold text-ink leading-tight">
                        {item.title}
                      </h3>
                      <p className="font-body text-sm text-gray600 flex items-center gap-1">
                        <span>📍</span>
                        {item.location}
                      </p>
                      <p className="font-body text-sm text-gray-500 flex items-center gap-1">
                        <span>📅</span>
                        {item.date}
                      </p>
                    </div>

                    {item.userId === currentUserId && (
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <button className="font-body text-sm text-gray600 hover:text-ink transition-colors">
                          More →
                        </button>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                            title="Edit item"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Delete item"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="font-body text-gray600">No items found.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === idx + 1
                        ? "bg-ink text-white shadow-sm"
                        : "bg-white text-gray600 border border-gray-300 hover:bg-gray-50"
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
                  className="px-4 py-2 text-sm font-medium text-gray600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          /* Map View */
          <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
            <LocationMap mode="display" items={filteredItems} />
          </div>
        )}
      </div>
    </div>
  );
}
