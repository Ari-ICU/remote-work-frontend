"use client"

import * as React from "react"
import { Moon, Sun, Languages, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { setUserLocale } from "@/lib/locale"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"

export function SettingsControl() {
    const { setTheme, theme } = useTheme()
    const locale = useLocale()
    const t = useTranslations("common")
    const router = useRouter()

    const handleLanguageChange = async (newLocale: string) => {
        await setUserLocale(newLocale)
        router.refresh()
        // Optionally persist to backend if user is logged in
        try {
            await api.patch('/users/profile', { preferredLanguage: newLocale })
        } catch (e) {
            // Ignore if not logged in
        }
    }

    const handleThemeChange = async (newTheme: string) => {
        setTheme(newTheme)
        router.refresh()
        try {
            await api.patch('/users/profile', { theme: newTheme })
        } catch (e) {
            // Ignore if not logged in
        }
    }

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("theme")}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                        Light {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                        Dark {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange("system")}>
                        System {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                        <Languages className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Switch language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                        English {locale === "en" && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>
                        Français {locale === "fr" && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
