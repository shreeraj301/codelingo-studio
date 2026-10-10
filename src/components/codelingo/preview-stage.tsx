import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { StyleMap } from "@/lib/classes";
import { branchLabel } from "@/lib/decide";
import type { Lesson, Scene } from "@/lib/lessons";

const FIXED_BUTTON: CSSProperties = {
  margin: 0,
  border: "none",
  backgroundColor: "var(--color-blurple)",
  color: "var(--color-ink)",
  borderRadius: "12px",
  padding: "0.7rem 1rem",
  fontWeight: 700,
  fontFamily: "inherit",
  lineHeight: 1.1,
};

function targetStyle(style: StyleMap): CSSProperties {
  return {
    margin: 0,
    border: "none",
    fontFamily: "inherit",
    lineHeight: 1.15,
    backgroundColor: "transparent",
    color: "inherit",
    ...(style as CSSProperties),
  };
}

type PreviewStageProps = {
  lesson: Lesson;
  value: string;
  style: StyleMap;
};

export function PreviewStage({ lesson, value, style }: PreviewStageProps) {
  const paint = targetStyle(style);
  return (
    <section className="flex h-full min-h-0 flex-col rounded-xl bg-indigo p-3 sm:p-5">
      <div className="mb-2 flex items-center justify-between gap-3 sm:mb-3">
        <h2 className="font-display text-kicker uppercase text-ink-soft">Live app preview</h2>
        <span className="inline-flex items-center gap-2 font-display text-kicker uppercase text-link">
          <span className="size-2 rounded-full bg-link" aria-hidden="true" />
          Live
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-pitch shadow-glow">
        <div className="flex items-center gap-2 border-b border-hairline px-3 py-1.5 sm:px-4 sm:py-2">
          <span className="size-2 rounded-full bg-magenta" />
          <span className="size-2 rounded-full bg-blurple" />
          <span className="size-2 rounded-full bg-link" />
          <span className="ml-1 font-mono text-xs text-ink-faint">northwind.app</span>
        </div>
        <div className="flex flex-1 items-center justify-center overflow-auto p-3 sm:p-6">
          {lesson.scene === "cta" ? (
            <Cta style={paint} />
          ) : lesson.scene === "decide" && lesson.decide ? (
            <Decide value={value} spec={lesson.decide} />
          ) : (
            <Card style={paint} scene={lesson.scene} />
          )}
        </div>
      </div>
    </section>
  );
}

function Cta({ style }: { style: CSSProperties }) {
  return (
    <div className="w-full max-w-xs">
      <p className="font-display text-kicker uppercase text-link">Northwind</p>
      <h3 className="mt-1 font-display text-xl font-bold uppercase leading-none sm:mt-2 sm:text-3xl">Ship the quarter.</h3>
      <p className="mt-2 hidden text-sm leading-relaxed text-pretty text-ink-soft sm:block">
        Two days on the real roadmap. No slides about synergy.
      </p>
      <button type="button" className="live-target mt-3 inline-flex items-center sm:mt-5" style={style}>
        Book a demo
      </button>
    </div>
  );
}

function Decide({
  value,
  spec,
}: {
  value: string;
  spec: NonNullable<Lesson["decide"]>;
}) {
  const cards = spec.seats.map((seats) => ({ seats, ...branchLabel({ ...spec, value, seats }) }));
  const lost = cards.some((card) => !card.understood);
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      {cards.map((card) => (
        <div key={card.seats} className="rounded-lg bg-indigo px-3 py-2.5">
          <p className="font-display text-kicker uppercase text-link">Pricing clinic</p>
          <p className="mt-1 font-display text-xl font-bold uppercase leading-none tabular-nums">{card.seats} seats left</p>
          {card.tone === "warn" ? (
            <p className="mt-2 inline-flex rounded-lg bg-magenta px-2 py-1 font-display text-kicker uppercase text-ink">{card.label}</p>
          ) : card.tone === "calm" ? (
            <p className="mt-2 inline-flex rounded-lg bg-pitch px-2 py-1 font-display text-kicker uppercase text-link">{card.label}</p>
          ) : (
            <p className="mt-2 text-sm text-ink-faint">No flag. The question came out no.</p>
          )}
        </div>
      ))}
      {lost ? <p className="text-sm text-magenta">That is not a yes-or-no this lesson understands.</p> : null}
    </div>
  );
}
function Card({ style, scene }: { style: CSSProperties; scene: Scene }) {
  const tight = scene === "stack";
  return (
    <section
      className={cn("live-target w-full max-w-xs", scene === "card" && "flex flex-col items-start gap-3")}
      style={style}
    >
      <p className="font-display text-kicker uppercase" style={{ margin: 0, color: "inherit", lineHeight: tight ? 1 : 1.3 }}>
        Workshop
      </p>
      <h3
        className="font-display text-2xl font-bold uppercase"
        style={{ margin: 0, color: "inherit", lineHeight: tight ? 1 : 1.05 }}
      >
        Pricing clinic
      </h3>
      <p className="text-sm" style={{ margin: 0, color: "inherit", lineHeight: tight ? 1 : 1.4 }}>
        Thu · 12 seats
      </p>
      {scene === "card" ? (
        <button type="button" style={FIXED_BUTTON}>
          Save a seat
        </button>
      ) : null}
    </section>
  );
}
