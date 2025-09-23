import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaList,
  FaMap,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaRegComment,
  FaRegEye,
} from "react-icons/fa";
import LocationMap from "../components/LocationMap";
import ConfirmModal from "../components/ConfirmModal";
import itemsService from "../services/itemsService";
import { AuthContext } from "../contexts/AuthContext";

export default function ItemsList() {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  const [totalCount, setTotalCount] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    item: null,
  });
  const [errorMsg, setErrorMsg] = useState("");

  const itemsPerPage = 8;

  const { currentUser } = useContext(AuthContext);
  const currentUserId = currentUser?.id || currentUser?.userId || null;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, sort]);

  useEffect(() => {
    let mounted = true;
    const toEnum = (s) => {
      const x = (s || "").toString().toUpperCase();
      if (x === "LOST" || x === "FOUND" || x === "RESOLVED") return x;
      if (s === "Lost") return "LOST";
      if (s === "Found") return "FOUND";
      return undefined;
    };
    const params = {
      q: search || undefined,
      status: filter !== "All" ? toEnum(filter) : undefined,
      is_resolved: false,
      page: currentPage,
      limit: itemsPerPage,
    };
    itemsService
      .getItems(params)
      .then(({ items = [], meta = {} } = {}) => {
        if (!mounted) return;
        const toStatusText = (s) => {
          const x = (s || "").toString().toUpperCase();
          if (x === "LOST") return "Lost";
          if (x === "FOUND") return "Found";
          if (x === "RESOLVED") return "Resolved";
          return s || "Lost";
        };
        const normalized = (items || []).map((it) => ({
          ...it,
          status: toStatusText(it.status),
          imageUrl:
            it.primaryPhotoUrl ||
            (Array.isArray(it.photos) && it.photos.length
              ? it.photos[0].url
              : ""),
          location: it.zipCode || it.location || "",
          date: it.dateReported
            ? new Date(it.dateReported).toLocaleDateString()
            : it.createdAt
              ? new Date(it.createdAt).toLocaleDateString()
              : it.date || "",
          userId: it.ownerId ?? it.userId,
          lat: typeof it.latitude === "number" ? it.latitude : undefined,
          lng: typeof it.longitude === "number" ? it.longitude : undefined,
        }));
        let sorted = [...normalized];
        if (sort === "Name")
          sorted.sort((a, b) => a.title.localeCompare(b.title));
        if (sort === "Oldest")
          sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (sort === "Newest")
          sorted.sort((a, b) => new Date(b.date) - new Date(a.date));

        setAllItems(sorted);
        setFilteredItems(sorted);
        setTotalCount(meta.total || sorted.length || 0);
      })
      .catch((err) => {
        console.warn("Failed to load items", err);
        if (!mounted) return;
        setAllItems([]);
        setFilteredItems([]);
        setTotalCount(0);
      });
    return () => {
      mounted = false;
    };
  }, [search, filter, sort, currentPage]);

  const handleEdit = (item) => {
    navigate(`/items/edit/${item.id}`);
  };

  const handleDelete = async (item) => {
    const prev = allItems;
    setErrorMsg("");
    setAllItems((prevList) => prevList.filter((i) => i.id !== item.id));
    try {
      await itemsService.deleteItem(item.id);
    } catch (err) {
      console.error("Failed to delete item", err);
      setAllItems(prev);
      const msg =
        err?.message || err?.error?.message || "Failed to delete item";
      setErrorMsg(msg);
    }
  };

  const totalPages = Math.ceil((totalCount || 0) / itemsPerPage) || 1;
  const paginatedItems = filteredItems;
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
            <button style={{ display: "none" }} />
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
            {/* Inline error banner */}
            {errorMsg && (
              <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 border border-red-200">
                {errorMsg}
              </div>
            )}
            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                    onClick={() => navigate(`/items/${item.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigate(`/items/${item.id}`);
                    }}
                  >
                    {/* Status Badge */}
                    <div className="mb-4">
                      <span
                        className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                          item.status === "Lost"
                            ? "bg-primary text-white"
                            : "bg-success text-white"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Image Placeholder */}
                    <div className="w-full h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/items/${item.id}`);
                        }}
                        className="w-full h-full p-0 m-0 text-left rounded-xl overflow-hidden"
                        aria-label={`Open ${item.title}`}
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="text-4xl w-full h-full flex items-center justify-center">
                            {item.status === "Lost" ? "📱" : "🎒"}
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Item Details */}
                    <div className="space-y-2">
                      <h3 className="font-display text-lg font-semibold text-ink leading-tight">
                        {item.title}
                      </h3>
                      <p className="font-body text-sm text-gray600 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{item.location}</span>
                      </p>
                      <p className="font-body text-sm text-gray-500 flex items-center gap-2">
                        <FaRegCalendarAlt className="text-gray-400" />
                        <span>{item.date}</span>
                      </p>
                    </div>

                    {/* Meta row: More, comments count, Seen it */}
                    <div className="flex items-center justify-between mt-3 px-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/items/${item.id}`);
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

                    {currentUserId &&
                      Number(item.userId) === Number(currentUserId) && (
                        <div className="flex justify-end items-center mt-4 pt-4 border-t border-gray-100">
                          <div className="flex gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(item);
                              }}
                              className="text-blue-600 hover:text-blue-700 transition-colors"
                              title="Edit item"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete({ open: true, item });
                              }}
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
      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={confirmDelete.open}
        text={
          confirmDelete.item
            ? `Delete "${confirmDelete.item.title}"?`
            : "Are you sure?"
        }
        onConfirm={() => {
          if (confirmDelete.item) handleDelete(confirmDelete.item);
          setConfirmDelete({ open: false, item: null });
        }}
        onCancel={() => setConfirmDelete({ open: false, item: null })}
      />
    </div>
  );
}
