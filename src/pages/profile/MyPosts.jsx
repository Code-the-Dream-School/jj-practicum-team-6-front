import { useEffect, useState } from "react";
import { FaList, FaMap } from "react-icons/fa";
import LocationMap from "../../components/LocationMap";
import itemsService from "../../services/itemsService";
import ConfirmModal from "../../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import MyPostCard from "../../components/profile/MyPostCard";

export default function MyPosts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [viewMode, setViewMode] = useState("list");
  const [allMyItems, setAllMyItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    item: null,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [search, filter, sort]);

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "lastItemUpdated") {
        setRefreshTick((t) => t + 1);
      }
    }
    function onCustom() {
      setRefreshTick((t) => t + 1);
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("item-updated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("item-updated", onCustom);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const toEnum = (s) => {
      const x = (s || "").toString().toUpperCase();
      if (["LOST", "FOUND", "RESOLVED"].includes(x)) return x;
      if (s === "Lost") return "LOST";
      if (s === "Found") return "FOUND";
      return undefined;
    };
    const params = {
      q: search || undefined,
      page: 1,
      limit: 50,
    };
    if (filter === "Resolved") {
      params.is_resolved = true;
    } else if (filter === "Lost" || filter === "Found") {
      params.status = toEnum(filter);
      params.is_resolved = false;
    }
    itemsService
      .getSelfItems(params)
      .then(({ items = [] } = {}) => {
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
          status: it.isResolved ? "Resolved" : toStatusText(it.status),
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
        setAllMyItems(sorted);
        const filteredByStatus =
          filter === "All" ? sorted : sorted.filter((i) => i.status === filter);
        const start = (page - 1) * perPage;
        const end = start + perPage;
        setMyItems(filteredByStatus.slice(start, end));
        setTotal(filteredByStatus.length);
      })
      .catch(() => {
        if (!mounted) return;
        setMyItems([]);
        setTotal(0);
      });
    return () => {
      mounted = false;
    };
  }, [search, filter, sort, page, refreshTick]);

  useEffect(() => {
    const filteredByStatus =
      filter === "All"
        ? allMyItems
        : allMyItems.filter((i) => i.status === filter);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    setMyItems(filteredByStatus.slice(start, end));
    setTotal(filteredByStatus.length);
  }, [allMyItems, filter, sort, page]);

  const handleEdit = (item) => navigate(`/items/edit/${item.id}`);
  const handleResolve = async (item) => {
    setErrorMsg("");
    const prevAll = allMyItems;
    const prevPage = myItems;
    setAllMyItems((list) =>
      list.map((i) =>
        i.id === item.id
          ? {
              ...i,
              isResolved: !i.isResolved,
              status: !i.isResolved
                ? "Resolved"
                : i.baseStatus || i.status === "Resolved"
                  ? "Lost"
                  : i.status,
            }
          : i
      )
    );
    setMyItems((list) =>
      list.map((i) =>
        i.id === item.id
          ? {
              ...i,
              isResolved: !i.isResolved,
              status: !i.isResolved
                ? "Resolved"
                : i.baseStatus || i.status === "Resolved"
                  ? "Lost"
                  : i.status,
            }
          : i
      )
    );
    try {
      await itemsService.updateItem(item.id, { isResolved: !item.isResolved });
      try {
        localStorage.setItem(
          "lastItemUpdated",
          JSON.stringify({
            id: item.id,
            at: Date.now(),
            isResolved: !item.isResolved,
          })
        );
      } catch {}
      try {
        window.dispatchEvent(
          new CustomEvent("item-updated", {
            detail: { id: item.id, isResolved: !item.isResolved },
          })
        );
      } catch {}
    } catch (err) {
      setAllMyItems(prevAll);
      setMyItems(prevPage);
      const msg =
        err?.message || err?.error?.message || "Failed to update item";
      setErrorMsg(msg);
    }
  };
  const handleDelete = async (item) => {
    const prev = myItems;
    setErrorMsg("");
    setMyItems((list) => list.filter((i) => i.id !== item.id));
    try {
      await itemsService.deleteItem(item.id);
      setTotal((t) => Math.max((t || 1) - 1, 0));
    } catch (err) {
      console.error("Failed to delete item", err);
      setMyItems(prev);
      const msg =
        err?.message || err?.error?.message || "Failed to delete item";
      setErrorMsg(msg);
    }
  };

  const IconCheck = (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      {...props}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
  const IconEdit = (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      {...props}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
  const IconTrash = (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      {...props}
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
  const IconChat = (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      {...props}
    >
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
    </svg>
  );
  const IconEye = (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      {...props}
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  return (
    <div>
      <h3 className="font-display text-3xl font-bold text-ink text-center mb-8">
        My Posts
      </h3>
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center w-full max-w-4xl mx-auto">
        <div className="flex flex-1 w-full">
          <input
            type="text"
            placeholder="Search by name, description or zipcode"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 px-4 py-3 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-primary font-body text-ink placeholder:text-gray-400 max-w-xl"
          />
        </div>
        <div className="flex gap-2 items-center mt-2 md:mt-0">
          <button
            onClick={() => setViewMode("list")}
            className={`px-6 py-3 rounded-full flex items-center gap-2 font-medium text-sm transition-all duration-200 ${
              viewMode === "list"
                ? "bg-ink text-white shadow-md"
                : "bg-gray-100 text-gray600 hover:bg-gray-200"
            }`}
          >
            <FaList size={16} /> List of items
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-6 py-3 rounded-full flex items-center gap-2 font-medium text-sm transition-all duration-200 ${
              viewMode === "map"
                ? "bg-ink text-white shadow-md"
                : "bg-gray-100 text-gray600 hover:bg-gray-200"
            }`}
          >
            <FaMap size={16} /> Map view
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-8 justify-center flex-wrap">
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
        <button
          onClick={() => setFilter("Resolved")}
          className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
            filter === "Resolved"
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray600 border-gray-300 hover:border-gray-400"
          }`}
        >
          Resolved
        </button>
        <div className="relative self-stretch flex items-center ml-2">
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
      {viewMode === "list" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {errorMsg && (
            <div className="col-span-full mb-2 rounded-lg bg-red-50 text-red-700 px-4 py-3 border border-red-200">
              {errorMsg}
            </div>
          )}
          {myItems && myItems.length > 0 ? (
            myItems.map((item) => (
              <MyPostCard
                key={item.id}
                item={item}
                onOpen={() => navigate(`/items/${item.id}`)}
                onResolve={() => handleResolve(item)}
                onEdit={() => handleEdit(item)}
                onDelete={() => setConfirmDelete({ open: true, item })}
              />
            ))
          ) : (
            <p className="text-gray-400 font-body text-center w-full col-span-full">
              No posts yet.
            </p>
          )}
        </div>
      ) : (
        <div className="w-full h-[350px] mb-12">
          <LocationMap
            mode="display"
            items={(myItems || []).map((post) => ({
              ...post,
              lat: typeof post.lat === "number" ? post.lat : undefined,
              lng: typeof post.lng === "number" ? post.lng : undefined,
            }))}
          />
        </div>
      )}

      {viewMode === "list" && (total || 0) > perPage && (
        <div className="flex justify-center items-center gap-2 mb-10">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          {Array.from(
            { length: Math.ceil((total || 0) / perPage) },
            (_, i) => i + 1
          ).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                page === n
                  ? "bg-ink text-white shadow-sm"
                  : "bg-white text-gray600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil((total || 0) / perPage)}
            className="px-4 py-2 text-sm font-medium text-gray600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
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
