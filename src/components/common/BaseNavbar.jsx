// components/BaseNavbar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell, Settings, Search, X,
    Sun, Moon, Palette, LogOut,
    User, Menu, Laptop, Briefcase, BookOpen, Users as UsersIcon, Mail, Phone, MapPin, Calendar,
} from "lucide-react";
import { useTheme } from "../../context/ThemContext";
import { useUser } from "../../hooks/useUser";
import TeacherCheckInOUt from "../../modules/staff/TeacherCheckIn";

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

export function BaseNavbar({ onMenuClick }) {
    const navigate = useNavigate();
    const { logout, user } = useUser();
    const { themeId, setThemeId, isDark, COLOR_THEMES, themeMode, setThemeMode } = useTheme();

    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showPalette, setShowPalette] = useState(false);
    const [activeTheme, setActiveTheme] = useState("blue");

    const searchRef = useRef(null);
    const notifsRef = useRef(null);
    const profileRef = useRef(null);
    const paletteRef = useRef(null);

    // Scroll shadow
    useEffect(() => {
        const fn = () => setIsScrolled(window.scrollY > 8);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    // Close all dropdowns on outside click
    useEffect(() => {
        const fn = (e) => {
            if (notifsRef.current && !notifsRef.current.contains(e.target)) setShowNotifs(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
            if (paletteRef.current && !paletteRef.current.contains(e.target)) setShowPalette(false);
        };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    // Auto-focus mobile search
    useEffect(() => {
        if (searchOpen) searchRef.current?.focus();
    }, [searchOpen]);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const options = [
        { id: "light", label: "Light", icon: Sun },
        { id: "dark", label: "Dark", icon: Moon },
        { id: "system", label: "System", icon: Laptop },
    ];

    function applyTheme(themeId, isDark) {
        setThemeId(themeId);
        setThemeMode(isDark ? "dark" : "light");
    }

    const switchTheme = (id) => { setActiveTheme(id); applyTheme(id, isDark); };
    const toggleDark = () => { const next = !isDark; setThemeMode(next ? "dark" : "light"); applyTheme(themeId, next); };

    // Safely extract user information from the nested structure
    const getUserName = () => {
        if (user?.user?.name) return user.user.name;
        if (user?.name) return user.name;
        return "User";
    };

    const getUserEmail = () => {
        if (user?.user?.email) return user.user.email;
        if (user?.email) return user.email;
        if (user?.contact?.personal_email) return user.contact.personal_email;
        return "";
    };

    const getUserRole = () => {
        if (user?.role?.name) return user.role.name;
        if (user?.role) return user.role;
        return "STAFF";
    };

    const getUserPhone = () => {
        if (user?.user?.phone) return user.user.phone;
        if (user?.contact?.phone) return user.contact.phone;
        return "";
    };

    const getDesignation = () => user?.designation || "";
    const getClassTeacherOf = () => user?.classTeacherOf || [];

    const userName = getUserName();
    const userEmail = getUserEmail();
    const userRole = getUserRole();

    const designation = getDesignation();

    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const NOTIFS = [
        { id: 1, icon: "📝", title: "Unit Test 1 Marks Updated", time: "2 hrs ago", unread: true },
        { id: 2, icon: "💰", title: "Fee Payment Successful", time: "Jul 8", unread: false },
        { id: 3, icon: "📚", title: "New Study Material Added", time: "Jul 5", unread: false },
    ];
    const unreadCount = NOTIFS.filter((n) => n.unread).length;

    // ── shared icon-button style helpers ─────────────────────────────────────
    const iconBtn = (extraStyle = {}) => ({
        style: { color: "var(--color-text-secondary)", ...extraStyle },
        onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--color-text-secondary) 10%, transparent)"),
        onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = "transparent"),
    });

    return (
        <>
            <style>{`
                @keyframes dropIn {
                    from { opacity:0; transform:translateY(-6px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0) scale(1); }
                }
                .drop-in { animation: dropIn 0.16s ease both; }
            `}</style>

            <header
                className="sticky top-0 z-40 w-full transition-all duration-300"
                style={{
                    backgroundColor: isScrolled
                        ? "color-mix(in srgb, var(--color-surface-header) 92%, transparent)"
                        : "var(--color-surface-header)",
                    borderBottom: "1px solid var(--color-border)",
                    backdropFilter: isScrolled ? "blur(14px)" : "none",
                    boxShadow: isScrolled
                        ? "0 1px 16px color-mix(in srgb, var(--color-text-heading) 7%, transparent)"
                        : "none",
                }}
            >
                <div className="flex items-center gap-3 px-4 sm:px-6 h-[60px]">

                    {/* ── LEFT: Hamburger (mobile only) ── */}
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg lg:hidden transition-colors duration-150 flex-shrink-0"
                        {...iconBtn()}
                        aria-label="Toggle sidebar"
                    >
                        <Menu size={20} strokeWidth={2} />
                    </button>

                    {/* ── CENTRE: Search ── */}
                    <div className="flex-1 flex justify-start px-8">
                        {/* Desktop — always visible, fixed ~400px */}
                        <div
                            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 w-full"
                            style={{
                                maxWidth: "300px",
                                backgroundColor: "var(--color-surface-page)",
                                borderColor: "var(--color-border)",
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = "var(--color-primary)";
                                e.currentTarget.style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = "var(--color-border)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <Search size={14} strokeWidth={2} style={{ color: "var(--color-text-secondary)", flexShrink: 0 }} />
                            <input
                                type="text"
                                placeholder="Search classes and more…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent text-[13px] outline-none min-w-0"
                                style={{ color: "var(--color-text-primary)", fontFamily: "'DM Sans', sans-serif" }}
                            />
                        </div>

                        {/* Mobile — expands full-width when open */}
                        {searchOpen && (
                            <div
                                className="md:hidden flex items-center gap-2 px-3 py-[7px] rounded-xl border w-full"
                                style={{
                                    backgroundColor: "var(--color-surface-page)",
                                    borderColor: "var(--color-primary)",
                                    boxShadow: "0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)",
                                }}
                            >
                                <Search size={14} strokeWidth={2} style={{ color: "var(--color-text-secondary)" }} />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    placeholder="Search…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-[13px] outline-none"
                                    style={{ color: "var(--color-text-primary)", fontFamily: "'DM Sans', sans-serif" }}
                                />
                                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                                    <X size={13} style={{ color: "var(--color-text-secondary)" }} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Icons only ── */}
                    <div className="flex items-center lg:gap-6 flex-shrink-0">
                        <TeacherCheckInOUt />

                        {/* Mobile search toggle */}
                        {!searchOpen && (
                            <button
                                className="p-2 rounded-lg md:hidden transition-colors duration-150"
                                onClick={() => setSearchOpen(true)}
                                aria-label="Search"
                                {...iconBtn()}
                            >
                                <Search size={18} strokeWidth={2} />
                            </button>
                        )}

                        {/* Dark mode */}
                        <button
                            className="p-2 rounded-lg transition-all duration-200"
                            onClick={toggleDark}
                            title={isDark ? "Light mode" : "Dark mode"}
                            {...iconBtn()}
                        >
                            {isDark
                                ? <Sun size={18} strokeWidth={2} style={{ color: "var(--color-warning)" }} />
                                : <Moon size={18} strokeWidth={2} />
                            }
                        </button>

                        {/* ── Colour palette ── */}
                        <div className="relative" ref={paletteRef}>
                            <button
                                className="p-2 rounded-lg transition-all duration-200"
                                onClick={() => { setShowPalette(!showPalette); setShowNotifs(false); setShowProfile(false); }}
                                title="Theme color"
                                {...iconBtn()}
                            >
                                <div className="relative">
                                    <Palette size={18} strokeWidth={2} />
                                    <div
                                        className="absolute -bottom-[2px] -right-[2px] w-[8px] h-[8px] rounded-full border-2"
                                        style={{
                                            backgroundColor: "var(--color-primary)",
                                            borderColor: "var(--color-surface-header)",
                                        }}
                                    />
                                </div>
                            </button>

                            {showPalette && (
                                <div
                                    className="drop-in absolute right-0 mt-2 w-[264px] rounded-2xl border overflow-hidden z-50"
                                    style={{
                                        backgroundColor: "var(--color-surface-card)",
                                        borderColor: "var(--color-border)",
                                        boxShadow: "0 10px 30px color-mix(in srgb, var(--color-text-heading) 14%, transparent)",
                                    }}
                                >
                                    <div
                                        className="flex items-center justify-between px-4 py-[10px] border-b"
                                        style={{ borderColor: "var(--color-border)" }}
                                    >
                                        <span
                                            className="text-[11px] font-bold uppercase tracking-[1px]"
                                            style={{ color: "var(--color-text-secondary)" }}
                                        >
                                            Accent Colour
                                        </span>
                                        <span
                                            className="text-[10px] font-semibold px-2 py-[2px] rounded-full"
                                            style={{
                                                backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                                                color: "var(--color-primary)",
                                            }}
                                        >
                                            {COLOR_THEMES.find((t) => t.id === activeTheme)?.label}
                                        </span>
                                    </div>

                                    <div className="p-3 grid grid-cols-5 gap-[6px]">
                                        {COLOR_THEMES.map((t) => {
                                            const isActive = activeTheme === t.id;
                                            return (
                                                <button
                                                    key={t.id}
                                                    onClick={() => switchTheme(t.id)}
                                                    title={t.label}
                                                    className="flex flex-col items-center gap-[5px] py-[7px] rounded-xl transition-all duration-150"
                                                    style={{
                                                        backgroundColor: isActive
                                                            ? "color-mix(in srgb, var(--color-primary) 10%, transparent)"
                                                            : "transparent",
                                                        outline: isActive
                                                            ? `2px solid var(--color-primary)`
                                                            : "2px solid transparent",
                                                        outlineOffset: "0px",
                                                    }}
                                                >
                                                    <div
                                                        className="w-[22px] h-[22px] rounded-full shadow-sm"
                                                        style={{ backgroundColor: t.primary }}
                                                    />
                                                    <span
                                                        className="text-[9px] font-medium leading-none"
                                                        style={{
                                                            color: isActive
                                                                ? "var(--color-primary)"
                                                                : "var(--color-text-secondary)",
                                                        }}
                                                    >
                                                        {t.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 p-4">
                                        {options.map((opt) => {
                                            const Icon = opt.icon;
                                            const active = themeMode === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setThemeMode(opt.id)}
                                                    className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl transition-all"
                                                    style={{
                                                        backgroundColor: active
                                                            ? "color-mix(in srgb, var(--color-primary) 10%, transparent)"
                                                            : "transparent",
                                                        color: active
                                                            ? "var(--color-primary)"
                                                            : "var(--color-text-secondary)",
                                                        border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
                                                    }}
                                                >
                                                    <Icon size={20} />
                                                    <span className="text-xs">{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Notifications ── */}
                        <div className="relative" ref={notifsRef}>
                            <button
                                className="p-2 rounded-lg transition-all duration-200 relative"
                                onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); setShowPalette(false); }}
                                aria-label="Notifications"
                                {...iconBtn()}
                            >
                                <Bell size={18} strokeWidth={2} />
                                {unreadCount > 0 && (
                                    <span
                                        className="absolute top-[6px] right-[6px] w-[8px] h-[8px] rounded-full border-2"
                                        style={{
                                            backgroundColor: "var(--color-error)",
                                            borderColor: "var(--color-surface-header)",
                                        }}
                                    />
                                )}
                            </button>

                            {showNotifs && (
                                <div
                                    className="drop-in absolute right-0 mt-2 w-[320px] rounded-2xl border overflow-hidden z-50"
                                    style={{
                                        backgroundColor: "var(--color-surface-card)",
                                        borderColor: "var(--color-border)",
                                        boxShadow: "0 10px 30px color-mix(in srgb, var(--color-text-heading) 12%, transparent)",
                                    }}
                                >
                                    <div
                                        className="flex items-center justify-between px-4 py-[11px] border-b"
                                        style={{ borderColor: "var(--color-border)" }}
                                    >
                                        <span className="text-[13px] font-semibold" style={{ color: "var(--color-text-heading)" }}>
                                            Notifications
                                        </span>
                                        <span
                                            className="text-[11px] font-semibold px-2 py-[2px] rounded-full"
                                            style={{
                                                backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                                                color: "var(--color-primary)",
                                            }}
                                        >
                                            {unreadCount} new
                                        </span>
                                    </div>
                                    <div className="max-h-[280px] overflow-y-auto">
                                        {NOTIFS.map((n) => (
                                            <div
                                                key={n.id}
                                                className="flex items-start gap-3 px-4 py-3 border-b last:border-0 cursor-pointer transition-colors duration-150"
                                                style={{
                                                    borderColor: "var(--color-border)",
                                                    backgroundColor: n.unread
                                                        ? "color-mix(in srgb, var(--color-primary) 5%, transparent)"
                                                        : "transparent",
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--color-text-secondary) 6%, transparent)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = n.unread
                                                    ? "color-mix(in srgb, var(--color-primary) 5%, transparent)"
                                                    : "transparent"
                                                )}
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                                                    style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}
                                                >
                                                    {n.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
                                                        {n.title}
                                                    </p>
                                                    <p className="text-[11px] mt-[2px]" style={{ color: "var(--color-text-secondary)" }}>
                                                        {n.time}
                                                    </p>
                                                </div>
                                                {n.unread && (
                                                    <div
                                                        className="w-2 h-2 rounded-full flex-shrink-0 mt-[5px]"
                                                        style={{ backgroundColor: "var(--color-primary)" }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        className="px-4 py-[10px] border-t text-center"
                                        style={{ borderColor: "var(--color-border)" }}
                                    >
                                        <button
                                            className="text-[12px] font-medium"
                                            style={{ color: "var(--color-primary)" }}
                                        >
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── User Profile Dropdown ── */}
                        <div className="relative ml-[2px]" ref={profileRef}>
                            <button
                                onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); setShowPalette(false); }}
                                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 flex-shrink-0"
                                style={{
                                    background: "linear-gradient(135deg, var(--color-primary), var(--color-info))",
                                    color: "var(--color-surface-card)",
                                    fontWeight: 700,
                                    fontSize: "12px",
                                    boxShadow: showProfile
                                        ? "0 0 0 3px color-mix(in srgb, var(--color-primary) 25%, transparent)"
                                        : "none",
                                    transition: "box-shadow 0.2s ease",
                                }}
                                aria-label="User menu"
                            >
                                {initials}
                            </button>

                            {showProfile && (
                                <div
                                    className="drop-in absolute right-0 mt-2 w-[320px] rounded-2xl border overflow-hidden z-50"
                                    style={{
                                        backgroundColor: "var(--color-surface-card)",
                                        borderColor: "var(--color-border)",
                                        boxShadow: "0 10px 30px color-mix(in srgb, var(--color-text-heading) 12%, transparent)",
                                    }}
                                >
                                    {/* User info header */}
                                    <div
                                        className="flex items-center gap-3 px-4 py-4 border-b"
                                        style={{ borderColor: "var(--color-border)" }}
                                    >
                                        <div
                                            className="h-12 w-12 rounded-xl flex items-center justify-center font-bold text-[16px] flex-shrink-0"
                                            style={{
                                                background: "linear-gradient(135deg, var(--color-primary), var(--color-info))",
                                                color: "var(--color-surface-card)",
                                            }}
                                        >
                                            {initials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[14px] font-bold truncate" style={{ color: "var(--color-text-heading)" }}>
                                                {userName}
                                            </p>
                                            <p className="text-[11px] truncate mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                                                {userEmail}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                                    style={{
                                                        backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                                                        color: "var(--color-primary)",
                                                    }}
                                                >
                                                    {userRole}
                                                </span>
                                                {designation && (
                                                    <span
                                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                                        style={{
                                                            backgroundColor: "color-mix(in srgb, var(--color-info) 10%, transparent)",
                                                            color: "var(--color-info)",
                                                        }}
                                                    >
                                                        {designation}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats - Teacher Info */}




                                    {/* Menu items */}
                                    <div className="p-2">
                                        {[
                                            { label: "My Profile", Icon: User, path: "/staff/profile" },
                                            { label: "Settings", Icon: Settings, path: "/settings" },
                                        ].map(({ label, Icon, path }) => (
                                            <button
                                                key={label}
                                                onClick={() => { navigate(path); setShowProfile(false); }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150"
                                                style={{ color: "var(--color-text-primary)" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--color-text-secondary) 8%, transparent)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                            >
                                                <Icon size={16} strokeWidth={2} style={{ color: "var(--color-text-secondary)" }} />
                                                {label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Logout */}
                                    <div className="p-2 border-t" style={{ borderColor: "var(--color-border)" }}>
                                        <button
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150"
                                            style={{ color: "var(--color-error)" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--color-error) 8%, transparent)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={16} strokeWidth={2} style={{ color: "var(--color-error)" }} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default BaseNavbar;