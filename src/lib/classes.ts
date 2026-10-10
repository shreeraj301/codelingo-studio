export type StyleMap = Record<string, string>;

const BG: Record<string, string> = {
  "bg-blue-600": "#2563eb",
  "bg-blue-500": "#3b82f6",
  "bg-slate-900": "#0f172a",
  "bg-slate-800": "#1e293b",
  "bg-slate-700": "#334155",
  "bg-white": "#ffffff",
  "bg-black": "#000000",
  "bg-rose-500": "#f43f5e",
  "bg-emerald-500": "#10b981",
  "bg-amber-400": "#fbbf24",
  "bg-indigo-500": "#6366f1",
  "bg-fuchsia-500": "#d946ef",
  "bg-transparent": "transparent",
};

const TEXT: Record<string, string> = {
  "text-white": "#ffffff",
  "text-black": "#000000",
  "text-slate-200": "#e2e8f0",
  "text-slate-300": "#cbd5e1",
  "text-slate-600": "#475569",
  "text-slate-900": "#0f172a",
  "text-blue-600": "#2563eb",
};

const PX: Record<string, string> = {
  "px-0": "0px",
  "px-1": "0.25rem",
  "px-2": "0.5rem",
  "px-3": "0.75rem",
  "px-4": "1rem",
  "px-6": "1.5rem",
  "px-8": "2rem",
};

const PY: Record<string, string> = {
  "py-0": "0px",
  "py-1": "0.25rem",
  "py-2": "0.5rem",
  "py-3": "0.75rem",
  "py-4": "1rem",
  "py-6": "1.5rem",
  "py-8": "2rem",
};

const P: Record<string, string> = {
  "p-0": "0px",
  "p-2": "0.5rem",
  "p-4": "1rem",
  "p-6": "1.5rem",
  "p-8": "2rem",
};

const ROUNDED: Record<string, string> = {
  "rounded-none": "0px",
  rounded: "0.25rem",
  "rounded-md": "0.375rem",
  "rounded-lg": "0.5rem",
  "rounded-xl": "0.75rem",
  "rounded-2xl": "1rem",
  "rounded-full": "9999px",
};

const WEIGHT: Record<string, string> = {
  "font-normal": "400",
  "font-medium": "500",
  "font-semibold": "600",
  "font-bold": "700",
};

const SIZE: Record<string, string> = {
  "text-sm": "0.875rem",
  "text-base": "1rem",
  "text-lg": "1.125rem",
  "text-xl": "1.25rem",
  "text-2xl": "1.5rem",
};

const SHADOW: Record<string, string> = {
  "shadow-none": "none",
  shadow: "0 1px 2px rgba(0,0,0,0.4)",
  "shadow-md": "0 6px 16px rgba(0,0,0,0.35)",
  "shadow-lg": "0 16px 40px rgba(15,23,42,0.35)",
};

const GAP: Record<string, string> = {
  "gap-0": "0px",
  "gap-2": "0.5rem",
  "gap-3": "0.75rem",
  "gap-4": "1rem",
  "gap-6": "1.5rem",
};

const TRACKING: Record<string, string> = {
  "tracking-normal": "0em",
  "tracking-wide": "0.05em",
  "tracking-wider": "0.08em",
};

const FAMILY = new Map<string, string>();

function indexFamily(table: Record<string, string>, family: string) {
  for (const key of Object.keys(table)) FAMILY.set(key, family);
}

indexFamily(BG, "bg");
indexFamily(TEXT, "text");
indexFamily(PX, "px");
indexFamily(PY, "py");
indexFamily(P, "p");
indexFamily(ROUNDED, "rounded");
indexFamily(WEIGHT, "weight");
indexFamily(SIZE, "size");
indexFamily(SHADOW, "shadow");
indexFamily(GAP, "gap");
indexFamily(TRACKING, "tracking");

for (const key of ["flex"]) FAMILY.set(key, "display");
for (const key of ["flex-col", "flex-row"]) FAMILY.set(key, "direction");
for (const key of ["items-center"]) FAMILY.set(key, "items");
for (const key of ["justify-center", "justify-between"]) FAMILY.set(key, "justify");
for (const key of ["w-full"]) FAMILY.set(key, "width");
for (const key of ["uppercase", "normal-case"]) FAMILY.set(key, "transform");

export function familyOf(token: string): string | null {
  return FAMILY.get(token) ?? null;
}

export function isKnown(token: string): boolean {
  return FAMILY.has(token);
}

export function tokenize(input: string): string[] {
  return input.trim().split(/\s+/).filter(Boolean);
}

function paint(style: StyleMap, token: string): boolean {
  if (token in BG) {
    style.backgroundColor = BG[token];
    return true;
  }
  if (token in TEXT) {
    style.color = TEXT[token];
    return true;
  }
  if (token in PX) {
    style.paddingLeft = PX[token];
    style.paddingRight = PX[token];
    return true;
  }
  if (token in PY) {
    style.paddingTop = PY[token];
    style.paddingBottom = PY[token];
    return true;
  }
  if (token in P) {
    style.paddingTop = P[token];
    style.paddingRight = P[token];
    style.paddingBottom = P[token];
    style.paddingLeft = P[token];
    return true;
  }
  if (token in ROUNDED) {
    style.borderRadius = ROUNDED[token];
    return true;
  }
  if (token in WEIGHT) {
    style.fontWeight = WEIGHT[token];
    return true;
  }
  if (token in SIZE) {
    style.fontSize = SIZE[token];
    return true;
  }
  if (token in SHADOW) {
    style.boxShadow = SHADOW[token];
    return true;
  }
  if (token in GAP) {
    style.gap = GAP[token];
    return true;
  }
  if (token in TRACKING) {
    style.letterSpacing = TRACKING[token];
    return true;
  }
  if (token === "flex") {
    style.display = "flex";
    return true;
  }
  if (token === "flex-col") {
    style.flexDirection = "column";
    return true;
  }
  if (token === "flex-row") {
    style.flexDirection = "row";
    return true;
  }
  if (token === "items-center") {
    style.alignItems = "center";
    return true;
  }
  if (token === "justify-center") {
    style.justifyContent = "center";
    return true;
  }
  if (token === "justify-between") {
    style.justifyContent = "space-between";
    return true;
  }
  if (token === "w-full") {
    style.width = "100%";
    return true;
  }
  if (token === "uppercase") {
    style.textTransform = "uppercase";
    return true;
  }
  if (token === "normal-case") {
    style.textTransform = "none";
    return true;
  }
  return false;
}

export function interpret(input: string): { style: StyleMap; unknown: string[] } {
  const style: StyleMap = {};
  const unknown: string[] = [];
  for (const token of tokenize(input)) {
    if (!paint(style, token)) unknown.push(token);
  }
  return { style, unknown };
}

export type Override = { token: string; by: string };

export type Grade = {
  ok: boolean;
  missing: string[];
  overridden: Override[];
  unknown: string[];
  style: StyleMap;
};

export function gradeClasses(input: string, required: string[]): Grade {
  const tokens = tokenize(input);
  const { style, unknown } = interpret(input);
  const missing = required.filter((token) => !tokens.includes(token));
  const overridden: Override[] = [];

  for (const token of required) {
    if (!tokens.includes(token)) continue;
    const want: StyleMap = {};
    paint(want, token);
    const family = familyOf(token);
    const at = tokens.lastIndexOf(token);
    let by: string | null = null;
    if (family) {
      for (let i = tokens.length - 1; i > at; i--) {
        if (familyOf(tokens[i]) === family) {
          by = tokens[i];
          break;
        }
      }
    }
    const visuallyOff = Object.keys(want).some((key) => style[key] !== want[key]);
    if (visuallyOff) {
      overridden.push({ token, by: by ?? "a later class" });
    }
  }

  return {
    ok: missing.length === 0 && overridden.length === 0,
    missing,
    overridden,
    unknown,
    style,
  };
}

export function toggleToken(current: string, token: string): string {
  const tokens = tokenize(current);
  const family = familyOf(token);
  const existing = tokens.indexOf(token);
  if (existing >= 0) {
    tokens.splice(existing, 1);
    return tokens.join(" ");
  }
  if (family) {
    const at = tokens.findIndex((item) => familyOf(item) === family);
    if (at >= 0) {
      tokens[at] = token;
      return tokens.filter((item, index) => index === at || familyOf(item) !== family).join(" ");
    }
  }
  tokens.push(token);
  return tokens.join(" ");
}

export function ensureToken(current: string, token: string): string {
  const tokens = tokenize(current);
  if (tokens.includes(token)) return tokens.join(" ");
  return toggleToken(current, token);
}
