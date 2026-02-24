import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <svg
                viewBox="0 0 40 40"
                className="h-9 w-9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="m7.839 34.783 16.03-28.054L20 0 0 34.783h7.839Zm8.214 0H40L27.99 13.894l-4.02 7.032 3.976 6.914H20.02l-3.967 6.943Z"
                    fill="var(--primary)"
                />
            </svg>
            {!iconOnly && (
                <span className="text-xl font-bold text-foreground tracking-tight whitespace-nowrap">
                    KhmerWork
                </span>
            )}
        </div>
    );
}
