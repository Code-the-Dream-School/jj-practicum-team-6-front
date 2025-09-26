import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function CategoryDropdown({
  value,
  options = [],
  placeholder = "All categories",
  onChange,
  buttonClassName = "",
  menuClassName = "",
  align = "left",
  widthClass = "w-56",
  allOption,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const normalized = (options || []).map((opt) =>
    typeof opt === "object" && opt !== null
      ? {
          label: opt.label ?? String(opt.value ?? opt),
          value: opt.value ?? opt,
          disabled: !!opt.disabled,
        }
      : { label: String(opt), value: opt, disabled: false }
  );

  const allOpt = allOption
    ? {
        label: allOption.label ?? placeholder,
        value: allOption.value ?? "",
        disabled: !!allOption.disabled,
      }
    : null;

  const findLabel = () => {
    if (value == null || value === "") {
      if (allOpt) return allOpt.label;
      return placeholder;
    }
    const found = normalized.find((o) => o.value === value);
    return found ? found.label : String(value);
  };

  const currentLabel = findLabel();

  return (
    <div className={`relative ${widthClass}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center justify-between gap-2 w-full text-sm text-gray600 hover:text-ink ${buttonClassName}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="truncate">{currentLabel}</span>
        <FaChevronDown
          className={`ml-2 transition-transform duration-150 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg z-50 p-2 ${menuClassName}`}
        >
          {allOpt && (
            <button
              type="button"
              role="menuitem"
              disabled={allOpt.disabled}
              onClick={() => {
                if (allOpt.disabled) return;
                onChange && onChange(allOpt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                (value == null || value === "") && !allOpt.disabled
                  ? "bg-gray-50 text-ink"
                  : "hover:bg-gray-50 text-gray-700"
              } ${allOpt.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {allOpt.label}
            </button>
          )}
          {normalized.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              role="menuitem"
              disabled={opt.disabled}
              onClick={() => {
                if (opt.disabled) return;
                onChange && onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                value === opt.value
                  ? "bg-gray-50 text-ink"
                  : "hover:bg-gray-50 text-gray-700"
              } ${opt.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
