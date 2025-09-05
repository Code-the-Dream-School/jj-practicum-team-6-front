export default function Button({
  children,
  type = "button",
  disabled,
  onClick,
  variant = "primary",
}) {
  const cls = variant === "accent" ? "btn btn-accent" : "btn btn-primary";
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
