import React from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-md",
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-lg w-full ${maxWidth} p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="font-semibold mb-3">{title}</h3>}
        <div className="mb-4">{children}</div>
        {footer && <div className="flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
