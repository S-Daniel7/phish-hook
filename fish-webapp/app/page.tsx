import Header from "@/components/Header";
import Link from "next/link";
import Button from "../components/Button";
import Card from "../components/Card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Header />

      <section className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero */}
        <div className="text-center">
          <p className="mt-2 text-3xl font-semibold tracking-wide text-green-600 md:text-4xl">
            The danger is close — but avoidable.
          </p>

          <h1
            className="mt-4 text-4xl font-semibold tracking-tight text-cyan-600 md:text-5xl"
            style={{ fontFamily: "var(--font-ubuntu)" }}
          >
            Learn to recognize the hook before it reaches you.
          </h1>

          <div className="mt-8 flex justify-center">
            <Link href="/practice">
              <Button
                className="rounded-xl px-10 py-5 text-xl"
                style={{ fontFamily: "var(--font-ubuntu)" }}
              >
                Start Practicing
              </Button>
            </Link>
          </div>
        </div>

        {/* Cards - TWO COLUMNS */}
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          
          {/* Mission */}
          <Card className="h-full">
            <h2
          className="text-3xl font-semibold text-slate-900"
          style={{ fontFamily: "var(--font-ubuntu)" }}>
            Mission
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              PhishHook helps people build confidence recognizing scams through safe,
              realistic practice — without fear, shame, or pressure.
            </p>
          </Card>

          {/* Did You Know */}
          <Card className="h-full">
            <h2
              className="text-3xl font-semibold tracking-tight text-slate-900"
              style={{ fontFamily: "var(--font-ubuntu)" }}
            >
              Did you know?
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Many phishing messages look “normal.” Watch for urgency, fake support,
              and tiny link misspellings.
            </p>

            <ul className="mt-5 list-disc space-y-2 pl-6 text-lg text-slate-600">
              <li>Hover links before clicking.</li>
              <li>Be suspicious of urgency (“act now”).</li>
              <li>Verify through official contact methods.</li>
            </ul>
          </Card>
        </div>
      </section>
    </main>
  );
}