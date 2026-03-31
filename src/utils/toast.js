import toast from "react-hot-toast";

const baseStyle = {
    borderRadius: "1rem",
    padding: "0.875rem 1.25rem",  // px-5 py-3.5
    fontSize: "0.875rem",         // text-sm
    fontWeight: "600",            // font-semibold
    maxWidth: "24rem",            // max-w-sm
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", // shadow-xl
};

// ✅ Success
export const showSuccess = (message) => {
    toast.success(message, {
        icon: "✓",
        style: {
            ...baseStyle,
            background: "#16A34A", // --color-success
            color: "#fff",
        },
    });
};

// ❌ Error
export const showError = (message) => {
    toast.error(message, {
        icon: "✕",
        style: {
            ...baseStyle,
            background: "#DC2626", // --color-error
            color: "#fff",
        },
    });
};

// ⚠️ Warning
export const showWarning = (message) => {
    toast(message, {
        icon: "⚠",
        style: {
            ...baseStyle,
            background: "#F59E0B", // --color-warning
            color: "#000",
        },
    });
};

// ℹ️ Info
export const showInfo = (message) => {
    toast(message, {
        icon: "ℹ",
        style: {
            ...baseStyle,
            background: "#2563EB", // --color-primary / --color-info
            color: "#fff",
        },
    });
};