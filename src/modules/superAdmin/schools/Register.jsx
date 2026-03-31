import { useState } from "react";
import { useForm } from "react-hook-form";
import { schoolValidation } from "../../../utils/validation";
import MobileField from "../../../components/common/MobileField";
import InputField from "../../../components/common/InputField";
import SubmitButton from "../../../components/common/Button";
import TextAreaField from "../../../components/common/Textarea";
import { showError } from "../../../utils/toast";




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
    const [registeredData, setRegisteredData] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ mode: "onTouched" });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await registerSchool(data);
            setRegisteredData(data);
            setTimeout(() => {
                setRegisteredData(null)
            }, 3000);
        } catch (err) {
            showError('Registration failed. Please try again.')
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
            {/* Card */}
            <div className="mx-auto w-full max-w-5xl bg-surface-card rounded-3xl border border-border shadow-sm overflow-hidden">

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

                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="px-6 sm:px-10 py-8">
                    {registeredData ? (
                        <SuccessScreen data={registeredData} onReset={handleReset} />
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

                            {/* ─── Section 1: School Info ─── */}
                            <section>

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

                            <section>

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
