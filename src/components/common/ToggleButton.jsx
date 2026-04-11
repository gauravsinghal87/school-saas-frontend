// components/ToggleButton.jsx
import React from "react";

export default function ToggleButton({ isActive, onToggle, disabled }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                        ${isActive ? "bg-success shadow-md shadow-success/30" : "bg-border"}`}
    >
      <div className={`bg-surface-page w-4 h-4 rounded-full shadow transform transition-all duration-300 ${isActive ? "translate-x-6" : "translate-x-0"}`} />
    </button>
  );
}