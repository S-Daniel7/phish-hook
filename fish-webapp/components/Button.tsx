import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
};

export default function Button({
    variant = "primary",
    className = "",
    ...props
}: ButtonProps) {
    const base =
    "rounded-md px-6 py-3 text-lg font-medium focus-visible:outline-none focus-visible:ring-2";
    const styles =
    variant === "secondary"
    ? "bg-slate-100 text-slate-900"
    : "bg-indigo-600 text-white";

return (
    <button
        className={`${base} ${styles} ${className}`}
        {...props}
    />
    );
}