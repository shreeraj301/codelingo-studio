import { useEffect, useState } from "react";
import { Check, HeartCrack, X } from "lucide-react";
import { CodeEditor } from "@/components/codelingo/code-editor";
import { Confetti } from "@/components/codelingo/confetti";
import { PreviewStage } from "@/components/codelingo/preview-stage";
import { RichText } from "@/components/codelingo/rich-text";
import { ensureToken, interpret, toggleToken } from "@/lib/classes";
import { findLesson, gradeLesson, lineKey, moduleOf, nextLesson, type Lesson } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";
import { playChime, playMiss } from "@/lib/sfx";
import { cn } from "@/lib/cn";

type Status = "idle" | "bad" | "ok";

type LessonScreenProps = {
  lessonId: string;
  onContinue: (lesson: Lesson) => void;
};

export function LessonScreen({ lessonId, onContinue }: LessonScreenProps) {
  const lesson = findLesson(lessonId);
  const module = moduleOf(lesson.id);
  const place = module.lessons.findIndex((item) => item.id === lesson.id) + 1;
  const [value, setValue] = useState(lesson.initial);
  const [status, setStatus] = useState<Status>("idle");
  const [attempts, setAttempts] = useState(0);
  const [note, setNote] = useState("");
  const [lastWrong, setLastWrong] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [burst, setBurst] = useState(false);
  const hearts = useProgress((state) => state.hearts);
  const loseHeart = useProgress((state) => state.loseHeart);
  const refillHearts = useProgress((state) => state.refillHearts);

  useEffect(() => {
    setValue(lesson.initial);
    setStatus("idle");
    setAttempts(0);
    setNote("");
    setLastWrong(null);
    setBurst(false);
  }, [lesson.id, lesson.initial]);

  useEffect(() => {
    if (!burst) return;
    const timer = window.setTimeout(() => setBurst(false), 1600);
    return () => window.clearTimeout(timer);
  }, [burst]);

  function edit(next: string) {
    setValue(next);
    if (status !== "idle") {
      setStatus("idle");
      setNote("");
    }
  }

  function insert(chunk: string) {
    if (lesson.editor === "line") {
      edit(chunk.trim());
      return;
    }
    const next = chunk
      .split(/\s+/)
      .filter(Boolean)
      .reduce((acc, token) => ensureToken(acc, token), value);
    edit(next);
  }

  function check() {
    if (hearts <= 0) return;
    const grade = gradeLesson(lesson, value);
    if (grade.ok) {
      setStatus("ok");
      setNote(lesson.success);
      playChime();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) setBurst(true);
      return;
    }
    const signature = lineKey(lesson, value);
    if (signature === lastWrong) {
      setStatus("bad");
      setNote("Change the line first. The same answer will not spend another heart.");
      return;
    }
    setLastWrong(signature);
    const left = loseHeart();
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setStatus("bad");
    setShake((tick) => tick + 1);
    playMiss();
    setNote(failureCopy(lesson, nextAttempts, grade, left));
  }

  function submit() {
    if (status === "ok") onContinue(lesson);
    else check();
  }

  const live = interpret(value).style;
  const out = hearts <= 0 && status !== "ok";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {burst ? <Confetti /> : null}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-3 py-3 lg:grid lg:grid-cols-3 lg:px-4">
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto lg:contents">
          <section className="rounded-xl bg-indigo p-4 sm:p-6 lg:min-h-0 lg:overflow-y-auto">
            <p className="font-display text-kicker uppercase text-magenta">
              Module {module.index} · {lesson.kicker}
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold uppercase leading-none sm:mt-3 sm:text-4xl">{lesson.title}</h1>
            <p className="mt-2 text-sm font-medium text-ink-faint">
              Lesson {place} of {module.lessons.length}
            </p>
            <p className="mt-4 hidden text-base leading-relaxed text-pretty text-ink-soft lg:block">{lesson.body}</p>
            <details className="mt-3 lg:hidden">
              <summary className="cursor-pointer font-medium text-link">Why this works</summary>
              <p className="mt-2 text-base leading-relaxed text-pretty text-ink-soft">{lesson.body}</p>
            </details>
            <div className="mt-3 rounded-lg bg-pitch p-3 sm:mt-5 sm:p-4">
              <p className="font-display text-kicker uppercase text-ink-faint">Do this</p>
              <p className="mt-2 text-base leading-relaxed text-pretty">
                <RichText text={lesson.instruction} onCode={insert} />
              </p>
            </div>
          </section>
          <div className="flex flex-col gap-3 lg:min-h-0 lg:overflow-y-auto">
            <CodeEditor
              lesson={lesson}
              value={value}
              onChange={edit}
              onSubmit={submit}
              shakeTick={shake}
              shelf={lesson.shelf}
              onToggle={(token) => {
                if (lesson.editor === "line") edit(lineKey(lesson, value) === lineKey(lesson, token) ? lesson.initial : token);
                else edit(toggleToken(value, token));
              }}
            />
          </div>
        </div>
        <div
          className={cn(
            "shrink-0 lg:h-auto lg:min-h-0 lg:overflow-hidden",
            lesson.decide && lesson.decide.seats.length > 1 ? "h-72" : "h-56",
          )}
        >
          <PreviewStage lesson={lesson} value={value} style={live} />
        </div>
      </div>
      <Dock
        status={out ? "out" : status}
        note={note || (status === "idle" ? "Enter checks the line." : "")}
        onCheck={check}
        onContinue={() => onContinue(lesson)}
        onRefill={() => {
          refillHearts();
          setLastWrong(null);
        }}
      />
    </div>
  );
}

function failureCopy(
  lesson: Lesson,
  attempts: number,
  grade: ReturnType<typeof gradeLesson>,
  heartsLeft: number,
): string {
  const heart = heartsLeft === 0 ? " Hearts are out." : "";
  if (grade.overridden[0]) {
    const { token, by } = grade.overridden[0];
    return `\`${by}\` is painting over \`${token}\`. Leave one class for that job.${heart}`;
  }
  if (attempts >= 2) return `${lesson.reveal}${heart}`;
  return `${lesson.hint}${heart}`;
}

function Dock({
  status,
  note,
  onCheck,
  onContinue,
  onRefill,
}: {
  status: Status | "out";
  note: string;
  onCheck: () => void;
  onContinue: () => void;
  onRefill: () => void;
}) {
  const banner =
    status === "ok" ? "ok" : status === "bad" || status === "out" ? "bad" : null;
  return (
    <div className="dock-safe relative z-40 shrink-0 border-t border-hairline bg-canvas">
      <div role="status" aria-live="polite">
        {banner ? (
          <div
            className={cn(
              "flex items-start gap-3 px-4 py-3 sm:px-5",
              banner === "ok" ? "bg-green text-ink-dark" : "bg-danger text-ink",
            )}
          >
            {banner === "ok" ? (
              <Check className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            ) : (
              <X className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            )}
            <p className="text-sm font-medium leading-relaxed sm:text-base">
              <RichText text={note} />
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:px-5">
        {banner ? null : <p className="hidden text-sm text-ink-soft sm:mr-auto sm:block">{note}</p>}
        {status === "out" ? (
          <button
            type="button"
            onClick={onRefill}
            className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-blurple px-6 py-3 text-lg font-medium text-ink sm:ml-auto sm:py-4"
          >
            <HeartCrack className="size-5" aria-hidden="true" />
            Refill hearts
          </button>
        ) : status === "ok" ? (
          <button
            type="button"
            onClick={onContinue}
            className="press inline-flex min-h-12 items-center justify-center rounded-sm bg-green px-6 py-3 text-lg font-medium text-ink-dark sm:ml-auto sm:py-4"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={onCheck}
            className="press inline-flex min-h-12 items-center justify-center rounded-sm bg-blurple px-6 py-3 text-lg font-medium text-ink sm:ml-auto sm:py-4"
          >
            Check answer
          </button>
        )}
      </div>
    </div>
  );
}
