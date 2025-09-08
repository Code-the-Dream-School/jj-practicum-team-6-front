export default function Button({
  children,
  type = "button",
  disabled = false,
  onClick,
  variant = "primary",
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition focus:outline-none";
  const variants = {
    primary: "bg-brand-black text-white hover:bg-black/80",
    dark: "bg-black text-white hover:bg-black/80",
    outline:
      "border border-gray-300 text-brand-black bg-white hover:bg-gray-100",
  };
  const color = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${color} ${className}`}
    >
      {children}
    </button>
  );
}
