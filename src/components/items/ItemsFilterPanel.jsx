import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import CategoryDropdown from "../ui/CategoryDropdown";

const SORT_OPTIONS = [
  { value: "Newest", label: "Newest" },
  { value: "Oldest", label: "Oldest" },
  { value: "Name", label: "Name (A→Z)" },
];

export default function ItemsFilterPanel({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  category,
  onCategoryChange,
  categories,
  useMyLocationDraft,
  setUseMyLocationDraft,
  zipDraft,
  setZipDraft,
  radiusDraft,
  setRadiusDraft,
  applyGeoFilters,
  resetGeoDrafts,
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isSortOpen) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSortOpen]);

  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      {/* Search Input */}
      <div className="w-full max-w-2xl">
        <input
          type="text"
          placeholder="Search by name, description or zipcode"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-gray-100 px-4 py-3 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-primary font-body text-ink placeholder:text-gray-400"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        {[
          { label: "All", value: "All", classes: "bg-ink text-white border-ink" },
          { label: "Lost", value: "Lost", classes: "bg-primary text-white border-primary" },
          { label: "Found", value: "Found", classes: "bg-success text-white border-success" },
        ].map(({ label, value, classes }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
              filter === value
                ? classes
                : "bg-white text-gray600 border-gray-300 hover:border-gray-400"
            }`}
          >
            {label}
          </button>
        ))}

        <div className="relative inline-block ml-2" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen((v) => !v)}
            className="inline-flex items-center gap-2 text-sm text-gray600 hover:text-ink"
            aria-haspopup="menu"
            aria-expanded={isSortOpen}
          >
            <FaFilter className="text-gray-500" />
            <span>Filter</span>
          </button>
          {isSortOpen && (
            <div
              role="menu"
              className="absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50 p-2"
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  role="menuitem"
                  onClick={() => {
                    onSortChange(opt.value);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    sort === opt.value
                      ? "bg-gray-50 text-ink"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
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
          onChange={onCategoryChange}
          widthClass="min-w-[240px]"
          buttonClassName="px-4 py-2 rounded-full border border-gray-300 bg-white"
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
          onChange={(e) => setZipDraft(e.target.value.replace(/[^0-9-]/g, ""))}
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
          <span className="text-sm text-gray-600 w-10 text-right">{radiusDraft} mi</span>
        </div>

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
  );
}
