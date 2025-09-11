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
        className={`input w-[300px] border-none focus:outline-none ${
          error ? "border-red-500" : ""
        }`}
        aria-invalid={!!error}
      />
      {rightIcon ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {rightIcon}
        </span>
      ) : null}
    </div>
  );
}
