import Button from "../components/Button";
import Card from "../components/Card";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col justify-center px-4 py-12">
      <Card>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Launch your idea fast
        </h1>
        <p className="mt-4 text-slate-300">
          Minimal Next.js scaffold ready for your hackathon.
        </p>
        <div className="mt-6 flex gap-3">
          <Button>Start</Button>
          <Button variant="secondary">Dashboard</Button>
        </div>
      </Card>
    </div>
  );
}