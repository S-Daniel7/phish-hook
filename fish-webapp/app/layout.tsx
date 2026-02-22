import type { Metadata } from "next";
import "./globals.css";
import { ubuntu, dmSans } from "./fonts";

export const metadata = {
  title: "PhishHook",
  applicationName: "PhishHook",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${ubuntu.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}