import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import itemsService from "../services/itemsService";
import uploadsService from "../services/uploadsService";
import { FaMapMarkerAlt, FaImage, FaUpload } from "react-icons/fa";
import Input from "../components/ui/Input.jsx";
import LocationMap from "../components/LocationMap.jsx";
import Button from "../components/ui/Button.jsx";
import categories from "../util/categories";
import Modal from "../components/Modal.jsx";
import AddItemForm from "../components/items/AddItemForm.jsx";

export default function AddLostItemPage({ currentUser }) {
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
          status: "LOST",
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
              if (resp.ok && body.secure_url) {
                uploadedUrls.push(body.secure_url);
              }
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
        console.error("createItem failed", err);
        setErrorMsg("Failed to create item. Please try again.");
      } finally {
        setSubmitting(false);
      }
    })();
  }

export default function AddLostItemPage() {
  return (
    <AddItemForm
      status="LOST"
      title="Add Lost Item"
      locationLabel="Location Where Lost *"
    />
  );
}
