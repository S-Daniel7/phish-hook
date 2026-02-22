'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface ScamAspect {
  text: string;
  explanation: string;
}

interface QuizItem {
  _id: string;
  title: string;
  script: string;
  audioGridFsId?: string;
  audioUrl?: string;
  scamAspects: ScamAspect[];
  distractors?: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [current, setCurrent] = useState<QuizItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<{ text: string; isScam: boolean }[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioSrc = current
    ? current.audioUrl ?? `/api/quiz/${current._id}/audio`
    : null;

  const loadQuizzes = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/quiz');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      const data = json.data || [];
      setQuizzes(data);
      if (data.length > 0) {
        const q = data[Math.floor(Math.random() * data.length)];
        setCurrent(q);
        const scamTexts = q.scamAspects.map((a: ScamAspect) => a.text);
        const distractorTexts = q.distractors || [];
        const all = [
          ...scamTexts.map((t: string) => ({ text: t, isScam: true })),
          ...distractorTexts.map((t: string) => ({ text: t, isScam: false })),
        ];
        setOptions(shuffle(all));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const toggleOption = (text: string) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(text)) next.delete(text);
      else next.add(text);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!current || submitted) return;
    setSubmitted(true);
    const correctCount = options.filter(
      (o) => o.isScam && selected.has(o.text)
    ).length;
    const missedCount = options.filter(
      (o) => o.isScam && !selected.has(o.text)
    ).length;
    const falsePositives = options.filter(
      (o) => !o.isScam && selected.has(o.text)
    ).length;
    const totalScams = current.scamAspects.length;
    const correct = correctCount - falsePositives;
    setScore({
      correct: Math.max(0, correctCount),
      total: totalScams,
    });
  };

  const resetQuiz = () => {
    setSelected(new Set());
    setSubmitted(false);
    setScore(null);
    if (quizzes.length > 0) {
      const q = quizzes[Math.floor(Math.random() * quizzes.length)];
      setCurrent(q);
      const scamTexts = q.scamAspects.map((a) => a.text);
      const distractorTexts = q.distractors || [];
      const all = [
        ...scamTexts.map((t) => ({ text: t, isScam: true })),
        ...distractorTexts.map((t) => ({ text: t, isScam: false })),
      ];
      setOptions(shuffle(all));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Loading quiz...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-8 dark:bg-zinc-950">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={loadQuizzes}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-8 dark:bg-zinc-950">
        <p className="text-zinc-600 dark:text-zinc-400">
          No quizzes available. Add quiz items to MongoDB to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Scam Call Quiz
        </h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Listen to the call and select all aspects that indicate a scam.
        </p>

        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {current.title}
          </h2>
          {current.script && (
            <p className="mb-4 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
              {current.script}
            </p>
          )}
          {audioSrc && (
            <div className="flex items-center gap-3">
              <audio
                ref={audioRef}
                src={audioSrc}
                controls
                className="w-full max-w-md"
              />
            </div>
          )}
        </div>

        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Select all scam red flags you notice:
          </h3>
          <div className="flex flex-wrap gap-3">
            {options.map((opt) => {
              const isSelected = selected.has(opt.text);
              const showCorrect = submitted && opt.isScam;
              const showWrong = submitted && isSelected && !opt.isScam;
              const showMissed = submitted && opt.isScam && !isSelected;
              return (
                <button
                  key={opt.text}
                  type="button"
                  onClick={() => toggleOption(opt.text)}
                  disabled={submitted}
                  className={`rounded-lg border-2 px-4 py-2 text-left text-sm font-medium transition-colors ${
                    showCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                      : showWrong
                        ? 'border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
                        : showMissed
                          ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                          : isSelected
                            ? 'border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-800'
                            : 'border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-500'
                  }`}
                >
                  {opt.text}
                  {showMissed && ' (missed)'}
                  {showWrong && ' (not a scam)'}
                </button>
              );
            })}
          </div>
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className="rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Submit Answers
          </button>
        ) : (
          <div className="space-y-4">
            {score !== null && (
              <p className="text-lg text-zinc-700 dark:text-zinc-300">
                You identified <strong>{score.correct}</strong> of{' '}
                <strong>{score.total}</strong> scam red flags.
              </p>
            )}
            {current.scamAspects.length > 0 && (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h4 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                  Key red flags:
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {current.scamAspects.map((a, i) => (
                    <li key={i}>
                      <strong>{a.text}</strong> — {a.explanation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={resetQuiz}
              className="rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Try Another Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
