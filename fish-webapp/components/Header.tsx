import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

export default function Header() {
  return (
    <header className="bg-slate-100/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between rounded-3xl border border-slate-300 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          {/* Logo + name */}
          <div className="flex items-center gap-3">
            <Image
              src="/phishhook-logo.png"
              alt="PhishHook logo"
              width={72}
              height={72}
              priority
            />
            <span
              className="text-4xl text-[#123E45]"
              style={{ fontFamily: "var(--font-ubuntu)" }}
            >
              PhishHook
            </span>
          </div>

          {/* Nav buttons */}
          <nav className="flex items-center gap-2">
            <Link href="/resources">
              <Button variant="secondary">Resources</Button>
            </Link>
            <Link href="/help">
              <Button>Get Help</Button>
            </Link>
            <Link href="/login">
              <Button variant="tertiary">Login</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}