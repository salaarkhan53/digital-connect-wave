import { Button } from '@/components/ui/Button';
import { HeroSymbol } from '@/components/symbol/HeroSymbol';

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden pt-[var(--header-h)]">
      <div className="mesh-field absolute inset-0 -z-20" aria-hidden="true" />
      <HeroSymbol className="pointer-events-none absolute right-0 top-1/2 -z-10 aspect-square w-[min(40rem,80%)] -translate-y-1/2 opacity-40" />

      <div className="shell">
        <p className="font-display text-sm font-medium uppercase tracking-[0.18em] text-spark/80">
          404
        </p>
        <h1 className="mt-5 max-w-2xl text-[length:var(--text-h1)] font-semibold text-white">
          That line is not connected.
        </h1>
        <p className="mt-5 max-w-lg text-[length:var(--text-lede)] text-white/55">
          The page you were after has moved or never existed. The main routes are
          all still where you left them.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/capabilities" variant="ghost" icon={false}>
            See capabilities
          </Button>
        </div>
      </div>
    </section>
  );
}
