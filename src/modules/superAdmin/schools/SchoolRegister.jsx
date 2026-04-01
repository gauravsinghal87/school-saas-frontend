import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { showError, showSuccess } from "../../../utils/toast";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import AppPhoneInput from "../../../components/common/PhoneInput";
import { createSchoolMutation, useSchoolList } from "../../../hooks/useQueryMutations";
import Textarea from "../../../components/common/Textarea";


const PHONE_REGEX = /^[6-9]\d{9}$/;

const rules = {
    name: {
        required: "School name is required",
        minLength: { value: 3, message: "Must be at least 3 characters" },
    },
    email: {
        required: "Email is required",
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email",
        },
    },

    address: {
        required: "Address is required",
        minLength: { value: 10, message: "Please enter a complete address" },
    },
    adminName: {
        required: "Admin name is required",
        minLength: { value: 2, message: "Must be at least 2 characters" },
    },
    adminEmail: {
        required: "Admin email is required",
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email",
        },
    },
    adminPhone: {
        required: "Admin phone is required",
        pattern: {
            value: PHONE_REGEX,
            message: "Enter a valid 10-digit mobile number",
        },
    },
};

function SectionHeader({ icon, title, subtitle }) {
    return (
        <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-xl flex-shrink-0">
                {icon}
            </div>
            <div>
                <h2 className="text-base font-bold text-[var(--color-text-heading)] leading-tight">
                    {title}
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{subtitle}</p>
            </div>
        </div>
    );
}


function SuccessScreen({ data, onReset }) {
    return (
        <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center text-4xl">
                🎉
            </div>

            <div>
                <h2 className="text-xl font-bold text-[var(--color-text-heading)]">
                    School Registered Successfully!
                </h2>
                <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                    <strong>{data.name}</strong> is now live on EduCore.
                </p>
            </div>

            <div className="w-full max-w-sm bg-[var(--color-surface-page)] rounded-2xl border border-[var(--color-border)] p-4 text-left space-y-3">
                {[
                    { label: "School Email", value: data.email },
                    { label: "Admin Name", value: data.adminName },
                    { label: "Admin Email", value: data.adminEmail },
                ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-3 text-sm">
                        <span className="text-[var(--color-text-secondary)]">{label}</span>
                        <span className="font-medium text-[var(--color-text-primary)] truncate">{value}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onReset}
                className="text-[var(--color-primary)] text-sm font-semibold hover:underline underline-offset-2"
            >
                ← Register another school
            </button>
        </div>
    );
}


export default function SchoolRegister() {
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(null);
    const { mutateAsync, isPending } = createSchoolMutation();
    const { data, isLoading, refetch } = useSchoolList();
    console.log("Schools list:", isLoading, data);
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({ mode: "onTouched" });


    const onSubmit = async (data) => {
        setLoading(isPending);
        try {
            await mutateAsync(data);
            showSuccess("School registered successfully 🎉");
            setRegistered(data);
            setTimeout(() => {
                setRegistered(null)
            }, 3000);
        } catch (err) {
            // no need to do much here, handled below
        } finally {
            setLoading(false);
        }
    };


    // const onSubmit = async (data) => {
    //     setLoading(true);
    //     try {
    //         await registerSchoolApi(data);
    //         showSuccess("School registered successfully!");
    //         setRegistered(data);
    //     } catch (err) {
    //         showError(err.message || "Registration failed. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <div className="min-h-screen bg-[var(--color-surface-page)] px-4 py-10 sm:py-14">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* ── Page heading ── */}
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-heading)]">
                        School Registration
                    </h1>

                </div>

                <Card>
                    {registered ? (
                        <SuccessScreen
                            data={registered}
                            onReset={() => { setRegistered(null); reset(); }}
                        />
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="space-y-8">

                                {/* ══════ SECTION 1 — School Info ══════ */}
                                <section>
                                    {/* <SectionHeader
                                        icon="🏛️"
                                        title="School Information"
                                        subtitle="Basic details about the institution"
                                    /> */}

                                    <div className="space-y-5">
                                        <Input
                                            label="School Name"
                                            name="name"
                                            placeholder="e.g. Mother World School"
                                            required
                                            error={errors.name?.message}
                                            {...register("name", rules.name)}
                                        />

                                        <Input
                                            label="School Email"
                                            name="email"
                                            type="email"
                                            placeholder="school@example.com"
                                            required
                                            error={errors.email?.message}
                                            {...register("email", rules.email)}
                                        />

                                        {/* PhoneInput uses Controller — it's not a native input */}
                                        <Controller
                                            name="phone"
                                            control={control}
                                            render={({ field }) => (
                                                <AppPhoneInput
                                                    label="School Phone"
                                                    name="phone"
                                                    value={field.value ?? ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    onBlur={field.onBlur}
                                                    required
                                                    error={errors.phone?.message}
                                                />
                                            )}
                                        />

                                        <Textarea
                                            label="School Address"
                                            name="address"
                                            placeholder="Full address including city, state and PIN code…"
                                            required
                                            error={errors.address?.message}
                                            {...register("address", rules.address)}
                                        />
                                    </div>
                                </section>

                                {/* Divider */}
                                <div className="border-t border-dashed border-[var(--color-border)]" />

                                {/* ══════ SECTION 2 — Admin Info ══════ */}
                                <section>
                                    {/* <SectionHeader
                                        icon="👤"
                                        title="Primary Admin Details"
                                        subtitle="This person will manage the school account"
                                    /> */}

                                    <div className="space-y-5">
                                        <Input
                                            label="Admin Full Name"
                                            name="adminName"
                                            placeholder="e.g. Dilip Kumar"
                                            required
                                            error={errors.adminName?.message}
                                            {...register("adminName", rules.adminName)}
                                        />

                                        <Input
                                            label="Admin Email"
                                            name="adminEmail"
                                            type="email"
                                            placeholder="admin@example.com"
                                            required
                                            error={errors.adminEmail?.message}
                                            {...register("adminEmail", rules.adminEmail)}
                                        />

                                        <Controller
                                            name="adminPhone"
                                            control={control}
                                            render={({ field }) => (
                                                <AppPhoneInput
                                                    label="Admin Phone"
                                                    name="adminPhone"
                                                    value={field.value ?? ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    onBlur={field.onBlur}
                                                    required
                                                    error={errors.adminPhone?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </section>

                                {/* ══════ ACTIONS ══════ */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <Button type="submit" loading={loading} className="flex-1">
                                        {loading ? "Registering…" : "Register School"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => reset()}
                                        disabled={loading}
                                    >
                                        Reset
                                    </Button>
                                </div>


                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
}