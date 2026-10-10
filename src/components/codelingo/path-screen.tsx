import { Check, Lock } from "lucide-react";
import { lessonState, MODULES, type Lesson } from "@/lib/lessons";
import { cn } from "@/lib/cn";

const PHRASE = ["COLOR", "PADDING", "RADIUS", "WEIGHT", "SURFACE", "GAP", "IF", "ELSE"];

type PathScreenProps = {
  completed: string[];
  onOpen: (lesson: Lesson) => void;
};

export function PathScreen({ completed, onOpen }: PathScreenProps) {
  const current = MODULES.flatMap((module) => module.lessons).find(
    (lesson) => lessonState(lesson.id, completed) === "current",
  );

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="overflow-hidden bg-blurple text-ink" aria-hidden="true">
        <div className="marquee-track flex w-max gap-8 py-3">
          {[...PHRASE, ...PHRASE, ...PHRASE, ...PHRASE].map((word, index) => (
            <span key={`${word}-${index}`} className="font-display text-2xl font-bold uppercase leading-none">
              {word}
              <span className="mx-8 text-ink/70">·</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div>
          <p className="font-display text-kicker uppercase text-magenta">Your track</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl font-bold uppercase leading-none sm:text-6xl">
            Learn the words behind the buttons you already approve.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-pretty text-ink-soft">
            Short lessons for people who ship the work without writing the code. Yet.
          </p>
          {current ? (
            <button
              type="button"
              onClick={() => onOpen(current)}
              className="press mt-6 inline-flex min-h-12 items-center rounded-sm bg-green px-6 py-4 text-lg font-medium text-ink-dark"
            >
              Continue · {current.title}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpen(MODULES[0].lessons[0])}
              className="press mt-6 inline-flex min-h-12 items-center rounded-sm bg-green px-6 py-4 text-lg font-medium text-ink-dark"
            >
              Practice the button again
            </button>
          )}
        </div>
        {MODULES.map((module) => {
          const locked = lessonState(module.lessons[0].id, completed) === "locked";
          return (
            <section key={module.id} className={cn("rounded-xl bg-indigo p-5 sm:p-8", locked && "opacity-70")}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-magenta px-3 py-1 font-display text-kicker uppercase text-ink">
                  {module.index}
                </span>
                <h2 className="font-display text-2xl font-bold uppercase leading-none sm:text-3xl">{module.title}</h2>
              </div>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-pretty text-ink-soft">{module.blurb}</p>
              <ol className="mt-6 flex flex-col gap-2">
                {module.lessons.map((lesson, index) => {
                  const state = lessonState(lesson.id, completed);
                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        disabled={state === "locked"}
                        onClick={() => onOpen(lesson)}
                        className={cn(
                          "press flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left sm:px-4",
                          state === "current" && "bg-blurple text-ink shadow-glow",
                          state === "done" && "bg-pitch text-ink",
                          state === "locked" && "bg-pitch text-ink-faint",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex size-11 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold",
                            state === "current" && "bg-ink text-blurple",
                            state === "done" && "bg-blurple text-ink",
                            state === "locked" && "bg-onyx text-ink-faint",
                          )}
                        >
                          {state === "done" ? (
                            <Check className="size-5" aria-hidden="true" />
                          ) : state === "locked" ? (
                            <Lock className="size-4" aria-hidden="true" />
                          ) : (
                            String(index + 1).padStart(2, "0")
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-lg font-bold uppercase leading-tight">
                            {lesson.title}
                          </span>
                          <span className={cn("mt-0.5 block text-sm", state === "current" ? "text-ink" : "text-ink-soft")}>
                            {lesson.kicker} · {lesson.xp} XP
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
