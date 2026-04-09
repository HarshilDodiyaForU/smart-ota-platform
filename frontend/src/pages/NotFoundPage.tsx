import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="min-h-full">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">404</h1>
        <p className="mt-2 text-zinc-300">This page doesn’t exist.</p>
        <Link className="mt-6 inline-block text-sm text-indigo-300 hover:underline" to="/">
          Go home
        </Link>
      </div>
    </main>
  );
}

