import React from "react";

export default function Card({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
    <div className="rounded-xl border-2 border-sky-200 bg-white p-6 shadow-lg shadow-sky-100 dark:border-sky-700 dark:bg-slate-800 dark:shadow-sky-950/30">
        {children}
    </div>
    );
}