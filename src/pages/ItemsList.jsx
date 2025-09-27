import { useEffect, useState, useContext, useCallback, useMemo } from "react";
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
import categoriesList from "../util/categories";
import categoriesApi from "../services/categoriesService";
import { AuthContext } from "../contexts/AuthContext";
import ItemsFilterPanel from "../components/items/ItemsFilterPanel";

export default function ItemsList() {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]);
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
    setUseMyLocation(false);
    setRadius(10);
    setZip("");
    setZipCenter(null);
    setCurrentPage(1);
    setRefreshTick((t) => t + 1);
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

  const filterByTab = useCallback((list, tab) => {
    if (!Array.isArray(list)) return [];
    if (!tab || tab === "All") return list;
    const match = tab.toLowerCase();
    return list.filter((item) => (item.status || "").toLowerCase() === match);
  }, []);

  const sortItemsClient = useCallback(
    (list) => {
      if (!Array.isArray(list)) return [];
      const getTime = (item) => {
        const raw = item?.dateValue || item?.date || "";
        const dt = raw ? new Date(raw).getTime() : NaN;
        return Number.isFinite(dt) ? dt : 0;
      };
      if (sort === "Name") {
        return [...list].sort((a, b) => a.title.localeCompare(b.title));
      }
      if (sort === "Oldest") {
        return [...list].sort((a, b) => getTime(a) - getTime(b));
      }
      // Default to Newest
      return [...list].sort((a, b) => getTime(b) - getTime(a));
    },
    [sort]
  );

  useEffect(() => {
    let mounted = true;
    const zip5 = String(zip || "").replace(/\D/g, "").slice(0, 5);
    const trimmedSearch = (search || "").trim();
    const digitSearch = (search || "").replace(/\D/g, "");
    const applyZipFilter = !useMyLocation && digitSearch.length >= 3;
    const applyTextFilter = trimmedSearch.length > 0;
    const params = {
      q: trimmedSearch || undefined,
      page: currentPage,
      limit: itemsPerPage,
    };
    if (category) params.category = category;
    if (filter === "Resolved") params.is_resolved = true;

    const searchDigits = digitSearch.slice(0, 5);
    if (!useMyLocation && !zip && searchDigits.length === 5 && Number.isFinite(Number(searchDigits))) {
      params.zip = searchDigits;
    }

    const hasMyCoords =
      useMyLocation && Number.isFinite(coords.lat) && Number.isFinite(coords.lng);
    if (hasMyCoords) {
      params.lat = coords.lat;
      params.lng = coords.lng;
      if (Number.isFinite(radius) && radius > 0) params.radius = radius;
    } else if (!useMyLocation && zip5.length === 5) {
      params.zip = zip5;
      if (Number.isFinite(radius) && radius > 0) params.radius = radius;
    }
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
        const digitFilter = digitSearch;
        const queryLower = trimmedSearch.toLowerCase();
        const normalized = (items || []).map((it) => {
          const rawDate = it.dateReported || it.createdAt || it.date || "";
          const parsedDate = rawDate ? new Date(rawDate) : null;
          const displayDate = parsedDate && !Number.isNaN(parsedDate)
            ? parsedDate.toLocaleDateString()
            : "";
          const rawZipValue =
            it.zipCode !== undefined && it.zipCode !== null
              ? it.zipCode
              : it.zip;
          const normalizedZip = (() => {
            if (typeof rawZipValue === "number") {
              return rawZipValue.toString().padStart(5, "0");
            }
            if (typeof rawZipValue === "string") {
              return rawZipValue.trim();
            }
            return "";
          })();
          const normalizedLocation = (() => {
            if (it.location && typeof it.location === "string") {
              return it.location;
            }
            return normalizedZip || "";
          })();

          return {
            ...it,
            status: it.isResolved ? "Resolved" : toStatusText(it.status),
            imageUrl:
              it.primaryPhotoUrl ||
              (Array.isArray(it.photos) && it.photos.length
                ? it.photos[0].url
                : ""),
            location: normalizedLocation,
            date: displayDate,
            dateValue: rawDate || null,
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
            zipCode: normalizedZip,
          };
        });
        let searchFiltered = normalized;
        if (applyZipFilter && digitFilter.length >= 3) {
          searchFiltered = (searchFiltered || []).filter((item) => {
            const zipCandidate = String(item.zipCode || "");
            const locationCandidate = String(item.location || "");
            return (
              zipCandidate.includes(digitFilter) ||
              locationCandidate.includes(digitFilter)
            );
          });
        }

        if (applyTextFilter && queryLower) {
          const lowered = queryLower;
          searchFiltered = searchFiltered.filter((item) => {
            const haystacks = [
              String(item.title || ""),
              String(item.description || ""),
              String(item.location || ""),
              String(item.category || ""),
            ].map((txt) => txt.toLowerCase());
            return haystacks.some((txt) => txt.includes(lowered));
          });
        }

        const sorted = sortItemsClient(searchFiltered);
        setAllItems(sorted);
        if (filter === "All") {
          setTotalCount(applyZipFilter || applyTextFilter ? sorted.length : meta.total || sorted.length || 0);
        } else {
          const filteredLength = filterByTab(sorted, filter).length;
          setTotalCount(filteredLength);
        }
      })
      .catch((err) => {
        console.warn("Failed to load items", err);
        if (!mounted) return;
        setAllItems([]);
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
    coords.lat,
    coords.lng,
    filterByTab,
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

  const handleEdit = (item) => {
    navigate(`/items/edit/${item.id}`, { state: { item } });
  };

  const handleDelete = async (item) => {
    const prev = allItems;
    setErrorMsg("");
    setAllItems((prevList) => {
      const nextListSorted = sortItemsClient(
        prevList.filter((i) => i.id !== item.id)
      );
      setTotalCount((count) => Math.max(count - 1, 0));
      return nextListSorted;
    });
    try {
      await itemsService.deleteItem(item.id);
    } catch (err) {
      console.error("Failed to delete item", err);
      setAllItems(prev);
      setTotalCount((count) => count + 1);
      const msg =
        err?.message || err?.error?.message || "Failed to delete item";
      setErrorMsg(msg);
    }
  };

  const visibleItems = useMemo(
    () => filterByTab(allItems, filter),
    [allItems, filter, filterByTab]
  );

  const totalPages = Math.ceil((totalCount || 0) / itemsPerPage) || 1;
  const paginatedItems = visibleItems;
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

        <ItemsFilterPanel
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
          useMyLocationDraft={useMyLocationDraft}
          setUseMyLocationDraft={setUseMyLocationDraft}
          zipDraft={zipDraft}
          setZipDraft={setZipDraft}
          radiusDraft={radiusDraft}
          setRadiusDraft={setRadiusDraft}
          applyGeoFilters={applyGeoFilters}
          resetGeoDrafts={resetGeoDrafts}
        />

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
              items={visibleItems}
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
