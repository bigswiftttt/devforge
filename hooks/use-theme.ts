"use client";

import { useCallback, useEffect, useState } from "react";

export type ThemeSetting = "dark" | "light" | "system";

function applyTheme(setting: ThemeSetting) {
    const isDark =
        setting === "dark" ||
        (setting === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);
}

export function useTheme() {
    const [theme, setThemeState] = useState<ThemeSetting>("dark");

    useEffect(() => {
        const stored = (localStorage.getItem("devforge-theme") as ThemeSetting | null) ?? "dark";
        setThemeState(stored);
        applyTheme(stored);

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        function handleSystemChange() {
            if (localStorage.getItem("devforge-theme") === "system") {
                applyTheme("system");
            }
        }
        mediaQuery.addEventListener("change", handleSystemChange);
        return () => mediaQuery.removeEventListener("change", handleSystemChange);
    }, []);

    const setTheme = useCallback((value: ThemeSetting) => {
        localStorage.setItem("devforge-theme", value);
        setThemeState(value);
        applyTheme(value);
    }, []);

    return { theme, setTheme };
}