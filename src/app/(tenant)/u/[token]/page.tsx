export default async function TenantUnitPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-2 p-6">
      <h1 className="text-xl font-semibold">Your unit</h1>
      <p className="text-neutral-600">
        Placeholder tenant page for link token <code>{token}</code>. No
        product screens are implemented yet.
      </p>
    </main>
  );
}
