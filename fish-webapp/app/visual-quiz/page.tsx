'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface BackendQuiz {
  _id: string;
  level?: number;
  title?: string;
  body?: string;
  scenario?: string;
  fromEmail?: string;
  fromName?: string;
  image?: string;
  flags: string[];
  options: string[];
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


const levelScoresCache: Record<number, { score: number; total: number }> = {};


export default function VisualQuizPage() {
  const [level, setLevel] = useState(1);
  const [quiz, setQuiz] = useState<BackendQuiz | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    correct: string[];
  } | null>(null);
  
  const[showFinal,setShowFinal] = useState(false);

  const loadQuiz = useCallback(async () => {
    setLoading(true);
    setError(null);
    setQuiz(null);
    setSelected(new Set());
    setSubmitted(false);
    setResult(null);
    try {
      const res = await fetch(`http://localhost:5000/api/visual-quiz/quiz?level=${level}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load quiz');
      if (!data._id) throw new Error('No quiz returned');
      const quizId = typeof data._id === 'string' ? data._id : data._id.toString();
      setQuiz({ ...data, _id: quizId });
     const flags = data.flags || [];
      const distractors = data.distractors || [];
      setChoices(shuffle([...flags, ...distractors]));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const toggleChoice = (item: string) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  
const handleSubmit = async () => {
  if (!quiz || submitted) return;
  setSubmitted(true);

  const correctFlags = quiz.flags || [];
  const selectedArray = Array.from(selected);
  
  const correctSelected = selectedArray.filter(item => correctFlags.includes(item));
  const score = correctSelected.length;
  const total = correctFlags.length;

  setResult({
    score,
    total,
    correct: correctFlags,
  });

  levelScoresCache[level] = { score, total };

};

const goNext = () => {
  if  (!submitted) return;
  if (level < 5) {
    setLevel((l) => l + 1);
  } else {
    setShowFinal(true);
  };}

const goPrev = () => {
  if (level > 1)  setLevel((l) => l - 1); };




if (showFinal) {
  const totalScore = Object.values(levelScoresCache).reduce((sum, s) => sum + s.score, 0);
  const totalPossible = Object.values(levelScoresCache).reduce((sum, s) => sum + s.total, 0);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-sky-50 p-8 dark:bg-slate-900">
      <h1 className="text-3xl font-bold text-sky-900 dark:text-sky-50">Quiz Complete!</h1>
      <p className="text-xl text-sky-700 dark:text-sky-300">
        Total Score: <strong>{totalScore}</strong> / <strong>{totalPossible}</strong>
      </p>
      <div className="w-full max-w-sm space-y-2">
        {[1,2,3,4,5].map((l) => {
          const s = levelScoresCache[l];
          return (
            <div key={l} className="flex justify-between rounded-lg bg-white px-4 py-2 shadow dark:bg-slate-800">
              <span className="text-sky-700 dark:text-sky-300">Level {l}</span>
              <span className={s ? (s.score === s.total ? 'text-teal-600' : 'text-red-500') : 'text-sky-400'}>
                {s ? `${s.score} / ${s.total}` : 'Skipped'}
              </span>
            </div>
          );
        })}
      </div>
      <button onClick={() => { setShowFinal(false); setLevel(1); Object.keys(levelScoresCache).forEach(k => delete levelScoresCache[Number(k)]); }}
        className="rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700">
        Try Again
      </button>
      <Link href="/" className="text-sky-600 hover:underline dark:text-sky-400">Home</Link>
    </div>
  );
}





  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sky-50 dark:bg-slate-900">
        <p className="text-lg text-sky-700 dark:text-sky-300">Loading quiz...</p>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-sky-50 p-8 dark:bg-slate-900">
        <p className="text-center text-red-600 dark:text-red-400">{error}</p>
        <p className="text-center text-sm text-sky-600 dark:text-sky-400">
          Start the Express backend with: <code className="rounded bg-sky-200 px-1 dark:bg-slate-700">node server.js</code> (in the folder with server.js), and set <code className="rounded bg-sky-200 px-1 dark:bg-slate-700">EXPRESS_BACKEND_URL</code> in .env if it runs on a different port.
        </p>
        <div className="flex items gap-3">
          <button
            onClick={loadQuiz}
            className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            Retry
          </button>
          <Link
            href="/"
            className="rounded-lg border border-sky-300 px-4 py-2 hover:bg-sky-100 dark:border-sky-600 dark:hover:bg-slate-800"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-sky-50 p-8 dark:bg-slate-900">
        <p className="text-sky-700 dark:text-sky-300">No quiz available.</p>
        <Link href="/" className="text-teal-600 hover:underline dark:text-teal-400">Back to home</Link>
      </div>
    );
  }

  const correctSet = new Set(quiz.flags || []);

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-slate-900">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200">
            ← Home
          </Link>
                        
              <div className="flex items-center gap-3">
                <button onClick={goPrev} disabled={level === 1 || loading}
                  className="rounded-lg border border-sky-300 px-3 py-1 text-sky-700 hover:bg-sky-100 disabled:opacity-30">
                  ←
                </button>
                <span className="text-sm font-semibold text-sky-700 dark:text-sky-300">
                  Level {level} / 5
                </span>
                <button onClick={goNext} disabled={loading}
                  className="rounded-lg border border-sky-300 px-3 py-1 text-sky-700 hover:bg-sky-100 disabled:opacity-30">
                  →
                </button>
              </div>


        </div>

        <h1 className="mb-2 text-2xl font-bold text-sky-900 dark:text-sky-50">
          {quiz.title || `Quiz Level ${quiz.level ?? level}`}
        </h1>
        {quiz.scenario && (
          <p className="mb-6 whitespace-pre-wrap text-sky-700 dark:text-sky-300">
            {quiz.scenario}
          </p>
        )}
        {quiz.body && (
          <div className = "mb-6 rounded-xl border-2 border-sky-200 bg-white dark:border-sky-700 dark:bg-slate-800">
            <p className="whitespace-pre-wrap p-4 text-sm text-sky-800 dark:text-sky-200">{quiz.body}</p>
          </div>
        )}
        {(quiz.fromName||quiz.fromEmail) && (
         <div className="mb-6 rounded-xl border border-sky-200 bg-sky-100 dark:border-sky-700 dark:bg-slate-700">
    <div className="border-b border-sky-200 px-4 py-2 dark:border-sky-700">
      <p className="text-sm text-sky-800 dark:text-sky-200">
        <span className="font-semibold">From: </span>{quiz.fromName} &lt;{quiz.fromEmail}&gt;
      </p>
    </div>
    {quiz.scenario && (
      <div className="px-4 py-2">
        <p className="text-sm text-sky-800 dark:text-sky-200">
          <span className="font-semibold">Subject: </span>{quiz.scenario}
        </p>
      </div>
    )}
  </div>
)}




        {quiz.image && (
          <div className="mb-6 overflow-hidden rounded-xl border-2 border-sky-200 dark:border-sky-700">
            <img src={quiz.image} alt="" className="w-full object-cover" />
          </div>
        )}

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-sky-900 dark:text-sky-50">
            Select all that apply (red flags):
          </h2>
          <div className="flex flex-wrap gap-3">
            {choices.map((item) => {
              const isSelected = selected.has(item);
              const isCorrect = correctSet.has(item);
              const showCorrect = submitted && isSelected&& isCorrect;
              const showWrong = submitted && isSelected && !isCorrect;
              const showMissed = submitted && !isSelected && isCorrect;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleChoice(item)}
                  disabled={submitted}
                  className={`rounded-lg border-2 px-4 py-2 text-left text-sm font-medium transition-colors ${
                    showCorrect
                      ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200'
                      : showWrong
                        ? 'border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
                        : showMissed
                          ? 'border-sky-500 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200'
                          : isSelected
                            ? 'border-teal-600 bg-teal-50 dark:border-teal-400 dark:bg-teal-900/50'
                            : 'border-sky-200 bg-white hover:border-sky-400 dark:border-sky-700 dark:bg-slate-800 dark:hover:border-sky-500'
                  }`}
                >
                  {item}
                  {showMissed && ' (missed)'}
                  {showWrong && ' (not a flag)'}
                  {showCorrect && ' (correct)'}
                </button>
              );
            })}
          </div>
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className="rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-teal-700 disabled:opacity-50 dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            Submit
          </button>
        ) : result ? (
          <div className="space-y-4">
            <p className="text-lg text-sky-800 dark:text-sky-200">
              Score: <strong>{result.score}</strong> / <strong>{result.total}</strong> correct
            </p>
            <div className="flex gap-3">
                <button onClick={loadQuiz}
                  className="rounded-lg border border-sky-300 px-4 py-2 hover:bg-sky-100 dark:border-sky-600">
                  Try Again
                </button>
                <button onClick={goNext}
                  className="rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700">
                  {level < 5 ? 'Next Level →' : 'See Final Score'}
                </button>
              </div>

            <Link
              href="/"
              className="ml-3 inline-block rounded-lg border border-sky-300 px-6 py-3 hover:bg-sky-100 dark:border-sky-600 dark:hover:bg-slate-800"
            >
              Home
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
