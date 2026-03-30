import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../hooks/useQueryMutations";
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { ROLES } from "../utils/roles";



const ROLE_ROUTES = {
    [ROLES.SUPER_ADMIN]: "/super-admin/dashboard",
    [ROLES.SCHOOL_ADMIN]: "/school-admin/dashboard",
    [ROLES.STUDENT]: "/student/dashboard",
    [ROLES.PARENT]: "/parent/dashboard",
    [ROLES.STAFF]: "/staff/dashboard",
};

const Login = () => {
    const navigate = useNavigate();
    const { mutate, isPending, isError, error } = useLoginMutation();

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate(form, {
            onSuccess: (res) => {
                const role = res?.user?.role;
                const route = ROLE_ROUTES[role];
                if (route) navigate(route);
            },
        });
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "var(--color-surface-sidebar)" }}>

            {/* Left Panel — Brand */}
            <div
                className="hidden lg:flex flex-col justify-between w-[42%] p-12 relative overflow-hidden"
                style={{ backgroundColor: "var(--color-surface-sidebar)" }}
            >
                {/* Geometric background accents */}
                <div
                    className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-5"
                    style={{ backgroundColor: "var(--color-primary)" }}
                />
                <div
                    className="absolute bottom-32 -right-16 w-64 h-64 rounded-full opacity-5"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03] border-2"
                    style={{ borderColor: "var(--color-primary)" }}
                />

                {/* Logo */}
                <div className="flex items-center gap-3 relative z-10">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: "var(--color-primary)" }}
                    >
                        <GraduationCap size={20} color="white" />
                    </div>
                    <span
                        className="text-xl font-bold tracking-tight"
                        style={{
                            fontFamily: "'Montserrat', sans-serif",
                            color: "var(--color-sidebar-text)",
                        }}
                    >
                        EduCore
                    </span>
                </div>

                {/* Center quote */}
                <div className="relative z-10">
                    <p
                        className="text-5xl font-light leading-tight mb-6"
                        style={{
                            fontFamily: "'Merriweather', serif",
                            color: "var(--color-sidebar-text)",
                            opacity: 0.9,
                        }}
                    >
                        Empowering every
                        <span
                            className="block font-bold"
                            style={{ color: "var(--color-primary)" }}
                        >
                            school.
                        </span>
                    </p>
                    <p
                        className="text-sm leading-relaxed max-w-xs"
                        style={{
                            color: "var(--color-text-secondary)",
                            fontFamily: "'Merriweather', serif",
                            fontWeight: 300,
                        }}
                    >
                        A unified platform for administrators, teachers, students, and parents — all in one place.
                    </p>
                </div>

                {/* Footer note */}
                <p
                    className="text-xs relative z-10"
                    style={{ color: "var(--color-text-secondary)", opacity: 0.5 }}
                >
                    © {new Date().getFullYear()} EduCore. All rights reserved.
                </p>
            </div>

            {/* Right Panel — Form */}
            <div
                className="flex-1 flex items-center justify-center p-6"
                style={{ backgroundColor: "var(--color-surface-page)" }}
            >
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "var(--color-primary)" }}
                        >
                            <GraduationCap size={16} color="white" />
                        </div>
                        <span
                            className="text-lg font-bold"
                            style={{
                                fontFamily: "'Montserrat', sans-serif",
                                color: "var(--color-text-heading)",
                            }}
                        >
                            EduCore
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="mb-10">
                        <h1
                            className="text-3xl font-extrabold mb-2"
                            style={{
                                fontFamily: "'Montserrat', sans-serif",
                                color: "var(--color-text-heading)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Welcome back
                        </h1>
                        <p
                            className="text-sm"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Sign in to access your portal
                        </p>
                    </div>

                    {/* Error Banner */}
                    {isError && (
                        <div
                            className="flex items-start gap-3 p-4 rounded-xl mb-6 border"
                            style={{
                                backgroundColor: "#FEF2F2",
                                borderColor: "#FECACA",
                            }}
                        >
                            <AlertCircle
                                size={16}
                                className="mt-0.5 shrink-0"
                                style={{ color: "var(--color-error)" }}
                            />
                            <p
                                className="text-sm"
                                style={{ color: "var(--color-error)" }}
                            >
                                {error?.message || "Invalid credentials. Please try again."}
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label
                                className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                                style={{
                                    color: "var(--color-text-secondary)",
                                    fontFamily: "'Montserrat', sans-serif",
                                }}
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <span
                                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{ color: "var(--color-text-secondary)" }}
                                >
                                    <Mail size={16} />
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@school.edu"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all border"
                                    style={{
                                        backgroundColor: "var(--color-surface-card)",
                                        borderColor: "var(--color-border)",
                                        color: "var(--color-text-primary)",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "var(--color-primary)";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "var(--color-border)";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                                style={{
                                    color: "var(--color-text-secondary)",
                                    fontFamily: "'Montserrat', sans-serif",
                                }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <span
                                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{ color: "var(--color-text-secondary)" }}
                                >
                                    <Lock size={16} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-11 pr-12 py-3 rounded-xl text-sm outline-none transition-all border"
                                    style={{
                                        backgroundColor: "var(--color-surface-card)",
                                        borderColor: "var(--color-border)",
                                        color: "var(--color-text-primary)",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "var(--color-primary)";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "var(--color-border)";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                                    style={{ color: "var(--color-text-secondary)" }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-xs font-medium transition-colors"
                                style={{ color: "var(--color-primary)" }}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex items-center hover:bg-primary  justify-center gap-2 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all mt-2"
                            style={{
                                fontFamily: "'Montserrat', sans-serif",
                                backgroundColor: isPending
                                    ? "var(--color-border)"
                                    : "var(--color-button-primary)",
                                color: isPending
                                    ? "var(--color-text-secondary)"
                                    : "var(--color-button-primary-text)",
                                cursor: isPending ? "not-allowed" : "pointer",
                            }}
                            onMouseEnter={(e) => {
                                if (!isPending)
                                    e.currentTarget.style.backgroundColor =
                                        "var(--color-button-primary-hover)";
                            }}
                            onMouseLeave={(e) => {
                                if (!isPending)
                                    e.currentTarget.style.backgroundColor =
                                        "var(--color-button-primary)";
                            }}
                        >
                            {isPending ? (
                                <>
                                    <span
                                        className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                                        style={{ borderColor: "var(--color-text-secondary)" }}
                                    />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Help text */}
                    <p
                        className="text-xs text-center mt-8"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        Having trouble?{" "}
                        <button
                            type="button"
                            className="font-semibold"
                            style={{ color: "var(--color-primary)" }}
                        >
                            Contact your administrator
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;