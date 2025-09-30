import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaMap } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import LocationMap from "../LocationMap";
import itemsService from "../../services/itemsService";

const LandingMapSection = () => {
  const [viewMode, setViewMode] = useState("map");
  const [recentItems, setRecentItems] = useState([]);
  const [stats, setStats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const toStatusText = (s) => {
      const x = (s || "").toString().toUpperCase();
      if (x === "LOST") return "Lost";
      if (x === "FOUND") return "Found";
      if (x === "RESOLVED") return "Resolved";
      return s || "Lost";
    };
    itemsService
      .getItems({ page: 1, limit: 12, is_resolved: false })
      .then(({ items = [], meta = {} } = {}) => {
        if (!mounted) return;
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
        setRecentItems(normalized.slice(0, 6));
        const lostCount = normalized.filter((i) => i.status === "Lost").length;
        const foundCount = normalized.filter(
          (i) => i.status === "Found"
        ).length;
        const total = meta.total || normalized.length || 0;
        setStats([
          { number: String(total), label: "Active Items" },
          { number: String(lostCount), label: "Lost (shown)" },
          { number: String(foundCount), label: "Found (shown)" },
        ]);
      })
      .catch(() => {
        if (!mounted) return;
        setRecentItems([]);
        setStats([
          { number: "0", label: "Active Items" },
          { number: "0", label: "Lost (shown)" },
          { number: "0", label: "Found (shown)" },
        ]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="recently-added" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="font-display text-5xl md:text-6xl font-bold text-ink mb-2 leading-none">
                {stat.number}
              </div>
              <div className="font-body text-gray600 text-sm font-normal">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Recently Added Section */}
        <div className="text-center mb-8">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-8 leading-tight">
            Recently Added
          </h2>

          {/* View Toggle */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setViewMode("list")}
              className={`px-6 py-3 rounded-full flex items-center gap-3 font-medium text-sm transition-all duration-200 ${
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
              className={`px-6 py-3 rounded-full flex items-center gap-3 font-medium text-sm transition-all duration-200 ${
                viewMode === "map"
                  ? "bg-ink text-white shadow-md"
                  : "bg-gray-100 text-gray600 hover:bg-gray-200"
              }`}
            >
              <FaMap size={16} />
              Map view
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === "map" ? (
          <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
            <LocationMap mode="display" items={recentItems} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-2xl shadow-sm p-6 bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="mb-4">
                  <span
                    className={`text-xs px-4 py-2 rounded-full font-semibold ${
                      item.status === "Lost"
                        ? "bg-red-50 text-primary border border-red-100"
                        : "bg-green-50 text-success border border-green-100"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="w-full h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-xl"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src="/placeholder.svg"
                      alt="No image available"
                      className="w-full h-full object-cover rounded-xl opacity-80"
                      loading="lazy"
                    />
                  )}
                </div>
                <h4 className="font-display text-xl font-semibold text-ink mb-3 leading-tight">
                  {item.title}
                </h4>
                <p className="font-body text-sm text-gray600 mb-2 flex items-center gap-2">
                  <span className="text-gray-400">
                    <MdLocationPin />
                  </span>
                  {item.location}
                </p>
                <p className="font-body text-sm text-gray-500 flex items-center gap-2">
                  <span className="text-gray-400">
                    <SlCalender />
                  </span>
                  {item.date}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* View All Items Button with Access Control */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              const token = localStorage.getItem("token");
              if (token) {
                navigate("/items/list");
              } else {
                navigate("/signin");
              }
            }}
            className="bg-ink text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            View all items →
          </button>
          {/* </div> */}
        </div>
      </div>
    </section>
  );
};

export default LandingMapSection;
