export default function Input({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  className = "",
  rightIcon = null,
}) {
  return (
    <div className="relative">
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border rounded-[14px] px-4 py-3 font-roboto text-ink placeholder:text-gray-400 transition hover:border-primary focus:border-success focus:outline-none ${className}`}
      />
      {rightIcon ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {rightIcon}
        </span>
      ) : null}
    </div>
  );
}
