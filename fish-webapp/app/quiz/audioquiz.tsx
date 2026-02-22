
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface ScamAspect {
  text: string;
  explanation: string;
}

interface QuizItem {
  _id: string;
  title: string;
  script: string;
  audioUrl?: string;
  scamAspects: ScamAspect[];
}

export default function AudioQuizPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);
  const [allScores, setAllScores] = useState<{ correct: number; total: number; title: string }[]>([]);
  const [showFinal, setShowFinal] = useState(false);

  const current = quizzes[currentIndex] || null;

  const loadQuizzes = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch('/api/quiz');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setQuizzes(json.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadQuizzes(); }, [loadQuizzes]);

  const toggleSentence = (sentence: string) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sentence)) next.delete(sentence);
      else next.add(sentence);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!current || submitted) return;
    setSubmitted(true);
    const scamTexts = current.scamAspects.map((a) => a.text);
    const correctCount = Array.from(selected).filter(s => scamTexts.includes(s)).length;
    const result = { correct: correctCount, total: scamTexts.length, title: current.title };
    setScore({ correct: correctCount, total: scamTexts.length });
    setAllScores(prev => [...prev, result]);
  };

  const goNext = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(new Set());
      setSubmitted(false);
      setScore(null);
    } else {
      setShowFinal(true);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setSelected(new Set());
      setSubmitted(false);
      setScore(null);
    }
  };

  // Final results page
  if (showFinal) {
    const totalCorrect = allScores.reduce((sum, s) => sum + s.correct, 0);
    const totalPossible = allScores.reduce((sum, s) => sum + s.total, 0);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-sky-50 p-8 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-sky-900 dark:text-sky-50">Quiz Complete!</h1>
        <p className="text-xl text-sky-700 dark:text-sky-300">
          Total Score: <strong>{totalCorrect}</strong> / <strong>{totalPossible}</strong>
        </p>
        <div className="w-full max-w-md space-y-2">
          {allScores.map((s, i) => (
            <div key={i} className="flex justify-between rounded-lg bg-white px-4 py-2 shadow dark:bg-slate-800">
              <span className="text-sky-700 dark:text-sky-300">{s.title}</span>
              <span className={s.correct === s.total ? 'font-semibold text-teal-600' : 'font-semibold text-red-500'}>
                {s.correct} / {s.total}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() => { setShowFinal(false); setCurrentIndex(0); setAllScores([]); setSelected(new Set()); setSubmitted(false); setScore(null); }}
          className="rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700"
        >
          Play Again
        </button>
        <Link href="/" className="text-sky-600 hover:underline dark:text-sky-400">Home</Link>
      </div>
    );
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-sky-50 dark:bg-slate-900">
      <p className="text-lg text-sky-700 dark:text-sky-300">Loading quiz...</p>
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-sky-50 p-8 dark:bg-slate-900">
      <p className="text-red-600 dark:text-red-400">{error}</p>
      <button onClick={loadQuizzes} className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700">Retry</button>
    </div>
  );

  if (!current) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-sky-50 p-8 dark:bg-slate-900">
      <p className="text-sky-700 dark:text-sky-300">No quizzes available.</p>
      <Link href="/" className="text-teal-600 hover:underline">Back to home</Link>
    </div>
  );

  const sentences = current.script
    .split(/\\n|\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-slate-900">
      <div className="mx-auto max-w-2xl px-6 py-12">

        {/* Header with arrows */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sky-600 hover:text-sky-800 dark:text-sky-400">← Home</Link>
          <div className="flex items-center gap-3">
            <button onClick={goPrev} disabled={currentIndex === 0}
              className="rounded-lg border border-sky-300 px-3 py-1 text-sky-700 hover:bg-sky-100 disabled:opacity-30 dark:border-sky-600 dark:text-sky-300">
              ←
            </button>
            <span className="text-sm font-semibold text-sky-700 dark:text-sky-300">
              {currentIndex + 1} / {quizzes.length}
            </span>
            <button onClick={goNext} disabled={!submitted}
              className="rounded-lg border border-sky-300 px-3 py-1 text-sky-700 hover:bg-sky-100 disabled:opacity-30 dark:border-sky-600 dark:text-sky-300">
              →
            </button>
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-sky-900 dark:text-sky-50">Audio Quiz</h1>
        <p className="mb-6 text-sky-700 dark:text-sky-300">
          Listen to the call, then click on sentences that are scam indicators.
        </p>

        {/* Audio player */}
        {current.audioUrl && (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-sky-900 to-slate-800 p-4 shadow-lg">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-2xl">🎧</span>
              <p className="text-sm font-semibold text-sky-200">Listen to the scam call</p>
            </div>
            <audio controls className="w-full rounded-lg accent-teal-400" src={current.audioUrl}>
              Your browser does not support audio.
            </audio>
          </div>
        )}

        <h2 className="mb-4 text-lg font-semibold text-sky-900 dark:text-sky-50">{current.title}</h2>
        <p className="mb-3 text-sm text-sky-600 dark:text-sky-400">Click on sentences that indicate a scam:</p>

        {/* Clickable sentences */}
        <div className="mb-8 flex flex-col gap-2">
          {sentences.map((sentence, i) => {
            const isSelected = selected.has(sentence);
            const isScam = current.scamAspects.some(a => a.text === sentence);
            const aspect = current.scamAspects.find(a => a.text === sentence);
            const showGreen = submitted && isSelected && isScam;
            const showRed = submitted && isSelected && !isScam;
            const showMissed = submitted && !isSelected && isScam;

            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => toggleSentence(sentence)}
                  disabled={submitted}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm leading-relaxed transition-colors ${
                    showGreen
                      ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200'
                      : showRed
                        ? 'border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
                        : showMissed
                          ? 'border-orange-400 bg-orange-50 text-orange-800 dark:bg-orange-950 dark:text-orange-200'
                          : isSelected
                            ? 'border-teal-600 bg-teal-50 dark:border-teal-400 dark:bg-teal-900/50'
                            : 'border-transparent bg-white hover:border-sky-400 dark:bg-slate-800'
                  }`}
                >
                  {sentence}
                  {showGreen && ' ✓'}
                  {showRed && ' ✗'}
                  {showMissed && ' ⚠️'}
                </button>
                {submitted && (showGreen || showMissed) && aspect && (
                  <div className="mt-1 rounded-lg bg-teal-100 px-4 py-2 text-sm text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                    💡 {aspect.explanation}
                  </div>
                )}
                {submitted && showRed && (
                  <div className="mt-1 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
                    ✗ This is not a scam indicator
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit / result */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className="rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-teal-700 disabled:opacity-50"
          >
            Submit Answers
          </button>
        ) : (
          <div className="space-y-4">
            {score && (
              <p className={`text-lg font-semibold ${score.correct === score.total ? 'text-teal-600' : 'text-sky-800 dark:text-sky-200'}`}>
                {score.correct === score.total
                  ? '🎉 Perfect!'
                  : `You got ${score.correct} of ${score.total} indicators.`}
              </p>
            )}
            <button onClick={goNext}
              className="rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700">
              {currentIndex < quizzes.length - 1 ? 'Next Question →' : 'See Final Score'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


