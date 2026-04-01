// components/ToggleButton.jsx
import React from "react";

export default function ToggleButton({ isActive, onToggle, disabled }) {
  const active = isActive === true || isActive === "active";

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex items-center h-6 w-12 rounded-full focus:outline-none 
        transition-colors duration-300 ease-in-out
        ${active 
          ? "bg-[var(--color-primary)]" 
          : "bg-[var(--color-border)]"}
      `}
    >
      <span
        className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow-md 
          transform transition-transform duration-300 ease-in-out
          bg-[var(--color-surface-card)]
          ${active ? "translate-x-6" : "translate-x-0"}
        `}
      />
    </button>
  );
}