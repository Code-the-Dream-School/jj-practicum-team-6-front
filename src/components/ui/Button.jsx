export default function Button({
  children,
  type = "button",
  disabled = false,
  disabled = false,
  onClick,
  variant = "primary",
  size = "medium",
  className = "",
  ...props
}) {
  // Base button styles
  const baseStyles =
    "font-medium border-none rounded-14 cursor-pointer transition-all duration-200 inline-flex items-center justify-center whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60";

  // Variant styles
  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-[#d14d2a] hover:-translate-y-0.5 hover:enabled:shadow-lg",
    accent:
      "bg-primary text-white hover:bg-[#d14d2a] hover:-translate-y-0.5 hover:enabled:shadow-lg", // Keep for backward compatibility
    secondary:
      "bg-ink text-white hover:bg-[#333333] hover:-translate-y-0.5 hover:enabled:shadow-lg",
    outline:
      "bg-transparent text-ink border border-ink hover:bg-ink hover:text-white hover:enabled:shadow-lg",
  };

  // Size styles
  const sizeStyles = {
    small: "px-4 py-2 text-sm h-9",
    medium: "px-6 py-3 text-base h-12",
    large: "px-8 py-3 text-lg h-14 w-full",
  };

  // Combine all styles
  const combinedStyles = [
    baseStyles,
    variantStyles[variant] || variantStyles.primary,
    sizeStyles[size] || sizeStyles.medium,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedStyles}
      {...props}
    >
      {children}
    </button>
  );
}
