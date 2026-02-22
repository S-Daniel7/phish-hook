import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "tertiary";
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
const base =
  "rounded-xl px-5 py-2.5 text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 border bg-white";

const styles =
  variant === "secondary" // Resources (blue)
    ? "border-[#2F80ED] text-[#2F80ED] bg-[#2F80ED]/5 hover:bg-[#2F80ED] hover:text-white focus-visible:ring-[#2F80ED]/30"
    : variant === "tertiary" // Get Help (green)
    ? "border-[#16A34A] text-[#16A34A] bg-[#16A34A]/5 hover:bg-[#16A34A] hover:text-white focus-visible:ring-[#16A34A]/30"
    : // Login (orange)
      "border-[#F97316] text-[#F97316] bg-[#F97316]/5 hover:bg-[#F97316] hover:text-white focus-visible:ring-[#F97316]/30";
return (
    <button
        className={`${base} ${styles} ${className}`}
        {...props}
    />
    );
}