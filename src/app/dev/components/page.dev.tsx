/**
 * Dev-only sandbox route. Named `page.dev.tsx` so it disappears from
 * production builds entirely — see `pageExtensions` in next.config.ts.
 */
export default function DevComponentsPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-2 p-8">
      <h1 className="text-xl font-semibold">Dev component sandbox</h1>
      <p className="text-neutral-600">
        Local-only route for previewing components in isolation. Not
        included in production builds.
      </p>
    </main>
  );
}
