import { useState, useRef, useEffect } from "react";

const Select = ({
  label,
  error,
  options = [],
  required,
  isMulti = false,
  value,
  onChange,
  name,
  placeholder = "Select..."
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // ✅ CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ SELECT HANDLER
  const handleSelect = (option) => {
    if (!isMulti) {
      onChange({ target: { name, value: option.value } });
      setOpen(false);
    } else {
      let newValues = value || [];

      if (newValues.includes(option.value)) {
        newValues = newValues.filter((v) => v !== option.value);
      } else {
        newValues = [...newValues, option.value];
      }

      onChange({ target: { name, value: newValues } });
    }
  };

  // ✅ REMOVE CHIP
  const removeItem = (val, e) => {
    e.stopPropagation();
    const newValues = value.filter((v) => v !== val);
    onChange({ target: { name, value: newValues } });
  };

  return (
    <div className="w-full relative" ref={ref}>
      {/* LABEL */}
      {label && (
        <label className="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)] uppercase">
          {label} {required && "*"}
        </label>
      )}

      {/* INPUT BOX */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full min-h-[44px] px-3 py-2 rounded-xl border text-sm flex flex-wrap gap-2 items-center cursor-pointer
        bg-[var(--color-surface-card)]
        border-[var(--color-border)]
        focus-within:border-[var(--color-primary)]
        ${error ? "border-[var(--color-error)]" : ""}
        `}
      >
        {/* MULTI */}
        {isMulti ? (
          value?.length ? (
            value.map((val) => {
              const option = options.find((o) => o.value === val);
              return (
                <span
                  key={val}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-[var(--color-primary)] text-white"
                >
                  {option?.label}
                  <span
                    onClick={(e) => removeItem(val, e)}
                    className="cursor-pointer text-white text-xs"
                  >
                    ✕
                  </span>
                </span>
              );
            })
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )
        ) : (
          <span>
            {options.find((o) => o.value === value)?.label || placeholder}
          </span>
        )}

        {/* ARROW */}
        <span className="ml-auto text-gray-400">⌄</span>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute w-full mt-2 bg-white border border-[var(--color-border)] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto animate-fadeIn">
          {options.map((option) => {
            const selected = isMulti
              ? value?.includes(option.value)
              : value === option.value;

            return (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 text-sm cursor-pointer flex justify-between items-center
                hover:bg-gray-100
                ${
                  selected
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-primary)]"
                }`}
              >
                {option.label}
                {selected && <span>✓</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-xs mt-1 text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
};

export default Select;