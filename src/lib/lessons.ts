import { gradeClasses, type Grade } from "@/lib/classes";
import { normLogic } from "@/lib/decide";

export type Scene = "cta" | "card" | "stack" | "decide";

export type Snippet = {
  before: string[];
  prefix: string;
  suffix: string;
  after: string[];
};

export type DecideSpec = {
  seats: number[];
  trueLabel: string;
  falseLabel: string;
  from: "condition" | "else";
};

export type Lesson = {
  id: string;
  title: string;
  kicker: string;
  body: string;
  instruction: string;
  hint: string;
  reveal: string;
  success: string;
  xp: number;
  scene: Scene;
  file: string;
  initial: string;
  required: string[];
  shelf: string[];
  editor?: "classes" | "line";
  snippet?: Snippet;
  decide?: DecideSpec;
};

export type Module = {
  id: string;
  index: string;
  title: string;
  blurb: string;
  clear: string;
  lessons: Lesson[];
};

export const MODULES: Module[] = [
  {
    id: "button",
    index: "01",
    title: "The button people tap",
    blurb: "Fill, ink, air, corners, and weight. The five words behind a call to action.",
    clear: "You can see why a button looks like a button. That's the whole trick.",
    lessons: [
      {
        id: "m1-color",
        title: "Styling the call-to-action",
        kicker: "Color",
        body: "A background color is the fill behind a label. Text color is the ink of the words. A strong fill under light ink is how a flat sentence starts to look like something a person can press.",
        instruction:
          "Change the button's background color to `bg-blue-600` and the text color to `text-white`.",
        hint: "Fill classes start with `bg-`. Ink classes start with `text-`. You want blue-600 behind the words and white on the words. If a slate class is still in the line, it can cover the new one.",
        reveal: "Use `bg-blue-600` and `text-white`. Remove `bg-slate-800` and `text-slate-300`.",
        success: "Blue fill, white words. That button reads from across the room.",
        xp: 20,
        scene: "cta",
        file: "button.html",
        initial: "px-6 py-3 rounded-lg font-semibold bg-slate-800 text-slate-300",
        required: ["bg-blue-600", "text-white"],
        shelf: ["bg-blue-600", "text-white", "bg-slate-800", "text-slate-300", "bg-rose-500", "text-black"],
      },
      {
        id: "m1-pad",
        title: "Room to tap",
        kicker: "Padding",
        body: "Padding is empty space inside the edges, between the words and the border. It is not the gap outside the button. Too little, and the label feels crushed against the sides.",
        instruction: "The label is crushed. Set horizontal padding to `px-6` and vertical padding to `py-3`.",
        hint: "`px` is left and right. `py` is top and bottom. The comfortable pair here is 6 across and 3 down.",
        reveal: "Replace the tight spacing with `px-6` and `py-3`.",
        success: "That cushion is the difference between a label and a button.",
        xp: 20,
        scene: "cta",
        file: "button.html",
        initial: "bg-blue-600 text-white rounded-lg font-semibold px-1 py-0",
        required: ["px-6", "py-3"],
        shelf: ["px-6", "py-3", "px-1", "py-0", "px-8", "py-4"],
      },
      {
        id: "m1-round",
        title: "Softer corners",
        kicker: "Radius",
        body: "Corners are a tone of voice. Sharp corners feel like a warning label. A generous radius feels like an invitation. `rounded-lg` is the everyday friendly one.",
        instruction: "Square corners feel like a warning. Add `rounded-lg`.",
        hint: "Radius classes start with `rounded-`. Friendly is `rounded-lg`. If `rounded-none` is still in the line, it is winning.",
        reveal: "Put `rounded-lg` on the line and drop `rounded-none`.",
        success: "Same button, softer voice. It looks like it wants a click.",
        xp: 20,
        scene: "cta",
        file: "button.html",
        initial: "bg-blue-600 text-white px-6 py-3 font-semibold rounded-none",
        required: ["rounded-lg"],
        shelf: ["rounded-lg", "rounded-none", "rounded-full", "rounded-md"],
      },
      {
        id: "m1-weight",
        title: "Heavier words",
        kicker: "Type",
        body: "Weight is how loud the letters are. A call to action should outweigh the sentence beside it, or the eye keeps walking. Size helps. Weight does the shouting.",
        instruction: "Make the words heavier and larger. Add `font-bold` and `text-lg`.",
        hint: "`font-bold` is the weight. `text-lg` is the size. They are different jobs, and both belong on this button.",
        reveal: "Add `font-bold` and `text-lg`. Let them replace `font-normal` and `text-sm`.",
        success: "The words now outweigh the sentence next to them. That's the job.",
        xp: 20,
        scene: "cta",
        file: "button.html",
        initial: "bg-blue-600 text-white px-6 py-3 rounded-lg font-normal text-sm",
        required: ["font-bold", "text-lg"],
        shelf: ["font-bold", "text-lg", "font-normal", "text-sm", "font-semibold", "text-xl"],
      },
      {
        id: "m1-hero",
        title: "The full shout",
        kicker: "Hero",
        body: "You have the pieces: fill, ink, air, corners, weight. A hero button uses all of them, then goes one step louder — all caps, a pill shape, and a little space between the letters.",
        instruction:
          "Build the hero. Include `bg-blue-600`, `text-white`, `px-8`, `py-4`, `rounded-full`, `font-bold`, `uppercase`, and `tracking-wide`.",
        hint: "Eight classes, one per job. An old slate fill or a square corner still in the line can cancel the new one.",
        reveal:
          "The line needs `bg-blue-600` `text-white` `px-8` `py-4` `rounded-full` `font-bold` `uppercase` `tracking-wide`.",
        success: "That's a hero button. You just styled a real call to action.",
        xp: 40,
        scene: "cta",
        file: "button.html",
        initial: "bg-slate-800 text-slate-300 px-2 py-1 rounded-none font-normal",
        required: [
          "bg-blue-600",
          "text-white",
          "px-8",
          "py-4",
          "rounded-full",
          "font-bold",
          "uppercase",
          "tracking-wide",
        ],
        shelf: [
          "bg-blue-600",
          "text-white",
          "px-8",
          "py-4",
          "rounded-full",
          "font-bold",
          "uppercase",
          "tracking-wide",
          "bg-slate-800",
          "rounded-none",
        ],
      },
    ],
  },
  {
    id: "card",
    index: "02",
    title: "The card that holds",
    blurb: "A white surface, space inside it, and even gaps so the lines stop colliding.",
    clear: "A card is fill, air, and rhythm. You can ask for those by name now.",
    lessons: [
      {
        id: "m2-surface",
        title: "Paint the card",
        kicker: "Surface",
        body: "A card is a surface that says these words belong together. White fill, dark ink, and round corners turn a loose pile of lines into an object sitting on the page.",
        instruction: "Style the box. Give it `bg-white`, `text-slate-900`, and `rounded-2xl`.",
        hint: "Three jobs: a white fill, dark ink, and a large radius. `rounded-2xl` is rounder than `rounded-lg`.",
        reveal: "Use `bg-white`, `text-slate-900`, and `rounded-2xl`.",
        success: "It reads as an object now, not leftover text.",
        xp: 20,
        scene: "card",
        file: "card.html",
        initial: "bg-transparent text-white rounded-none",
        required: ["bg-white", "text-slate-900", "rounded-2xl"],
        shelf: ["bg-white", "text-slate-900", "rounded-2xl", "bg-transparent", "text-white", "rounded-none"],
      },
      {
        id: "m2-pad",
        title: "Space inside",
        kicker: "Padding",
        body: "Padding on a card is the margin of a printed page, just inside the box. Without it, the words touch the edge and the card feels unfinished.",
        instruction: "The words are touching the edges. Add `p-6`.",
        hint: "`p-6` sets the space on every side at once. One class, four edges.",
        reveal: "Add `p-6` and let it replace `p-0`.",
        success: "The words sit inside the card now.",
        xp: 20,
        scene: "card",
        file: "card.html",
        initial: "bg-white text-slate-900 rounded-2xl p-0",
        required: ["p-6"],
        shelf: ["p-6", "p-0", "p-2", "p-8"],
      },
      {
        id: "m2-stack",
        title: "Even gaps",
        kicker: "Stack",
        body: "When lines stack with no gap, they glue into one lump. `flex` lets you steer the box. `flex-col` stacks the lines downward. `gap-4` is the even space between them — not inside each line.",
        instruction: "Unstick the lines. Add `flex`, `flex-col`, and `gap-4`.",
        hint: "`flex` unlocks the layout. `flex-col` stacks downward. `gap-4` is the space between the lines.",
        reveal: "Add all three: `flex`, `flex-col`, and `gap-4`.",
        success: "Even gaps. The card finally has a rhythm.",
        xp: 30,
        scene: "stack",
        file: "card.html",
        initial: "bg-white text-slate-900 rounded-2xl p-6",
        required: ["flex", "flex-col", "gap-4"],
        shelf: ["flex", "flex-col", "gap-4", "flex-row", "gap-0", "gap-2"],
      },
    ],
  },
  {
    id: "decide",
    index: "03",
    title: "Decisions",
    blurb: "If the seats are scarce, say so. If they are not, say something else.",
    clear: "A product is a pile of ifs. You just wrote one that tells the truth.",
    lessons: [
      {
        id: "m3-if",
        title: "Ask the question",
        kicker: "If",
        body: "An if is a yes-or-no the product asks before it shows something. This workshop has 2 seats left. The question should come out yes only when seats are running out.",
        instruction: "Change the question to `seats < 3`.",
        hint: "`<` means fewer than. Two seats should make the question yes. `seats > 10` is yes only when the room is busy, so the warning stays hidden.",
        reveal: "The question is `seats < 3`.",
        success: "Two seats left, and the page says so. The if ran.",
        xp: 30,
        scene: "decide",
        file: "decide.js",
        editor: "line",
        initial: "seats > 10",
        required: ["seats < 3"],
        shelf: ["seats < 3", "seats > 10", "seats === 0", "seats > 3"],
        snippet: {
          before: ["const seats = 2"],
          prefix: "if (",
          suffix: ") {",
          after: ['  show("Almost full")', "}"],
        },
        decide: { seats: [2], trueLabel: "Almost full", falseLabel: "", from: "condition" },
      },
      {
        id: "m3-else",
        title: "The other door",
        kicker: "Else",
        body: "If the question is no, that branch does nothing. Else is the other door — the words the page uses when seats are fine. This week has 12 left, so the if stays shut.",
        instruction: "Set the else words to `Open`.",
        hint: "Else is the backup sentence. Twelve seats is not scarce, so the visitor should read Open, not a warning.",
        reveal: "The else words are `Open`.",
        success: "Plenty of seats, so the page stays calm. That's the else doing its job.",
        xp: 30,
        scene: "decide",
        file: "decide.js",
        editor: "line",
        initial: "Closed",
        required: ["Open"],
        shelf: ["Open", "Closed", "Sold out", "Waitlist"],
        snippet: {
          before: ["const seats = 12", "if (seats < 3) {", '  show("Almost full")', "} else {"],
          prefix: '  show("',
          suffix: '")',
          after: ["}"],
        },
        decide: { seats: [12], trueLabel: "Almost full", falseLabel: "", from: "else" },
      },
      {
        id: "m3-both",
        title: "Both at once",
        kicker: "Branch",
        body: "The same question has to work on a quiet week and a full one. Two seats should warn. Twelve seats should not. One question, two honest answers.",
        instruction: "Write `seats < 3` so only the scarce workshop warns.",
        hint: "You want yes for 2 and no for 12. Fewer than 3 does that. More than 0 is yes for both, so both workshops shout.",
        reveal: "Use `seats < 3`.",
        success: "Same rule, two rooms. Only the scarce one raises its hand.",
        xp: 40,
        scene: "decide",
        file: "decide.js",
        editor: "line",
        initial: "seats > 0",
        required: ["seats < 3"],
        shelf: ["seats < 3", "seats > 0", "seats < 20", "seats === 2"],
        snippet: {
          before: ["// checked at 2 seats and at 12"],
          prefix: "if (",
          suffix: ") {",
          after: ['  show("Almost full")', "} else {", '  show("Open")', "}"],
        },
        decide: { seats: [2, 12], trueLabel: "Almost full", falseLabel: "Open", from: "condition" },
      },
    ],
  },
];

export function allLessons(): Lesson[] {
  return MODULES.flatMap((module) => module.lessons);
}

export function findLesson(id: string): Lesson {
  return allLessons().find((lesson) => lesson.id === id) ?? allLessons()[0];
}

export function moduleOf(lessonId: string): Module {
  return MODULES.find((module) => module.lessons.some((lesson) => lesson.id === lessonId)) ?? MODULES[0];
}

export function lessonState(id: string, completed: string[]): "done" | "current" | "locked" {
  if (completed.includes(id)) return "done";
  const open = allLessons().find((lesson) => !completed.includes(lesson.id));
  return open?.id === id ? "current" : "locked";
}

export function nextLesson(id: string): Lesson | null {
  const lessons = allLessons();
  const index = lessons.findIndex((lesson) => lesson.id === id);
  return lessons[index + 1] ?? null;
}

export function lineKey(lesson: Lesson, value: string): string {
  if (lesson.editor === "line" && lesson.decide?.from === "condition") return normLogic(value);
  return value.trim();
}

export function gradeLesson(lesson: Lesson, value: string): Grade {
  if (lesson.editor !== "line") return gradeClasses(value, lesson.required);
  const got = lineKey(lesson, value);
  const want = lineKey(lesson, lesson.required[0] ?? "");
  const ok = got.length > 0 && got === want;
  return { ok, missing: ok ? [] : [want], overridden: [], unknown: [], style: {} };
}

export function percent(completed: string[], lessons: Lesson[]): number {
  if (!lessons.length) return 0;
  const done = lessons.filter((lesson) => completed.includes(lesson.id)).length;
  return Math.round((done / lessons.length) * 100);
}
