import localFont from "next/font/local";

export const ubuntu = localFont({
  src: "./fonts/Ubuntu-Bold.ttf",   // ✅ relative to app/
  variable: "--font-ubuntu",
  display: "swap",
});

export const dmSans = localFont({
  src: "./fonts/DMSans-VariableFont.ttf", // ✅ relative to app/
  variable: "--font-dm-sans",
  display: "swap",
});