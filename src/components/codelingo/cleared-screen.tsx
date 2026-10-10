import type { Module } from "@/lib/lessons";

type ClearedScreenProps = {
  module: Module;
  onNext: () => void;
  nextLabel: string;
};

export function ClearedScreen({ module, onNext, nextLabel }: ClearedScreenProps) {
  const xp = module.lessons.reduce((sum, lesson) => sum + lesson.xp, 0);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
        <p className="font-display text-kicker uppercase text-magenta">Module {module.index} clear</p>
        <h1 className="font-display text-5xl font-bold uppercase leading-none sm:text-7xl">{module.title}</h1>
        <p className="max-w-xl text-lg leading-relaxed text-pretty text-ink-soft">{module.clear}</p>
        <div className="rounded-xl bg-blurple p-8 text-ink">
          <p className="font-display text-6xl font-bold uppercase leading-none tabular-nums sm:text-7xl">+{xp}</p>
          <p className="mt-3 text-lg font-medium">XP from this module</p>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="press inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-green px-6 py-4 text-lg font-medium text-ink-dark sm:w-auto"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
