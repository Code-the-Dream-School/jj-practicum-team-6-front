import { useEffect, useState, useContext, useRef } from "react";
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
import { FaFilter } from "react-icons/fa";
import LocationMap from "../components/LocationMap";
import ConfirmModal from "../components/ConfirmModal";
import itemsService from "../services/itemsService";
import categoriesList from "../util/categories";
import categoriesApi from "../services/categoriesService";
import CategoryDropdown from "../components/ui/CategoryDropdown";
import { AuthContext } from "../contexts/AuthContext";

export default function ItemsList() {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  const [totalCount, setTotalCount] = useState(0);
  const [useMyLocation, setUseMyLocation] = useState(false);
  const [radius, setRadius] = useState(10);
  const [zip, setZip] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterMenuRef = useRef(null);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    item: null,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);

  const itemsPerPage = 8;
  const [useMyLocationDraft, setUseMyLocationDraft] = useState(useMyLocation);
  const [radiusDraft, setRadiusDraft] = useState(radius);
  const [zipDraft, setZipDraft] = useState(zip);
  const [zipCenterDraft, setZipCenterDraft] = useState(null);
  const [categories, setCategories] = useState(categoriesList);
  const [zipCenter, setZipCenter] = useState(null);

  const applyGeoFilters = () => {
    setUseMyLocation(useMyLocationDraft);
    setRadius(radiusDraft);
    setZip(zipDraft.trim());
    setCurrentPage(1);
    setRefreshTick((t) => t + 1);
  };

  const resetGeoDrafts = () => {
    setUseMyLocationDraft(false);
    setRadiusDraft(10);
    setZipDraft("");
  };

  const { currentUser } = useContext(AuthContext);
  const currentUserId = currentUser?.id || currentUser?.userId || null;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, sort, category]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await categoriesApi.getCategories();
        if (!mounted) return;
        const names = (list || [])
          .map((c) => c.name)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        if (names.length) setCategories(names);
      } catch (e) {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Geocode applied ZIP to precise center for filtering
  useEffect(() => {
    const zip5 = String(zip || "")
      .replace(/\D/g, "")
      .slice(0, 5);
    if (!zip5 || zip5.length < 5) {
      setZipCenter(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${zip5}`);
        if (!res.ok) throw new Error("ZIP not found");
        const data = await res.json();
        const place = Array.isArray(data.places) && data.places[0];
        const lat = place ? parseFloat(place.latitude) : NaN;
        const lng = place ? parseFloat(place.longitude) : NaN;
        if (!cancelled && Number.isFinite(lat) && Number.isFinite(lng)) {
          setZipCenter([lat, lng]);
        } else if (!cancelled) {
          setZipCenter(null);
        }
      } catch (_) {
        if (!cancelled) setZipCenter(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [zip]);

  const haversineMiles = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "lastItemUpdated") {
        setRefreshTick((t) => t + 1);
      }
    }
    function onCustom() {
      setSort((s) => s);
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
      if (x === "LOST" || x === "FOUND" || x === "RESOLVED") return x;
      if (s === "Lost") return "LOST";
      if (s === "Found") return "FOUND";
      return undefined;
    };
    const useZipIntent = Boolean(zip && Number.isFinite(radius) && radius > 0);
    const params = {
      q: search || undefined,
      page: useZipIntent ? 1 : currentPage,
      limit: useZipIntent ? 1000 : itemsPerPage,
      lat:
        useMyLocation && Number.isFinite(coords.lat) ? coords.lat : undefined,
      lng:
        useMyLocation && Number.isFinite(coords.lng) ? coords.lng : undefined,
      radius: useMyLocation ? radius : undefined,
      is_resolved: filter === "Resolved" ? true : false,
    };
    if (filter === "Lost" || filter === "Found") {
      params.status = toEnum(filter);
    }
    if (category) params.category = category;
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
          lat: (() => {
            const v = it.latitude;
            if (typeof v === "number") return v;
            const n = parseFloat(v);
            return Number.isFinite(n) ? n : undefined;
          })(),
          lng: (() => {
            const v = it.longitude;
            if (typeof v === "number") return v;
            const n = parseFloat(v);
            return Number.isFinite(n) ? n : undefined;
          })(),
          seenCount:
            typeof it.seenCount === "number"
              ? it.seenCount
              : typeof it.seen === "number"
                ? it.seen
                : 0,
          category:
            typeof it.category === "object" && it.category?.name
              ? it.category.name
              : it.categoryName || it.category || "",
          zipCode: it.zipCode || it.zip || "",
        }));
        const categoryFiltered = category
          ? normalized.filter(
              (i) => (i.category || "").toLowerCase() === category.toLowerCase()
            )
          : normalized;
        const zipFiltered = zip
          ? (() => {
              const base = String(zip).replace(/\D/g, "").slice(0, 5);
              if (!base) return categoryFiltered;
              if (
                Array.isArray(zipCenter) &&
                zipCenter.length === 2 &&
                Number.isFinite(radius) &&
                radius > 0
              ) {
                const [zcLat, zcLng] = zipCenter;
                return categoryFiltered.filter((i) => {
                  const hasCoords =
                    Number.isFinite(i.lat) && Number.isFinite(i.lng);
                  if (hasCoords) {
                    const d = haversineMiles(zcLat, zcLng, i.lat, i.lng);
                    return d <= radius + 1e-9;
                  }
                  const itemZip = String(i.zipCode || "")
                    .replace(/\D/g, "")
                    .slice(0, 5);
                  const loc = String(i.location || "");
                  return (
                    (itemZip && itemZip === base) ||
                    (base && loc.includes(base))
                  );
                });
              }
              return categoryFiltered;
            })()
          : categoryFiltered;
        let sorted = [...zipFiltered];
        if (sort === "Name")
          sorted.sort((a, b) => a.title.localeCompare(b.title));
        if (sort === "Oldest")
          sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (sort === "Newest")
          sorted.sort((a, b) => new Date(b.date) - new Date(a.date));

        setAllItems(sorted);
        setFilteredItems(sorted);
        const computedTotal =
          category || zip ? sorted.length : meta.total || sorted.length || 0;
        setTotalCount(computedTotal);
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
  }, [
    search,
    filter,
    sort,
    category,
    currentPage,
    refreshTick,
    useMyLocation,
    radius,
    zip,
    zipCenter,
    coords.lat,
    coords.lng,
  ]);
  useEffect(() => {
    if (useMyLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setUseMyLocation(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [useMyLocation]);

  useEffect(() => {
    if (useMyLocationDraft && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [useMyLocationDraft]);

  useEffect(() => {
    const zip5 = String(zipDraft || "")
      .replace(/\D/g, "")
      .slice(0, 5);
    if (!zip5 || zip5.length < 5) {
      setZipCenterDraft(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${zip5}`);
        if (!res.ok) throw new Error("ZIP not found");
        const data = await res.json();
        const place = Array.isArray(data.places) && data.places[0];
        const lat = place ? parseFloat(place.latitude) : NaN;
        const lng = place ? parseFloat(place.longitude) : NaN;
        if (!cancelled && Number.isFinite(lat) && Number.isFinite(lng)) {
          setZipCenterDraft([lat, lng]);
        } else if (!cancelled) {
          setZipCenterDraft(null);
        }
      } catch (_) {
        if (!cancelled) setZipCenterDraft(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [zipDraft]);

  useEffect(() => {
    function onDocClick(e) {
      if (!isFilterOpen) return;
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isFilterOpen]);

  const handleEdit = (item) => {
    navigate(`/items/edit/${item.id}`, { state: { item } });
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
        <div className="flex flex-col items-center text-center mb-6 gap-4">
          <h1 className="font-display text-5xl font-bold text-ink">Items</h1>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-3 mb-6">
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
        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Search Input */}
          <div className="w-full max-w-2xl">
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
            <div
              className="relative inline-block ml-2"
              ref={filterMenuRef}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsFilterOpen(false);
              }}
            >
              <button
                type="button"
                onClick={() => setIsFilterOpen((v) => !v)}
                className="inline-flex items-center gap-2 text-sm text-gray600 hover:text-ink"
                aria-haspopup="menu"
                aria-expanded={isFilterOpen}
              >
                <FaFilter className="text-gray-500" />
                <span>Filter</span>
              </button>
              {isFilterOpen && (
                <div
                  role="menu"
                  className="absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50 p-2"
                >
                  {[
                    { value: "Newest", label: "Newest" },
                    { value: "Oldest", label: "Oldest" },
                    { value: "Name", label: "Name (A→Z)" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      role="menuitem"
                      onClick={() => {
                        setSort(opt.value);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sort === opt.value ? "bg-gray-50 text-ink" : "hover:bg-gray-50 text-gray-700"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-3">
            <CategoryDropdown
              value={category || ""}
              options={categories}
              placeholder="All categories"
              allOption={{ label: "All categories", value: "" }}
              onChange={(val) => setCategory(val)}
              widthClass="min-w-[240px]"
              buttonClassName="px-4 py-2 rounded-full border border-gray-300 bg-white"
              menuClassName=""
            />
            {/* Geo filters */}
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={useMyLocationDraft}
                onChange={(e) => setUseMyLocationDraft(e.target.checked)}
              />
              Use my location
            </label>
            {/* ZIP input */}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              placeholder="e.g. 06611"
              value={zipDraft}
              onChange={(e) =>
                setZipDraft(e.target.value.replace(/[^0-9-]/g, ""))
              }
              disabled={useMyLocationDraft}
              className={`bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary ${
                useMyLocationDraft ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="ZIP code"
            />
            {/* Radius slider */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Radius</span>
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={radiusDraft}
                onChange={(e) => setRadiusDraft(Number(e.target.value))}
                className="accent-primary"
                aria-label="Radius (miles)"
                disabled={!(useMyLocationDraft || zipDraft)}
              />
              <span className="text-sm text-gray-600 w-10 text-right">
                {radiusDraft} mi
              </span>
            </div>
            {/* Reset/Apply */}
            <button
              type="button"
              onClick={resetGeoDrafts}
              className="px-4 py-2 rounded-full bg-white border border-gray-300 text-sm font-medium hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={applyGeoFilters}
              className="px-5 py-2 rounded-full bg-ink text-white text-sm font-medium hover:opacity-90"
            >
              Apply
            </button>
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
                            : item.status === "Found"
                              ? "bg-success text-white"
                              : "bg-black text-white"
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
                          navigate(`/items/${item.id}`, { state: { item } });
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
                          <img
                            src="/placeholder.svg"
                            alt="No image available"
                            className="w-full h-full object-cover rounded-xl opacity-80"
                            loading="lazy"
                          />
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
                          navigate(`/items/${item.id}`, { state: { item } });
                        }}
                        className="text-sm text-ink inline-flex items-center gap-1"
                        aria-label="Open item details"
                      >
                        More <span aria-hidden>→</span>
                      </button>
                      <div className="flex items-center gap-4 text-sm text-gray-700">
                        <span className="inline-flex items-center gap-1">
                          <FaRegComment className="text-gray-500" />
                          {(() => {
                            const cnt =
                              typeof item.commentsCount === "number"
                                ? item.commentsCount
                                : Array.isArray(item.comments)
                                  ? item.comments.length
                                  : 0;
                            return cnt;
                          })()}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FaRegEye className="text-gray-500" />
                          {typeof item.seenCount === "number"
                            ? item.seenCount
                            : 0}
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
            {(() => {})()}
            <LocationMap
              mode="display"
              items={filteredItems}
              center={
                useMyLocationDraft &&
                Number.isFinite(coords.lat) &&
                Number.isFinite(coords.lng)
                  ? [coords.lat, coords.lng]
                  : Array.isArray(zipCenterDraft)
                    ? zipCenterDraft
                    : Array.isArray(zipCenter)
                      ? zipCenter
                      : useMyLocation &&
                          Number.isFinite(coords.lat) &&
                          Number.isFinite(coords.lng)
                        ? [coords.lat, coords.lng]
                        : undefined
              }
              radiusMiles={
                useMyLocationDraft || zipDraft
                  ? radiusDraft
                  : useMyLocation
                    ? radius
                    : zip
                      ? radius
                      : undefined
              }
              showCenterMarker={Boolean(
                (useMyLocationDraft &&
                  Number.isFinite(coords.lat) &&
                  Number.isFinite(coords.lng)) ||
                  Array.isArray(zipCenterDraft) ||
                  Array.isArray(zipCenter) ||
                  useMyLocation
              )}
            />
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
