import * as React from "react";
import { cn } from "./utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary:
                "bg-emerald-400 text-slate-900 hover:bg-emerald-300 hover:translate-y-[-1px] shadow-lg shadow-emerald-400/20",
            secondary:
                "bg-white/10 text-white hover:bg-white/20 border border-white/10",
            outline:
                "border border-white/20 text-white hover:border-white/40 hover:bg-white/5",
            ghost: "text-slate-300 hover:text-white hover:bg-white/5",
            danger: "bg-red-500/10 text-red-200 hover:bg-red-500/20 border border-red-500/20",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-xs",
            md: "px-6 py-3 text-sm",
            lg: "px-8 py-4 text-base",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
