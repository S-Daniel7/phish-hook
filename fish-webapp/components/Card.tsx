import React from "react";

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "group relative overflow-hidden rounded-3xl",
        "border border-slate-200 bg-white/85",
        "px-8 py-10",
        "shadow-sm backdrop-blur",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg",
        "hover:border-cyan-500", // 👈 cyan border on hover
        className,
      ].join(" ")}
    >
      {/* top accent bar */}
      <div
        className="
          absolute inset-x-0 top-0 h-1.5
          bg-cyan-500
          opacity-0
          transition-opacity duration-300
          group-hover:opacity-100
        "
      />

      {/* cyan glow */}
      <div
        className="
          pointer-events-none absolute -inset-32
          bg-cyan-400
          opacity-0
          blur-3xl
          transition-opacity duration-300
          group-hover:opacity-20
        "
      />

      <div className="relative">{children}</div>
    </div>
  );
}