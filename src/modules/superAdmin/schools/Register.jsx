import { useState } from "react";
import { useForm } from "react-hook-form";
import { schoolValidation } from "../../../utils/validation";
import MobileField from "../../../components/common/MobileField";
import InputField from "../../../components/common/InputField";

// ─────────────────────────────────────────────
// COMMON COMPONENTS  (Single Responsibility)
// ─────────────────────────────────────────────

/** Textarea field */
function TextAreaField({ label, id, placeholder, register, error, required, rows = 3 }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-semibold text-text-primary">
                {label}
                {required && <span className="text-error ml-0.5">*</span>}
            </label>
            <textarea
                id={id}
                rows={rows}
                placeholder={placeholder}
                {...register}
                className={`
          w-full rounded-xl border bg-surface-card px-4 py-2.5 text-sm text-text-primary
          placeholder:text-text-secondary resize-none
          outline-none transition-all duration-200
          focus:ring-2 focus:ring-primary/30 focus:border-primary
          ${error ? "border-error focus:ring-error/30 focus:border-error" : "border-border"}
        `}
            />
            {error && (
                <p className="flex items-center gap-1 text-xs text-error font-medium">
                    <span>⚠</span> {error.message}
                </p>
            )}
        </div>
    );
}

/** Section header with divider */
function SectionHeader({ icon, title, subtitle }) {
    return (
        <div className="flex items-start gap-3 mb-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                {icon}
            </div>
            <div>
                <h2 className="text-base font-bold text-text-heading leading-tight">{title}</h2>
                <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
            </div>
        </div>
    );
}

/** Submit / primary button with loading spinner */
function SubmitButton({ loading, label = "Submit", loadingLabel = "Submitting…" }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="
        w-full flex items-center justify-center gap-2
        rounded-xl bg-button-primary hover:bg-button-primary-hover
        text-button-primary-text font-semibold text-sm
        px-6 py-3 transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        shadow-sm hover:shadow-md active:scale-[0.98]
      "
        >
            {loading ? (
                <>
                    <Spinner />
                    {loadingLabel}
                </>
            ) : (
                label
            )}
        </button>
    );
}

/** Inline SVG spinner */
function Spinner() {
    return (
        <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>
    );
}

/** Toast notification */
function Toast({ type, message, onClose }) {
    if (!message) return null;
    const styles = {
        success: "bg-success text-white",
        error: "bg-error text-white",
    };
    return (
        <div
            className={`
        fixed top-5 right-5 z-50 flex items-center gap-3
        px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold
        max-w-sm animate-fade-in-down
        ${styles[type] || styles.error}
      `}
        >
            <span>{type === "success" ? "✓" : "✕"}</span>
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="opacity-70 hover:opacity-100 ml-2 text-base leading-none">×</button>
        </div>
    );
}

/** Success screen shown after registration */
function SuccessScreen({ data, onReset }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center text-4xl animate-bounce-once">
                🎉
            </div>
            <div>
                <h2 className="text-xl font-bold text-text-heading">School Registered!</h2>
                <p className="text-text-secondary text-sm mt-1">
                    <strong>{data.name}</strong> has been successfully registered on EduCore.
                </p>
            </div>
            <div className="w-full max-w-sm bg-surface-page rounded-2xl border border-border p-4 text-left space-y-2 text-sm">
                <Detail label="School Email" value={data.email} />
                <Detail label="Admin" value={data.adminName} />
                <Detail label="Admin Email" value={data.adminEmail} />
            </div>
            <button
                onClick={onReset}
                className="text-primary text-sm font-semibold hover:underline underline-offset-2"
            >
                ← Register another school
            </button>
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div className="flex justify-between gap-2">
            <span className="text-text-secondary">{label}</span>
            <span className="font-medium text-text-primary truncate">{value}</span>
        </div>
    );
}

// ─────────────────────────────────────────────
// VALIDATION RULES  (Open/Closed — extend without touching fields)
// ─────────────────────────────────────────────
const PHONE_REGEX = /^[6-9]\d{9}$/;


const adminValidation = {
    adminName: {
        required: "Admin name is required",
        minLength: { value: 2, message: "Must be at least 2 characters" },
    },
    adminEmail: {
        required: "Admin email is required",
        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
    },
    adminPhone: {
        required: "Admin phone is required",
        pattern: { value: PHONE_REGEX, message: "Enter a valid 10-digit Indian mobile number" },
    },
};

// ─────────────────────────────────────────────
// API SERVICE  (Dependency Inversion — swap easily)
// ─────────────────────────────────────────────
async function registerSchool(payload) {
    // Simulate API call — replace with real endpoint
    await new Promise((r) => setTimeout(r, 1800));
    // Simulate occasional error for demo
    if (payload.email.includes("fail")) throw new Error("Email domain is not allowed.");
    return { success: true, id: "SCH-" + Date.now() };
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function SchoolRegisterPage() {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [registeredData, setRegisteredData] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ mode: "onTouched" });

    const onSubmit = async (data) => {
        setLoading(true);
        setToast(null);
        try {
            await registerSchool(data);
            setRegisteredData(data);
        } catch (err) {
            setToast({ type: "error", message: err.message || "Registration failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setRegisteredData(null);
        reset();
    };

    return (
        <div className="min-h-screen bg-surface-page font-[Merriweather,serif] px-4 py-10 sm:py-14">
            {/* Toast */}
            <Toast
                type={toast?.type}
                message={toast?.message}
                onClose={() => setToast(null)}
            />

            {/* Card */}
            <div className="mx-auto w-full max-w-2xl bg-surface-card rounded-3xl border border-border shadow-sm overflow-hidden">

                {/* ── Header ── */}
                <div className="bg-primary px-6 py-8 sm:px-10 text-white relative overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
                    <div className="absolute bottom-0 left-1/2 w-60 h-16 rounded-full bg-white/5 -translate-x-1/2" />

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl flex-shrink-0">
                            🏫
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold font-[Montserrat,sans-serif] tracking-tight leading-tight">
                                School Registration
                            </h1>
                            <p className="text-white/70 text-xs mt-0.5">
                                Register your institution on EduCore — takes under 2 minutes.
                            </p>
                        </div>
                    </div>

                    {/* Progress indicator */}
                    {!registeredData && (
                        <div className="relative z-10 mt-6 flex gap-2">
                            <Step n="1" label="School Info" active />
                            <div className="flex-1 self-center h-px bg-white/20 mx-1" />
                            <Step n="2" label="Admin Info" />
                        </div>
                    )}
                </div>

                {/* ── Body ── */}
                <div className="px-6 sm:px-10 py-8">
                    {registeredData ? (
                        <SuccessScreen data={registeredData} onReset={handleReset} />
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

                            {/* ─── Section 1: School Info ─── */}
                            <section>
                                <SectionHeader
                                    icon="🏛️"
                                    title="School Information"
                                    subtitle="Basic details about the institution"
                                />
                                <div className="space-y-4">
                                    <InputField
                                        label="School Name"
                                        id="name"
                                        placeholder="e.g. Mother World School"
                                        required
                                        register={register("name", schoolValidation.name)}
                                        error={errors.name}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField
                                            label="School Email"
                                            id="email"
                                            type="email"
                                            placeholder="school@example.com"
                                            required
                                            register={register("email", schoolValidation.email)}
                                            error={errors.email}
                                        />
                                        <MobileField
                                            label="School Phone"
                                            id="phone"
                                            required
                                            register={register("phone", schoolValidation.phone)}
                                            error={errors.phone}
                                        />
                                    </div>

                                    <TextAreaField
                                        label="School Address"
                                        id="address"
                                        placeholder="Full address including city, state and PIN code…"
                                        required
                                        rows={3}
                                        register={register("address", schoolValidation.address)}
                                        error={errors.address}
                                    />
                                </div>
                            </section>

                            {/* Divider */}
                            <div className="border-t border-border border-dashed" />

                            {/* ─── Section 2: Admin Info ─── */}
                            <section>
                                <SectionHeader
                                    icon="👤"
                                    title="Primary Admin Details"
                                    subtitle="This person will manage the school account"
                                />
                                <div className="space-y-4">
                                    <InputField
                                        label="Admin Full Name"
                                        id="adminName"
                                        placeholder="e.g. Dilip Kumar"
                                        required
                                        register={register("adminName", adminValidation.adminName)}
                                        error={errors.adminName}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField
                                            label="Admin Email"
                                            id="adminEmail"
                                            type="email"
                                            placeholder="admin@example.com"
                                            required
                                            register={register("adminEmail", adminValidation.adminEmail)}
                                            error={errors.adminEmail}
                                        />
                                        <MobileField
                                            label="Admin Phone"
                                            id="adminPhone"
                                            required
                                            register={register("adminPhone", adminValidation.adminPhone)}
                                            error={errors.adminPhone}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ─── Submit ─── */}
                            <div className="pt-2 space-y-3">
                                <SubmitButton
                                    loading={loading}
                                    label="Register School"
                                    loadingLabel="Registering…"
                                />
                                <p className="text-center text-xs text-text-secondary">
                                    By registering, you agree to EduCore's{" "}
                                    <a href="#" className="text-primary underline underline-offset-2">Terms of Service</a>{" "}
                                    and{" "}
                                    <a href="#" className="text-primary underline underline-offset-2">Privacy Policy</a>.
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// TINY HELPERS
// ─────────────────────────────────────────────
function Step({ n, label, active }) {
    return (
        <div className="flex items-center gap-1.5">
            <span
                className={`
          w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center
          ${active ? "bg-white text-primary" : "bg-white/20 text-white"}
        `}
            >
                {n}
            </span>
            <span className={`text-xs font-medium ${active ? "text-white" : "text-white/50"}`}>
                {label}
            </span>
        </div>
    );
}