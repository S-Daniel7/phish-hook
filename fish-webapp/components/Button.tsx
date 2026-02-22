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
    ? "bg-sky-100 text-sky-900 hover:bg-sky-200 dark:bg-sky-900/50 dark:text-sky-100 dark:hover:bg-sky-800"
    : "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600";

return (
    <button
        className={`${base} ${styles} ${className}`}
        {...props}
    />
    );
}