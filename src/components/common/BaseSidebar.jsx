// components/sidebar/Sidebar.jsx
import React, { useState } from "react";
import { LogOut, ChevronRight, LayoutDashboard, School, CreditCard, Users, UserCircle, Calendar, DollarSign, FileText, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROLE_ROUTES, ROLE_ROUTES_SIDEBAR, ROLES } from "../../utils/roles";
import { useUser } from "../../context/UserContext";

// ─── ICON MAPPING ──────────────────────────────────────────────────────────────


// ─── ROLE CONFIG ──────────────────────────────────────────────────────────────

const ROLE_META = {
    [ROLES.SUPER_ADMIN]: {
        dashboardPath: "/super-admin/dashboard",
        fallbackInitials: "SA",
        roleLabel: (user) => `${user?.email || "super@admin.com"}`,
        badgeBg: "color-mix(in srgb, var(--color-secondary) 18%, transparent)",
        badgeColor: "var(--color-secondary)",
        displayName: "Super Admin",
    },
    [ROLES.SCHOOL_ADMIN]: {
        dashboardPath: "/school-admin/dashboard",
        fallbackInitials: "SA",
        roleLabel: (user) => `${user?.school || "School Admin"} · ${user?.employeeId || "ADM001"}`,
        badgeBg: "color-mix(in srgb, var(--color-secondary) 18%, transparent)",
        badgeColor: "var(--color-secondary)",
        displayName: "School Admin",
    },
    [ROLES.STAFF]: {
        dashboardPath: "/staff/dashboard",
        fallbackInitials: "ST",
        roleLabel: (user) => `${user?.designation || "Staff"} · ${user?.employeeId || "STF001"}`,
        badgeBg: "color-mix(in srgb, var(--color-info) 18%, transparent)",
        badgeColor: "var(--color-info)",
        displayName: "Staff",
    },
    [ROLES.STUDENT]: {
        dashboardPath: "/student/dashboard",
        fallbackInitials: "ST",
        roleLabel: (user) => `${user?.class || "Class 6A"} · ${user?.admissionNo || "ADM001"}`,
        badgeBg: "color-mix(in srgb, var(--color-primary) 18%, transparent)",
        badgeColor: "var(--color-primary)",
        displayName: "Student",
    },
    [ROLES.PARENT]: {
        dashboardPath: "/parent/dashboard",
        fallbackInitials: "PR",
        roleLabel: (user) => `${user?.childName || "Parent"} · ${user?.phone || "PAR001"}`,
        badgeBg: "color-mix(in srgb, var(--color-success) 18%, transparent)",
        badgeColor: "var(--color-success)",
        displayName: "Parent",
    },
};

// ─── STYLES ───────────────────────────────────────────────────────────────────

const INJECTED_CSS = `
  /* ── Branded thin scrollbar ── */
  .sidebar-scroll {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--color-primary) 40%, transparent) transparent;
  }
  .sidebar-scroll::-webkit-scrollbar       { width: 3px; }
  .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
  .sidebar-scroll::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--color-primary) 40%, transparent);
    border-radius: 99px;
  }
  .sidebar-scroll::-webkit-scrollbar-thumb:hover {
    background: var(--color-primary);
  }

  /* ── Active right-edge indicator ── */
  .nav-active-item {
    position: relative;
  }
  .nav-active-item::after {
    content: '';
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    min-height: 18px;
    border-radius: 99px 0 0 99px;
    background: var(--color-primary);
    box-shadow: 0 0 8px color-mix(in srgb, var(--color-primary) 60%, transparent);
    pointer-events: none;
  }
`;

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

const Sidebar = ({
    role: roleProp,
    activeItem,
    onItemClick,
    isOpen,
    onClose,
    user,
    menuConfig  // Allow custom menu config to be passed
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useUser();
    const role = roleProp || localStorage.getItem("role") || ROLES.STAFF;
    const meta = ROLE_META[role] ?? ROLE_META[ROLES.STAFF];

    // Get menu items for the role
    const menuItems = menuConfig[role] || [];

    console.log('itemmm>>', menuItems)
    const sections = {
        main: menuItems.slice(0, 3),
        secondary: menuItems.slice(3),
    };

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };


    const [expanded, setExpanded] = useState({ main: true, secondary: true });
    const toggle = (s) => setExpanded((p) => ({ ...p, [s]: !p[s] }));

    const goTo = (path, id) => {
        const fullPath = `${ROLE_ROUTES_SIDEBAR[role]}/${path}`;
        navigate(fullPath);
        onItemClick?.(id);
        if (isOpen) onClose?.();
    };

    const initials = user?.initials || meta.fallbackInitials;
    const displayName = user?.name || meta.displayName;
    const roleLabel = meta.roleLabel(user);

    // Check if a menu item is active
    const isActivePath = (path) => {
        return location.pathname.split("/").includes(path);
    };

    const NavItem = ({ item, index }) => {

        const Icon = item?.icon
        const isActive = isActivePath(item.path);
        return (
            <button
                onClick={() => goTo(item.path, item.name)}
                className={`w-full flex items-center justify-between px-3 py-[9px] rounded-xl mb-[2px] transition-all duration-200 cursor-pointer overflow-visible ${isActive ? "nav-active-item" : ""}`}
                style={{
                    backgroundColor: isActive
                        ? "var(--color-sidebar-active)"
                        : "transparent",
                    color: isActive
                        ? "var(--color-sidebar-text-active)"
                        : "var(--color-sidebar-text)",
                }}
                onMouseEnter={(e) => {
                    if (!isActive) {
                        e.currentTarget.style.backgroundColor = "var(--color-sidebar-hover)";
                        e.currentTarget.style.color = "var(--color-sidebar-text-hover)";
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--color-sidebar-text)";
                    }
                }}
            >
                <div className="flex items-center gap-[10px] min-w-0">
                    <div
                        className="w-[30px] h-[30px] rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                        style={{
                            backgroundColor: isActive
                                ? "color-mix(in srgb, var(--color-primary) 14%, transparent)"
                                : "var(--color-sidebar-hover)",
                        }}
                    >
                        <Icon
                            size={15}
                            strokeWidth={isActive ? 2.2 : 1.8}
                            style={{
                                color: isActive ? "var(--color-primary)" : "var(--color-sidebar-text)",
                            }}
                        />
                    </div>

                    <span className={`truncate  ${isActive ? 'text-primary' : 'text-sidebar-text'} text-[13px] font-medium`}>{item.name}</span>
                </div>
            </button >
        );
    };

    // ── Section ─────────────────────────────────────────────────────────────────

    const Section = ({ title, items, sectionId }) => {

        if (!items || items.length === 0) return null;
        return (
            <div className="mb-3">
                <button
                    onClick={() => toggle(sectionId)}
                    className="flex items-center justify-between w-full px-3 py-[6px] rounded-lg mb-1 transition-colors duration-150"
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "var(--color-sidebar-hover)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                    }
                >
                    <span
                        className="text-[10px] font-bold uppercase tracking-[1.1px]"
                        style={{ color: "color-mix(in srgb, var(--color-sidebar-text) 50%, transparent)" }}
                    >
                        {title}
                    </span>
                    <ChevronRight
                        size={13}
                        strokeWidth={2.5}
                        className="flex-shrink-0"
                        style={{
                            transform: expanded[sectionId] ? "rotate(90deg)" : "rotate(0deg)",
                            transition: "transform 0.25s ease",
                            color: "color-mix(in srgb, var(--color-sidebar-text) 50%, transparent)",
                        }}
                    />
                </button>

                <div
                    style={{
                        overflow: "",
                        maxHeight: expanded[sectionId] ? `${items.length * 46}px` : "0px",
                        opacity: expanded[sectionId] ? 1 : 0,
                        transition: "max-height 0.28s ease, opacity 0.2s ease",
                    }}
                >
                    {items.map((item, idx) => (
                        <NavItem key={item.path} item={item} index={idx} />
                    ))}
                </div>
            </div>
        );
    };

    // ── Render ───────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Inject scrollbar + indicator styles once */}
            <style>{INJECTED_CSS}</style>

            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    style={{
                        backgroundColor: "color-mix(in srgb, var(--color-surface-sidebar) 80%, transparent)",
                        backdropFilter: "blur(3px)",
                    }}
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen w-[268px]
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
                style={{
                    backgroundColor: "var(--color-surface-sidebar)",
                    borderRight: "1px solid color-mix(in srgb, var(--color-sidebar-text) 10%, transparent)",
                    fontFamily: "'DM Sans', sans-serif",
                    overflow: "hidden",
                }}
            >

                {/* ── STICKY TOP — Logo bar ─────────────────────────────────────────── */}
                <div
                    className="flex-shrink-0 flex h-16 items-center gap-3 px-5"
                    style={{
                        borderBottom: "1px solid color-mix(in srgb, var(--color-sidebar-text) 10%, transparent)",
                        backgroundColor: "var(--color-surface-sidebar)",
                    }}
                >
                    <button
                        onClick={() => navigate(meta.dashboardPath)}
                        className="flex items-center gap-[10px] flex-1 min-w-0"
                    >
                        {/* Logomark */}
                        <div
                            className="h-[34px] w-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0 text-base"
                            style={{
                                background: "linear-gradient(135deg, var(--color-primary), var(--color-info))",
                                boxShadow: "0 2px 10px color-mix(in srgb, var(--color-primary) 40%, transparent)",
                                color: "var(--color-surface-card)",
                            }}
                        >
                            🎓
                        </div>

                        <span
                            className="text-[18px] font-bold tracking-[-0.3px] truncate"
                            style={{ fontFamily: "'Syne', sans-serif", color: "var(--color-sidebar-text-hover)" }}
                        >
                            Edu<span style={{ color: "var(--color-primary)" }}>Core</span>
                        </span>
                    </button>

                    {/* Role chip */}
                    <span
                        className="text-[10px] font-bold uppercase tracking-[0.9px] px-[9px] py-[4px] rounded-full flex-shrink-0"
                        style={{
                            backgroundColor: meta.badgeBg,
                            color: meta.badgeColor,
                        }}
                    >
                        {role.replace(/_/g, ' ')}
                    </span>
                </div>

                {/* ── SCROLLABLE — Navigation ───────────────────────────────────────── */}
                <div className="sidebar-scroll flex-1 min-h-0 overflow-y-auto py-[14px] px-3">
                    {sections.main.length > 0 && (
                        <Section title="Main" items={sections.main} sectionId="main" />
                    )}
                    {sections.secondary.length > 0 && (
                        <Section title="Menu" items={sections.secondary} sectionId="secondary" />
                    )}
                </div>

                {/* ── STICKY BOTTOM — User profile / logout ────────────────────────── */}
                <div
                    className="flex-shrink-0 p-[14px]"
                    style={{
                        borderTop: "1px solid color-mix(in srgb, var(--color-sidebar-text) 10%, transparent)",
                        backgroundColor: "var(--color-surface-sidebar)",
                    }}
                >
                    <div
                        className="flex items-center gap-3 px-3 py-[10px] rounded-xl"
                        style={{ backgroundColor: "var(--color-sidebar-hover)" }}
                    >
                        {/* Avatar */}
                        <div
                            className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-[13px] flex-shrink-0"
                            style={{
                                background: "var(--color-primary)",
                                color: "var(--color-surface-card)",
                                boxShadow: "0 1px 6px color-mix(in srgb, var(--color-primary) 25%, transparent)",
                            }}
                        >
                            {initials}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p
                                className="text-[13px] font-semibold truncate leading-tight"
                                style={{ color: "var(--color-sidebar-text-hover)" }}
                            >
                                {displayName}
                            </p>
                            <p
                                className="text-[11px] truncate mt-[2px]"
                                style={{ color: "var(--color-sidebar-text)" }}
                            >
                                {roleLabel}
                            </p>
                        </div>

                        {/* Logout */}
                        <button
                            className="p-[7px] rounded-lg flex-shrink-0 transition-all duration-150"
                            title="Logout"
                            style={{ color: "var(--color-error)" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "color-mix(in srgb, var(--color-error) 14%, transparent)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                            }}
                            onClick={handleLogout}
                        >
                            <LogOut size={16} strokeWidth={2} />
                        </button>
                    </div>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;