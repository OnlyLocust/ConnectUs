"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle({ variant = "icon", className }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "rounded-md bg-muted animate-pulse",
          variant === "sidebar" ? "h-12 w-full" : "h-9 w-9",
          className
        )}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const activeTheme = theme ?? "system";

  if (variant === "sidebar") {
    const ActiveIcon =
      themes.find((t) => t.value === activeTheme)?.icon ?? Monitor;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-4 p-3 rounded-lg",
              "text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-200",
              className
            )}
          >
            <ActiveIcon className="h-5 w-5 shrink-0" />
            <span className="font-medium flex-1 text-left">Theme</span>
            <span className="text-xs text-muted-foreground capitalize">
              {activeTheme === "system" ? "Auto" : activeTheme}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {themes.map(({ value, label, icon: Icon }) => (
            <DropdownMenuItem
              key={value}
              onClick={() => setTheme(value)}
              className="cursor-pointer"
            >
              <Icon className="mr-2 h-4 w-4" />
              <span className="flex-1">{label}</span>
              {activeTheme === value && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      className={cn("relative shrink-0", className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <Sun className="h-5 w-5 transition-all dark:scale-0 dark:opacity-0" />
      <Moon className="absolute h-5 w-5 scale-0 opacity-0 transition-all dark:scale-100 dark:opacity-100" />
    </Button>
  );
}

export default ThemeToggle;
