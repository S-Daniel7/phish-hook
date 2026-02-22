'use client';

import Link from 'next/link';

export default function SelectQuizPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8"

      style={{ background: '#e2e8f0', color: 'black', fontFamily: 'var(--font-ubuntu)' }}>

      <div className="text-center">

        <h1 className="text-4xl font-bold text-black drop-shadow-lg" style={{ fontFamily: "var(--font-ubuntu)" }}>Choose Your Quiz</h1>
        <p className="mt-2 text-cyan-200" style={{ fontFamily: "var(--font-ubuntu)" }} >Select a quiz type to start training</p>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
        {/* Audio Quiz Card */}
        <Link href="/quiz"
          className="flex flex-1 flex-col items-center gap-4 rounded-2xl border border-cyan-300/30 bg-white/10 p-8 text-center shadow-xl backdrop-blur-sm transition-all hover:bg-white/20">
          <span className="text-5xl">🎧</span>
          <h2 className="text-xl font-bold text-black" style={{ fontFamily: "var(--font-ubuntu)" }}>Audio Quiz</h2>
          <p className="text-sm text-cyan-200" style={{ fontFamily: "var(--font-ubuntu)" }}>
            Listen to realistic scam call recordings and identify the red flags in the conversation.
          </p>
          <span className="rounded-full bg-cyan-500 px-6 py-2 text-sm font-semibold text-white hover:bg-cyan-400" style={{ fontFamily: "var(--font-ubuntu)" }}>
            Start Audio Quiz
          </span>
        </Link>

        {/* Email Quiz Card */}
        <Link href="/visual-quiz"
          className="flex flex-1 flex-col items-center gap-4 rounded-2xl border border-cyan-300/30 bg-white/10 p-8 text-center shadow-xl backdrop-blur-sm transition-all hover:bg-white/20">
          <span className="text-5xl">📧</span>
          <h2 className="text-xl font-bold text-black" style={{ fontFamily: "var(--font-ubuntu)" }}>Email Quiz</h2>
          <p className="text-sm text-cyan-200" style={{ fontFamily: "var(--font-ubuntu)" }}>
            Read scam emails and spot suspicious phrases, fake domains, and manipulation tactics.
          </p>
          <span className="rounded-full bg-cyan-500 px-6 py-2 text-sm font-semibold text-white hover:bg-cyan-400" style={{ fontFamily: "var(--font-ubuntu)" }}>
            Start Email Quiz
          </span>
        </Link>
      </div>

      <Link href="/" className="text-cyan-200 hover:text-cyan-400 hover:underline">
        ← Back to Home
      </Link>
    </div>
  );
}
