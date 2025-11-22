import * as React from "react";
import { cn } from "./utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, ...props }, ref) => {
        return (
            <label className="space-y-2 text-sm text-slate-200 w-full block">
                {label && <span>{label}</span>}
                <input
                    type={type}
                    className={cn(
                        "flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </label>
        );
    }
);
Input.displayName = "Input";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <label className="space-y-2 text-sm text-slate-200 w-full block">
                {label && <span>{label}</span>}
                <textarea
                    className={cn(
                        "flex min-h-[80px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </label>
        );
    }
);
Textarea.displayName = "Textarea";

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, children, ...props }, ref) => {
        return (
            <label className="space-y-2 text-sm text-slate-200 w-full block">
                {label && <span>{label}</span>}
                <div className="relative">
                    <select
                        className={cn(
                            "flex h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-50 pr-8",
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {children}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2.5 4.5L6 8L9.5 4.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </label>
        );
    }
);
Select.displayName = "Select";

export { Input, Textarea, Select };
