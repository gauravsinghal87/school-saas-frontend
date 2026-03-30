import toast from "react-hot-toast";

// ✅ Success
export const showSuccess = (message) => {
    toast.success(message, {
        icon: "✅",
        style: {
            background: "#16a34a",
            color: "#fff",
        },
    });
};

// ❌ Error
export const showError = (message) => {
    toast.error(message, {
        icon: "❌",
        style: {
            background: "#dc2626",
            color: "#fff",
        },
    });
};

// ⚠️ Warning
export const showWarning = (message) => {
    toast(message, {
        icon: "⚠️",
        style: {
            background: "#f59e0b",
            color: "#000",
        },
    });
};

// ℹ️ Info
export const showInfo = (message) => {
    toast(message, {
        icon: "ℹ️",
        style: {
            background: "#2563eb",
            color: "#fff",
        },
    });
};