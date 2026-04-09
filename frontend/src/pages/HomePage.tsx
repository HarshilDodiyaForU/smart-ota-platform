export function HomePage() {
  return (
    <main className="min-h-full">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="space-y-4">
          <p className="text-sm text-zinc-400">Cloud-Based Secure Digital Vault</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight">
            Zero-knowledge encrypted file storage
          </h1>
          <p className="max-w-2xl text-pretty text-zinc-300">
            Files will be encrypted in your browser using AES-256-GCM before upload. The backend will
            store only ciphertext + metadata.
          </p>
        </header>

        <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-medium">Step 1 status</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
            <li>Frontend: Vite + React + TypeScript + Tailwind is wired.</li>
            <li>Backend: Express + TypeScript has a /health route.</li>
            <li>Next: MongoDB connection + User model.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

