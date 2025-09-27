import React from "react";

const baseClasses =
  "w-full h-full rounded-full border border-gray-200 px-0 py-0 font-roboto text-ink placeholder:text-gray-400 focus:outline-none focus:ring-0 flex items-center justify-center transition-colors hover:border-gray-300";

const Input = React.forwardRef(function Input(
  { className = "", type = "text", ...rest },
  ref
) {
  const dateTweaks =
    type === "date" ? " appearance-none [color-scheme:light] " : "";
  return (
    <input
      ref={ref}
      type={type}
      className={`${baseClasses}${dateTweaks} ${className}`.trim()}
      {...rest}
    />
  );
});

export default Input;
