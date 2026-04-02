import { useState } from "react";
import Select from "react-select";

const AppSelect = ({
  label,
  error,
  options = [],
  value,
  onChange,
  isMulti = false,
  placeholder = "Select...",
  name,
}) => {
  const [inputValue, setInputValue] = useState("");

  // 🎨 styles
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "var(--color-surface-card)",
      borderColor: state.isFocused
        ? "var(--color-primary)"
        : error
          ? "var(--color-error)"
          : "var(--color-border)",
      boxShadow: "none",
      borderRadius: "12px",
      padding: "2px",
      minHeight: "44px",
      "&:hover": {
        borderColor: "var(--color-primary)",
      },
      menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
      }),

      menu: (provided) => ({
        ...provided,
        zIndex: 9999,
      }),
    }),

    menu: (provided) => ({
      ...provided,
      borderRadius: "12px",
      overflow: "hidden",
      zIndex: 500,
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--color-primary)"
        : state.isFocused
          ? "var(--color-surface-page)"
          : "white",
      color: state.isSelected ? "#fff" : "var(--color-text-primary)",
    }),

    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "var(--color-primary)",
    }),

    multiValueLabel: (provided) => ({
      ...provided,
      color: "#fff",
    }),

    multiValueRemove: (provided) => ({
      ...provided,
      color: "#fff",
      ":hover": {
        backgroundColor: "var(--color-button-primary-hover)",
        color: "#fff",
      },
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "var(--color-text-secondary)",
    }),

    singleValue: (provided) => ({
      ...provided,
      color: "var(--color-text-primary)",
    }),
  };

  // 🔄 handle select
  const handleChange = (selected) => {
    if (isMulti) {
      const values = selected ? selected.map((s) => s.value) : [];
      onChange({ target: { name, value: values } });
    } else {
      onChange({ target: { name, value: selected?.value || "" } });
    }

    setInputValue(""); // ✅ clear search after select
  };

  // 🔁 format value
  const formattedValue = isMulti
    ? options.filter((opt) => value?.includes(opt.value))
    : options.find((opt) => opt.value === value) || null;

  // 🔍 custom filter (better than default)
  const filterOption = (option, input) => {
    return option.label.toLowerCase().includes(input.toLowerCase());
  };

  return (
    <div className="w-full">
      {/* LABEL */}
      {label && (
        <label className="block text-xs font-semibold mb-1 uppercase text-[var(--color-text-secondary)]">
          {label}
        </label>
      )}

      <Select
        options={options}
        value={formattedValue}
        onChange={handleChange}
        isMulti={isMulti}
        placeholder={placeholder}
        styles={customStyles}
        className="text-sm"
        classNamePrefix="react-select"

        // 🔍 SEARCH CONTROL
        isSearchable
        inputValue={inputValue}
        onInputChange={(val) => setInputValue(val)}
        filterOption={filterOption}

        noOptionsMessage={() => "No results found"}
      />

      {/* ERROR */}
      {error && (
        <p className="text-xs mt-1 text-[var(--color-error)]">
          {error}
        </p>
      )}
    </div>
  );
};

export default AppSelect;