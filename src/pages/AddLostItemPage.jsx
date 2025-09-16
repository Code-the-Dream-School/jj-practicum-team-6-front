import { useState, useRef } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaImage,
  FaUserCircle,
  FaHome,
  FaPlusCircle,
  FaUpload,
} from "react-icons/fa";
import Input from "../components/ui/Input.jsx";
import LocationMap from "../components/LocationMap.jsx";
import Button from "../components/ui/Button.jsx";

export default function AddLostItemPage({ currentUser }) {
  function handleRemovePhoto(idx) {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  }
  const [showMap, setShowMap] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    tags: "",
    photos: [],
  });

  const dateRef = useRef(null);

  function onDateChange(e) {
    let v = e.target.value;
    const parts = v.split("-");
    if (parts.length > 0 && parts[0]?.length > 4) {
      parts[0] = parts[0].slice(0, 4);
      v = parts.join("-");
    }
    setForm({ ...form, date: v });
  }

  function openDatePicker() {
    const el = dateRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.focus();
      el.click();
    }
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleMapSelect(latlng) {
    setForm({ ...form, location: `${latlng.lat}, ${latlng.lng}` });
    setShowMap(false);
  }

  function onFileChange(e) {
    setForm({ ...form, photos: Array.from(e.target.files) });
  }

  function onSubmit(e) {
    e.preventDefault();
    alert("Submitted!");
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <main className="w-full">
        {/* Header
        <header className="w-full bg-white border-b">
          <div className="mx-auto max-w-6xl px-8 py-6 flex justify-between items-center">
            <div className="font-bold text-xl">Retrieve</div>
            <nav className="flex gap-8 items-center">
              <a
                href="/items"
                className="flex items-center gap-2 font-semibold"
              >
                <FaHome className="text-2xl" />
                <span>All items</span>
              </a>
              <a
                href="/items/new/lost"
                className="flex items-center gap-2 font-semibold"
              >
                <FaPlusCircle className="text-[#E66240] text-xl" />
                <span className="text-[#E66240]">Add lost item</span>
              </a>
              <a
                href="/items/new/found"
                className="flex items-center gap-2 font-semibold"
              >
                <FaPlusCircle className="text-[#7FD96C] text-xl" />
                <span className="text-[#7FD96C]">Add found item</span>
              </a>
              <span className="font-semibold flex items-center gap-2">
                <span className="bg-black rounded-full p-1 flex items-center justify-center">
                  <FaUserCircle className="text-sm text-white" />
                </span>
                {currentUser?.name || "User"}
              </span>
            </nav>
          </div>
        </header> */}

        {/* Title */}
        <h1 className="text-center font-display text-3xl md:text-4xl font-black mt-10 mb-8">
          Add Lost Item
        </h1>

        {/* Form Card */}
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl shadow p-8 w-full max-w-3xl border mx-auto"
        >
          <h2 className="text-2xl font-bold mb-6 font-display">Item Details</h2>

          {/* Item Title */}
          <div className="mb-4 max-w-md">
            <label className="block font-semibold mb-2">Item Title *</label>
            <Input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="e.g., Black iPhone 13"
              required
              className="rounded-full"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Describe your item in detail"
              className="w-full rounded-[14px] border border-gray-200 px-4 py-3 font-roboto text-ink placeholder:text-gray-400 transition hover:border-primary focus:border-success focus:outline-none"
              rows={4}
              required
            />
          </div>

          {/* Location + Date */}
          <div className="flex gap-4 mb-4 items-end">
            <div className="flex-1">
              <label className="block font-semibold mb-2">
                Location Where Lost *
              </label>
              <Input
                name="location"
                value={form.location}
                onChange={onChange}
                placeholder="Add address or zipcode"
                required
                className="font-roboto rounded-full"
              />
            </div>
            <button
              type="button"
              aria-label="Open map"
              className="h-[50px] py-4 px-6 rounded-full border border-gray-200 text-gray-500 hover:text-primary hover:border-primary transition flex items-center justify-center gap-2 font-body"
              onClick={() => setShowMap(true)}
            >
              <FaMapMarkerAlt />
              <span className="hidden md:inline text-sm">Map</span>
            </button>
            {showMap && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                    onClick={() => setShowMap(false)}
                    aria-label="Close map"
                  >
                    &times;
                  </button>
                  <h3 className="text-lg font-bold mb-4">Select Location</h3>
                  <LocationMap onSelect={handleMapSelect} />
                </div>
              </div>
            )}
            <div className="flex-1">
              <label className="block font-semibold mb-2">Date Lost</label>
              <Input
                ref={dateRef}
                name="date"
                value={form.date}
                onChange={onDateChange}
                type="date"
                min="1900-01-01"
                max="9999-12-31"
                placeholder="mm/dd/yyyy"
                className="font-roboto rounded-full placeholder:text-gray-400 pr-10"
              />
            </div>
          </div>

          {/* Add tags */}
          <div className="mb-4 max-w-md">
            <label className="block font-semibold mb-2">Add tags</label>
            <Input
              name="tags"
              value={form.tags}
              onChange={onChange}
              placeholder="e.g., iPhone, mobile, key, bag"
              className="font-roboto rounded-full"
            />
          </div>

          {/* Photos */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Photos</label>
            <div className="border rounded-[14px] px-4 py-8 flex flex-col items-center">
              <FaImage className="text-4xl mb-2 text-gray-500" />
              <span className="mb-2 text-gray-500 font-semibold">
                Add photos
              </span>
              <span className="mb-4 text-xs text-gray-500">
                Drag & drop images here, or click to browse
              </span>
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  onChange={onFileChange}
                  className="hidden"
                />
                <span className="border px-16 py-2.5 rounded-full shadow cursor-pointer inline-flex items-center gap-2">
                  <FaUpload className="text-m" /> Browse Files
                </span>
              </label>
              {/* Thumbnails Preview */}
              {form.photos && form.photos.length > 0 && (
                <div className="mt-6 grid grid-cols-4 md:grid-cols-4 gap-4 w-full">
                  {form.photos.map((file, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="relative w-24 h-24">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-opacity-90"
                          onClick={() => handleRemovePhoto(idx)}
                          aria-label="Remove photo"
                        >
                          &times;
                        </button>
                      </div>
                      <span className="mt-2 text-xs text-gray-600 truncate w-24 text-center">
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Publish */}
          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              variant="dark"
              className="px-16 py-2 rounded-full font-medium shadow-card"
            >
              Publish
            </Button>
          </div>
        </form>

        {/* Footer */}
        <footer className="w-full mt-8 py-10 bg-gray-100 text-center border-t flex flex-col items-center">
          <div className="font-bold text-xl mb-2">Retrieve</div>
          <div className="mb-2 font-body text-base">Got questions?</div>
          <div className="mb-2 font-body text-base">
            We&apos;ve got answers →{" "}
            <a
              href="mailto:retrieve@gmail.com"
              className="bg-black text-white px-3 py-1 rounded-full hover:opacity-90 font-body"
            >
              retrieve@gmail.com
            </a>
          </div>
          <div className="mt-4 text-xs text-gray-500 font-body">
            © 2025 Retrieve. All Rights Reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
