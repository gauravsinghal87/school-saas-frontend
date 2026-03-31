import PhoneInputImport from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneInput = PhoneInputImport.default || PhoneInputImport;

const AppPhoneInput = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder = "Enter phone number",
  defaultCountry = "in",
}) => {
  const handleChange = (phone, country) => {
    onChange({
      target: {
        name,
        value: phone,
        country,
      },
    });
  };

  return (
    <div className="w-full">
      {/* LABEL */}
      {label && (
        <label className="block text-xs font-semibold mb-1 uppercase text-[var(--color-text-secondary)]">
          {label} {required && "*"}
        </label>
      )}

      {/* PHONE INPUT */}
      <PhoneInput
        country={defaultCountry}
        value={value}
        onChange={handleChange}
        enableSearch
        inputProps={{
          name,
          required,
        }}

        containerClass="w-full"

        // ✅ minimal clean styling (DON'T break default layout)
        inputStyle={{
          width: "100%",
          height: "44px",
          borderRadius: "12px",
          border: `1px solid ${
            error
              ? "var(--color-error)"
              : "var(--color-border)"
          }`,
          backgroundColor: "var(--color-surface-card)",
          color: "var(--color-text-primary)",
          fontSize: "14px",
        }}

        buttonStyle={{
          borderTopLeftRadius: "12px",
          borderBottomLeftRadius: "12px",
          borderRight: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface-card)",
        }}

        dropdownStyle={{
          borderRadius: "12px",
          border: "1px solid var(--color-border)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
        }}

        searchStyle={{
          width: "90%",
          margin: "8px auto",
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid var(--color-border)",
        }}

        placeholder={placeholder}
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

export default AppPhoneInput;