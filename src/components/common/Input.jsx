import { useState } from "react";

const Input = ({ label, error,disabled, required, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="w-full">
      {/* LABEL */}
      {label && (
        <label className="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)] uppercase tracking-wider">
          {label}{" "}
          {required && (
            <span className="text-[var(--color-error)]">*</span>
          )}
        </label>
      )}

      {/* INPUT WRAPPER */}
      <div className="relative">
        <input    disabled={disabled}
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`w-full h-[44px] px-4 ${
            isPassword ? "pr-10" : ""
          } rounded-xl border text-sm outline-none transition
          bg-[var(--color-surface-card)]
          text-[var(--color-text-primary)]
          border-[var(--color-border)]
          focus:border-[var(--color-primary)]
          focus:ring-2 focus:ring-[var(--color-primary)]/20
          ${error ? "border-[var(--color-error)]" : ""}`}
        />

        {/* 👁️ TOGGLE BUTTON */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-xs mt-1 text-[var(--color-error)]">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;