import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaImage, FaUpload } from "react-icons/fa";
import itemsService from "../../services/itemsService";
import ConfirmModal from "../../components/ConfirmModal";
import uploadsService from "../../services/uploadsService";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import LocationMap from "../../components/LocationMap.jsx";
import categories from "../../util/categories";

export default function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    photoId: null,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [showMap, setShowMap] = useState(false);
  const dateRef = useRef(null);

  const [itemData, setItemData] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: categories[0] || "Other",
  });

  useEffect(() => {
    let mounted = true;
    itemsService
      .getItem(id)
      .then((data) => {
        if (!mounted) return;
        if (!data) {
          setErrorMsg("Item not found");
          setItemData(null);
          return;
        }
        setItemData(data);
        setForm({
          title: data.title || "",
          description: data.description || "",
          location: data.zipCode || data.location || "",
          date: data.dateReported ? String(data.dateReported).slice(0, 10) : "",
          category:
            data.category?.name ||
            data.categoryName ||
            categories[0] ||
            "Other",
        });
      })
      .catch((err) => {
        console.error("getItem failed", err);
        setErrorMsg("Failed to load item. Please try again.");
        setItemData(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id, navigate]);

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
    setShowMap(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const zipFromLocation = (form.location || "").match(/\b\d{5}\b/);
      const zipCode = zipFromLocation
        ? zipFromLocation[0]
        : form.location || "";
      const payload = {
        title: form.title,
        description: form.description,
        zipCode,
        categoryName: form.category,
      };
      const updated = await itemsService.updateItem(id, payload);
      if (updated && updated.id) {
        navigate(`/items/${updated.id}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("updateItem failed", err);
      setErrorMsg("Failed to update item. Please fix errors and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!itemData) return <p>Item not found</p>;

  return (
    <div className="flex flex-col items-center">
      <main className="w-full">
        <h1 className="text-center font-display text-4xl font-black mt-10 mb-8">
          Edit Item
        </h1>
        {errorMsg && (
          <div className="max-w-3xl mx-auto mb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md">
              {errorMsg}
            </div>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
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
                Location Where Lost *
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
                  <div className="w-full h-80 overflow-hidden rounded-lg">
                    <LocationMap onSelect={handleMapSelect} />
                  </div>
                  <p className="mt-3 text-sm text-gray-500">
                    Click on the map to set location
                  </p>
                </div>
              </div>
            )}
            <div className="flex-1">
              <label className="block font-semibold mb-2">Date Lost</label>
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
            {/* Existing photos */}
            {Array.isArray(itemData.photos) && itemData.photos.length > 0 && (
              <div className="mb-4 flex gap-4 flex-wrap">
                {itemData.photos.map((p) => (
                  <div key={p.id} className="relative w-24 h-24">
                    <img
                      src={p.url}
                      alt="item"
                      className="w-24 h-24 object-cover rounded-xl border"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-opacity-90"
                      onClick={() =>
                        setConfirmDelete({ open: true, photoId: p.id })
                      }
                      aria-label="Remove photo"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload dropzone */}
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
                  accept="image/*"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;
                    setUploading(true);
                    try {
                      const sig = await uploadsService.getUploadSignature({
                        folder: "items",
                      });
                      const {
                        cloudName,
                        apiKey,
                        timestamp,
                        folder,
                        signature,
                      } = sig;
                      const uploadedUrls = [];
                      for (const file of files) {
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
                        const added = await itemsService.addItemPhotos(
                          id,
                          uploadedUrls.map((url) => ({ url }))
                        );
                        setItemData((prev) => ({ ...prev, photos: added }));
                      }
                    } catch (err) {
                      console.error("photo upload failed", err);
                      setErrorMsg("Failed to upload photos");
                    } finally {
                      setUploading(false);
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                />
                <span className="border border-gray-200 px-16 py-2.5 rounded-full shadow cursor-pointer inline-flex items-center gap-2 bg-white">
                  <FaUpload className="text-m" />{" "}
                  {uploading ? "Uploading…" : "Browse Files"}
                </span>
              </label>
            </div>
          </div>
          {errorMsg && (
            <div className="mt-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 border border-red-200 text-sm text-center">
              {errorMsg}
            </div>
          )}
          {/* Publish */}
          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              variant="primary"
              size="medium"
              className="rounded-full font-medium shadow-card max-w-xs"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save and Publish"}
            </Button>
          </div>
        </form>
        {/* Confirm Delete Photo Modal */}
        <ConfirmModal
          open={confirmDelete.open}
          text="Delete this photo?"
          onConfirm={async () => {
            try {
              await itemsService.deleteItemPhoto(id, confirmDelete.photoId);
              setItemData((prev) => ({
                ...prev,
                photos: (prev.photos || []).filter(
                  (x) => x.id !== confirmDelete.photoId
                ),
              }));
            } catch (e) {
              setErrorMsg("Failed to delete photo");
            } finally {
              setConfirmDelete({ open: false, photoId: null });
            }
          }}
          onCancel={() => setConfirmDelete({ open: false, photoId: null })}
        />
      </main>
    </div>
  );
}
