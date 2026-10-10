import { useEffect, useRef, type ReactNode } from "react";
import { isKnown, tokenize } from "@/lib/classes";
import { normLogic } from "@/lib/decide";
import { cn } from "@/lib/cn";
import type { Lesson } from "@/lib/lessons";
import { codeButtonClass } from "@/components/codelingo/rich-text";

const TYPE = "font-mono text-base leading-6 lg:text-sm lg:leading-5";

function staticLines(lesson: Lesson): string[] {
  if (lesson.scene === "cta") {
    return ["<button", ">", "  Book a demo", "</button>"];
  }
  if (lesson.scene === "decide") return [];
  return ["<section", ">", "  <p>Workshop</p>", "  <h2>Pricing clinic</h2>", "  <p>Thu · 12 seats</p>", "</section>"];
}

function ClassMirror({ value }: { value: string }) {
  if (!value) return <span className="text-ink-faint">type classes</span>;
  const parts = value.split(/(\s+)/);
  return (
    <>
      {parts.map((part, index) => {
        if (/^\s+$/.test(part)) return <span key={index}>{part}</span>;
        const known = isKnown(part);
        return (
          <span key={index} className={known ? "text-green" : "text-magenta underline decoration-wavy"}>
            {part}
          </span>
        );
      })}
    </>
  );
}

type CodeEditorProps = {
  lesson: Lesson;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  shakeTick: number;
  shelf: string[];
  onToggle: (token: string) => void;
};

export function CodeEditor({ lesson, value, onChange, onSubmit, shakeTick, shelf, onToggle }: CodeEditorProps) {
  const frame = useRef<HTMLDivElement>(null);
  const lines = staticLines(lesson);
  const lineMode = lesson.editor === "line";
  const unknown = lineMode ? [] : tokenize(value).filter((token) => !isKnown(token));
  const active = new Set(
    lineMode ? [lesson.decide?.from === "condition" ? normLogic(value) : value.trim()] : tokenize(value),
  );

  useEffect(() => {
    const node = frame.current;
    if (!node || shakeTick === 0) return;
    node.classList.remove("animate-shake");
    void node.offsetWidth;
    node.classList.add("animate-shake");
  }, [shakeTick]);

  return (
    <div ref={frame} className="flex flex-col rounded-xl bg-indigo p-3 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-display text-kicker uppercase text-ink-soft">Editor</h2>
        <button
          type="button"
          onClick={() => onChange(lesson.initial)}
          className="press min-h-11 rounded-sm bg-onyx px-3 text-sm font-medium text-ink"
        >
          Reset line
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-lg bg-pitch">
        <div className="flex items-center gap-2 border-b border-hairline px-4 py-2">
          <span className="size-2 rounded-full bg-magenta" />
          <span className="size-2 rounded-full bg-blurple" />
          <span className="size-2 rounded-full bg-link" />
          <span className="ml-1 font-mono text-xs text-ink-faint">{lesson.file}</span>
        </div>
        <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-y-1 px-2 py-3">
          {lineMode && lesson.snippet ? (
            <LogicLines lesson={lesson} value={value} onChange={onChange} onSubmit={onSubmit} />
          ) : (
            <ClassLines lines={lines} value={value} onChange={onChange} onSubmit={onSubmit} />
          )}
        </div>
      </div>
      {unknown.length > 0 ? (
        <p className="mt-3 text-sm text-magenta">
          {unknown.join(" ")} is not in this course yet, so the preview will ignore it.
        </p>
      ) : null}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">
        {shelf.map((token) => (
          <button key={token} type="button" onClick={() => onToggle(token)} className={cn(codeButtonClass(active.has(token)), "shrink-0")}>
            {token}
          </button>
        ))}
      </div>
    </div>
  );
}

function ClassLines({
  lines,
  value,
  onChange,
  onSubmit,
}: {
  lines: string[];
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <>
      <LineNo n={1} />
      <p className={cn(TYPE, "text-magenta")}>{lines[0]}</p>
      <LineNo n={2} hot />
      <div className="flex min-w-0 items-center rounded-sm bg-blurple/15 pr-3">
        <span className={cn(TYPE, "pl-2 text-ink-faint")} aria-hidden="true">
          {"  "}
        </span>
        <span className={cn(TYPE, "text-link")}>class</span>
        <span className={cn(TYPE, "text-ink")}>=</span>
        <span className={cn(TYPE, "text-green")}>"</span>
        <Editable value={value} onChange={(next) => onChange(next.replace(/["']/g, ""))} onSubmit={onSubmit} label="Class names on this element">
          <ClassMirror value={value} />
        </Editable>
        <span className={cn(TYPE, "text-green")}>"</span>
      </div>
      {lines.slice(1).map((line, index) => (
        <LineRow key={`${line}-${index}`} n={index + 3} text={line} />
      ))}
    </>
  );
}

function LogicLines({
  lesson,
  value,
  onChange,
  onSubmit,
}: {
  lesson: Lesson;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const snippet = lesson.snippet;
  if (!snippet) return null;
  const before = snippet.before.length;
  return (
    <>
      {snippet.before.map((line, index) => (
        <LineRow key={`b-${line}-${index}`} n={index + 1} text={line} />
      ))}
      <LineNo n={before + 1} hot />
      <div className="flex min-w-0 items-center rounded-sm bg-blurple/15 pr-3">
        <span className={cn(TYPE, "pl-2 whitespace-pre")}>
          <JsText text={snippet.prefix} />
        </span>
        <Editable value={value} onChange={onChange} onSubmit={onSubmit} label="The decision on this line">
          {value ? <span className="text-green">{value}</span> : <span className="text-ink-faint">type here</span>}
        </Editable>
        <span className={cn(TYPE, "whitespace-pre")}>
          <JsText text={snippet.suffix} />
        </span>
      </div>
      {snippet.after.map((line, index) => (
        <LineRow key={`a-${line}-${index}`} n={before + 2 + index} text={line} />
      ))}
    </>
  );
}

function Editable({
  value,
  onChange,
  onSubmit,
  label,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-w-12">
      <div className={cn(TYPE, "whitespace-pre")} aria-hidden="true">
        {children}
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[\n\r]/g, ""))}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSubmit();
          }
        }}
        spellCheck={false}
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        aria-label={label}
        className={cn(TYPE, "absolute inset-0 w-full bg-transparent text-transparent caret-ink outline-none")}
      />
    </div>
  );
}

function JsText({ text }: { text: string }) {
  const parts = text.split(/(\b(?:if|else|const|show)\b|".*?")/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('"')) return <span key={index} className="text-green">{part}</span>;
        if (/^(if|else|const|show)$/.test(part)) return <span key={index} className="text-magenta">{part}</span>;
        return <span key={index} className="text-ink-soft">{part}</span>;
      })}
    </>
  );
}
function LineNo({ n, hot = false }: { n: number; hot?: boolean }) {
  return (
    <span className={cn("pr-2 text-right font-mono text-xs leading-6 tabular-nums lg:leading-5", hot ? "text-blurple" : "text-ink-faint")}>
      {n}
    </span>
  );
}

function LineRow({ n, text }: { n: number; text: string }) {
  const tag = text.trim().startsWith("<");
  const note = text.trim().startsWith("//");
  return (
    <>
      <LineNo n={n} />
      <p className={cn(TYPE, "whitespace-pre", tag ? "text-magenta" : note ? "text-ink-faint" : undefined)}>
        {tag || note ? text : <JsText text={text} />}
      </p>
    </>
  );
}
