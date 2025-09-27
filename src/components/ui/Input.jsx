import React from "react";

const baseClasses =
  "w-full h-full font-roboto text-ink placeholder:text-gray-400 focus:outline-none focus:ring-0 appearance-none flex items-center justify-center transition-colors";

const variantClasses = {
  default: "rounded-full border border-gray-200 hover:border-gray-300",
  frameless: "rounded-full border-0 hover:border-transparent",
};

const Input = React.forwardRef(function Input(
  { className = "", type = "text", variant = "default", ...rest },
  ref
) {
  const dateTweaks =
    type === "date" ? " appearance-none [color-scheme:light] " : "";
  const variantCls = variantClasses[variant] || variantClasses.default;
  return (
    <input
      ref={ref}
      type={type}
      className={`${baseClasses} ${variantCls}${dateTweaks} ${className}`.trim()}
      {...rest}
    />
  );
});

export default Input;
