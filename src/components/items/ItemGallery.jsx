import React, { useState } from "react";

export default function ItemGallery({ images = [], title = "" }) {
  const [mainIndex, setMainIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const mainImage = images[mainIndex] || null;

  return (
    <div className="w-full">
      {mainImage ? (
        <div className="w-full rounded-2xl overflow-hidden bg-gray-100">
          <button
            onClick={() => setLightboxOpen(true)}
            className="w-full h-96 bg-gray-100 flex items-center justify-center"
            aria-label="Open image"
          >
            <img
              src={mainImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      ) : (
        <div className="w-full rounded-2xl overflow-hidden bg-gray-100 h-96 flex items-center justify-center">
          <img
            src="/placeholder.svg"
            alt="No images available"
            className="w-full h-full object-contain opacity-80"
          />
        </div>
      )}

      {Array.isArray(images) && images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {images.map((src, idx) => (
            <button
              key={src + idx}
              onClick={() => setMainIndex(idx)}
              aria-pressed={idx === mainIndex}
              className={`w-20 h-20 rounded-md overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                idx === mainIndex ? "border-black" : "border-transparent"
              }`}
              aria-label={`Show image ${idx + 1}`}
            >
              <img
                src={src}
                alt={`thumb-${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && mainImage && (
        <div
          className="fixed inset-0 z-[10050] bg-black/80 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-6 right-6 text-white text-xl"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close image"
            >
              ✕
            </button>
            <img
              src={mainImage}
              alt={title}
              className="max-w-[95%] max-h-[85%] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
