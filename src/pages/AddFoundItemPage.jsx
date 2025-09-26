import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaImage, FaUpload } from "react-icons/fa";
import Input from "../components/ui/Input.jsx";
import LocationMap from "../components/LocationMap.jsx";
import Button from "../components/ui/Button.jsx";
import categories from "../util/categories";
import itemsService from "../services/itemsService";
import uploadsService from "../services/uploadsService";
import Modal from "../components/Modal.jsx";

export default function AddFoundItemPage({ currentUser }) {
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: categories[0] || "Other",
    tags: "",
    photos: [],
  });
  const dateRef = useRef(null);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleMapSelect(latlng) {
    let locationString = `${latlng.lat}, ${latlng.lng}`;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`
      );
      const data = await res.json();
      if (data && data.address && data.address.postcode) {
        locationString = data.address.postcode;
      } else if (data && data.display_name) {
        locationString = data.display_name;
      }
    } catch (e) {}
    setForm((prev) => ({ ...prev, location: locationString }));
    setCoords({ lat: latlng.lat, lng: latlng.lng });
    setShowMap(false);
  }

    function onFileChange(e) {
       const picked = Array.from(e.target.files || []);
        if (!picked.length) return;
        setForm((prev) => {
           const merged = [...prev.photos, ...picked];
          // dedupe by name+size+lastModified
          const seen = new Set();
          const unique = [];
          for (const f of merged) {
            const key = `${f.name}-${f.size}-${f.lastModified}`;
            if (seen.has(key)) continue;
            seen.add(key);
           unique.push(f);
         }
          return { ...prev, photos: unique };
        });
        // allow selecting the same file again
        e.target.value = "";
     }

  function handleRemovePhoto(idx) {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  }

  function onSubmit(e) {
    e.preventDefault();
    (async () => {
      setSubmitting(true);
      setErrorMsg("");
      try {
        const zipFromLocation = (form.location || "").match(/\b\d{5}\b/);
        const zipCode = zipFromLocation
          ? zipFromLocation[0]
          : form.location || "";
        const payload = {
          title: form.title,
          description: form.description,
          status: "FOUND",
          categoryName: form.category,
          zipCode,
          ...(Number.isFinite(coords.lat) && Number.isFinite(coords.lng)
            ? { latitude: coords.lat, longitude: coords.lng }
            : {}),
        };
        const created = await itemsService.createItem(payload);
        if (created?.id && form.photos?.length) {
          try {
            const sig = await uploadsService.getUploadSignature({
              folder: "items",
            });
            const { cloudName, apiKey, timestamp, folder, signature } = sig;
            const uploadedUrls = [];
            for (const file of form.photos) {
              const fd = new FormData();
              fd.append("file", file);
              fd.append("api_key", apiKey);
              fd.append("timestamp", timestamp);
              fd.append("folder", folder);
              fd.append("signature", signature);
              const resp = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                  method: "POST",
                  body: fd,
                }
              );
              const body = await resp.json();
              if (resp.ok && body.secure_url)
                uploadedUrls.push(body.secure_url);
            }
            if (uploadedUrls.length) {
              await itemsService.addItemPhotos(
                created.id,
                uploadedUrls.map((url) => ({ url }))
              );
            }
          } catch (e) {
            console.warn("photo upload failed", e);
          }
        }
        if (created && created.id) {
          navigate(`/items/${created.id}`);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("create FOUND item failed", err);
        setErrorMsg("Failed to create item. Please try again.");
      } finally {
        setSubmitting(false);
      }
    })();
  }

  return (
    <div className="flex flex-col items-center">
      {errorMsg && (
        <div className="max-w-3xl mx-auto mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 border border-red-200">
          {errorMsg}
        </div>
      )}
      <main className="w-full">
        <h1 className="text-center font-display text-4xl font-black mt-10 mb-8">
          Add Found Item
        </h1>
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-3xl mx-auto mb-16"
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
              className="w-full rounded-full border border-gray-200 px-4 py-3 font-roboto text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-roboto text-ink placeholder:text-gray-400 transition hover:border-primary focus:border-success focus:outline-none"
              rows={4}
              required
            />
          </div>
          {/* Location + Date */}
          <div className="flex gap-4 mb-4 items-end">
            <div className="flex-1">
              <label className="block font-semibold mb-2">
                Location Where Found *
              </label>
              <Input
                name="location"
                value={form.location}
                onChange={onChange}
                placeholder="Add address or zipcode"
                required
                className="w-full rounded-full border border-gray-200 px-4 py-3 font-roboto text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              aria-label="Open map"
              className="h-[50px] py-4 px-6 rounded-full border border-gray-200 text-gray-500 hover:text-primary hover:border-primary transition flex items-center justify-center gap-2 font-body"
              onClick={() => setShowMap(true)}
            >
              <FaMapMarkerAlt />
            </button>
            <Modal
              open={showMap}
              onClose={() => setShowMap(false)}
              title="Select Location"
              maxWidth="max-w-xl"
            >
              <div className="w-full h-80 overflow-hidden rounded-lg">
                <LocationMap onSelect={handleMapSelect} />
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Click on the map to set location
              </p>
            </Modal>
            <div className="flex-1">
              <label className="block font-semibold mb-2">Date Found</label>
              <div className="relative">
                <Input
                  ref={dateRef}
                  name="date"
                  value={form.date}
                  onChange={onChange}
                  type="date"
                  min="1900-01-01"
                  max="9999-12-31"
                  placeholder="mm/dd/yyyy"
                  className="w-full rounded-full border border-gray-200 px-4 py-3 pr-4 font-roboto text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-right"
                />
              </div>
            </div>
          </div>
          {/* Category Dropdown */}
          <div className="mb-4 max-w-md">
            <label className="block font-semibold mb-2">Add category</label>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              className="w-full rounded-full border border-gray-200 px-4 py-3 pr-12 font-roboto text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='36' viewBox='0 0 24 24' width='36' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "2rem",
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {/* Photos */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Photos</label>
            {/* Thumbnails Preview */}
            {form.photos && form.photos.length > 0 && (
              <div className="mb-4 flex gap-4">
                {form.photos.map((file, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="relative w-24 h-24">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-24 h-24 object-cover rounded-xl border"
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
            <div className="border border-gray-200 rounded-2xl px-4 py-8 flex flex-col items-center bg-gray-50">
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
                <span className="border border-gray-200 px-16 py-2.5 rounded-full shadow cursor-pointer inline-flex items-center gap-2 bg-white">
                  <FaUpload className="text-m" /> Browse Files
                </span>
              </label>
            </div>
          </div>
          {/* Publish */}
          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              variant="primary"
              size="medium"
              className="rounded-full font-medium shadow-card max-w-xs"
              disabled={submitting}
            >
              {submitting ? "Saving…" : "Save and Publish"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
