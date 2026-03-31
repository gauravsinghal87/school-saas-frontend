const PHONE_REGEX = /^[6-9]\d{9}$/;

export const schoolValidation = {
    name: {
        required: "School name is required",
        minLength: { value: 3, message: "Must be at least 3 characters" },
        maxLength: { value: 100, message: "Must be under 100 characters" },
    },
    email: {
        required: "School email is required",
        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
    },
    phone: {
        required: "School phone is required",
        pattern: { value: PHONE_REGEX, message: "Enter a valid 10-digit Indian mobile number" },
    },
    address: {
        required: "Address is required",
        minLength: { value: 10, message: "Please provide a complete address" },
    },
};
