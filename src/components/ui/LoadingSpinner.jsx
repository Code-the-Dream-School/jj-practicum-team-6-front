export default function LoadingSpinner({
  size = "medium",
  color = "primary",
  className = "",
  fullScreen = false,
  text = "",
}) {
  // Size configurations
  const sizeStyles = {
    small: "w-4 h-4 border-2",
    medium: "w-6 h-6 border-2",
    large: "w-8 h-8 border-[3px]",
    xl: "w-12 h-12 border-4",
  };

  // Color configurations
  const colorStyles = {
    primary: "border-primary border-t-transparent",
    ink: "border-ink border-t-transparent",
    white: "border-white border-t-transparent",
    success: "border-success border-t-transparent",
  };

  const spinnerClasses = [
    "rounded-full animate-spin",
    sizeStyles[size] || sizeStyles.medium,
    colorStyles[color] || colorStyles.primary,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={spinnerClasses}></div>
      {text && <p className="text-sm text-gray600 animate-pulse">{text}</p>}
    </div>
  );

  // Full screen overlay version
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  // Inline version
  return spinner;
}
