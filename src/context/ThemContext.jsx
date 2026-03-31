import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const COLOR_THEMES = [
    { id: "blue", label: "Blue", primary: "#2563EB" },
    { id: "indigo", label: "Indigo", primary: "#4F46E5" },
    { id: "purple", label: "Purple", primary: "#7C3AED" },
    { id: "violet", label: "Violet", primary: "#8B5CF6" },
    { id: "pink", label: "Pink", primary: "#EC4899" },
    { id: "rose", label: "Rose", primary: "#F43F5E" },
    { id: "red", label: "Red", primary: "#DC2626" },
    { id: "orange", label: "Orange", primary: "#EA580C" },
    { id: "amber", label: "Amber", primary: "#F59E0B" },
    { id: "yellow", label: "Yellow", primary: "#EAB308" },
    { id: "lime", label: "Lime", primary: "#84CC16" },
    { id: "green", label: "Green", primary: "#16A34A" },
    { id: "emerald", label: "Emerald", primary: "#10B981" },
    { id: "teal", label: "Teal", primary: "#14B8A6" },
    { id: "cyan", label: "Cyan", primary: "#06B6D4" },
    { id: "sky", label: "Sky", primary: "#0EA5E9" },
    { id: "slate", label: "Slate", primary: "#475569" },
    { id: "gray", label: "Gray", primary: "#6B7280" },
    { id: "zinc", label: "Zinc", primary: "#71717A" },
    { id: "stone", label: "Stone", primary: "#78716C" },
];

function applyTheme(themeId, isDark) {
    const theme = COLOR_THEMES.find((t) => t.id === themeId) ?? COLOR_THEMES[0];
    // const root = document.documentElement;

    // root.setAttribute("data-theme", themeId);

    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-button-primary", theme.primary);

    if (isDark) {
        root.style.setProperty("--color-surface-page", "#0D1117");
        root.style.setProperty("--color-surface-card", "#161B22");
        root.style.setProperty("--color-surface-header", "#161B22");
        root.style.setProperty("--color-text-primary", "#E6EDF3");
        root.style.setProperty("--color-text-secondary", "#8B949E");
        root.style.setProperty("--color-text-heading", "#F0F6FC");
        root.style.setProperty("--color-border", "#30363D");
    } else {
        root.style.setProperty("--color-surface-page", "#F8FAFC");
        root.style.setProperty("--color-surface-card", "#FFFFFF");
        root.style.setProperty("--color-surface-header", "#FFFFFF");
        root.style.setProperty("--color-text-primary", "#111827");
        root.style.setProperty("--color-text-secondary", "#6B7280");
        root.style.setProperty("--color-text-heading", "#030712");
        root.style.setProperty("--color-border", "#E5E7EB");
    }
}

export const ThemeProvider = ({ children }) => {
    const [themeId, setThemeId] = useState(
        localStorage.getItem("theme") || "blue"
    );

    const [themeMode, setThemeMode] = useState(
        localStorage.getItem("themeMode") || "system"
    );

    const getSystemDark = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDark =
        themeMode === "dark" ||
        (themeMode === "system" && getSystemDark());

    useEffect(() => {
        applyTheme(themeId, isDark);

        localStorage.setItem("theme", themeId);
        localStorage.setItem("themeMode", themeMode);
    }, [themeId, themeMode, isDark]);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const handler = () => {
            if (themeMode === "system") {
                applyTheme(themeId, media.matches);
            }
        };

        media.addEventListener("change", handler);

        return () => media.removeEventListener("change", handler);
    }, [themeMode, themeId]);

    return (
        <ThemeContext.Provider
            value={{
                themeId,
                setThemeId,
                themeMode,
                setThemeMode,
                isDark,
                COLOR_THEMES,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);