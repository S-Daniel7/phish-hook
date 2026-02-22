import Button from "../components/Button";
import Card from "../components/Card";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col justify-center px-4 py-12">
      <Card>
        <h1 className="text-3xl font-semibold tracking-tight text-sky-900 md:text-4xl dark:text-sky-50">
          Launch your idea fast
        </h1>
        <p className="mt-4 text-sky-700 dark:text-sky-200">
          Minimal Next.js scaffold ready for your hackathon.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/quiz"
            className="rounded-lg bg-teal-600 px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            Scam Quiz
          </a>
          <a
            href="/visual-quiz"
            className="rounded-lg bg-cyan-600 px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:bg-cyan-500 dark:hover:bg-cyan-600"
          >
            Visual Quiz
          </a>
          <Button variant="secondary">Dashboard</Button>
        </div>
      </Card>
    </div>
  );
}