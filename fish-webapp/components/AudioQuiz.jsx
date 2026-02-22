"use client";

import { useState, useEffect, useRef } from "react";

/**
 * @typedef {Object} Question
 * @property {string} question
 * @property {string[]} options
 * @property {string} answer
 */

/**
 * @typedef {Object} Props
 * @property {string} lessonId
 */

/**
 * @param {Props} props
 */

export default function AudioQuiz({ lessonId }) {
  const audioRef = useRef(null);

  const [audioUrl, setAudioUrl] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    async function loadLesson() {
      const lessonRes = await fetch(`/api/quiz/${lessonId}`);
      const lesson = await lessonRes.json();

      setQuestions(lesson.questions);

      const audioRes = await fetch(`/api/quiz/${lessonId}/audio`, {
        method: "POST",
      });

      const blob = await audioRes.blob();
      const url = URL.createObjectURL(blob);

      setAudioUrl(url);
    }

    loadLesson();
  }, [lessonId]);

  function handleAnswer(option) {
    if (option === questions[current].answer) {
      setScore((prev) => prev + 1);
    }

    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      alert(`Final Score: ${score + 1}/${questions.length}`);
    }
  }

  return (
    <div className="space-y-6">
      {audioUrl && (
        <audio
          ref={audioRef}
          controls
          src={audioUrl}
          onEnded={() => setUnlocked(true)}
        />
      )}

      {!unlocked && <p>Listen to the full audio to unlock quiz.</p>}

      {unlocked && questions.length > 0 && (
        <div>
          <h2>{questions[current].question}</h2>
          {questions[current].options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className="block w-full bg-blue-500 text-white p-2 mt-2 rounded"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}