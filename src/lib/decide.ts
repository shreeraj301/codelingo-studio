export function normLogic(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*(<=|>=|===|==|<|>)\s*/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
}

export function evalSeats(expr: string, seats: number): boolean | null {
  const match = normLogic(expr).match(/^seats (<=|>=|===|==|<|>) (\d+)$/);
  if (!match) return null;
  const amount = Number(match[2]);
  switch (match[1]) {
    case "<":
      return seats < amount;
    case ">":
      return seats > amount;
    case "<=":
      return seats <= amount;
    case ">=":
      return seats >= amount;
    case "===":
    case "==":
      return seats === amount;
    default:
      return null;
  }
}

export type DecideTone = "warn" | "calm" | "none";

export function branchLabel(options: {
  from: "condition" | "else";
  value: string;
  seats: number;
  trueLabel: string;
  falseLabel: string;
}): { label: string; tone: DecideTone; understood: boolean } {
  if (options.from === "else") {
    const label = options.value.trim();
    const scarce = evalSeats("seats < 3", options.seats) === true;
    if (scarce) return { label: options.trueLabel, tone: "warn", understood: true };
    if (!label) return { label: "", tone: "none", understood: true };
    return { label, tone: label === "Almost full" ? "warn" : "calm", understood: true };
  }
  const answer = evalSeats(options.value, options.seats);
  if (answer === null) return { label: "", tone: "none", understood: false };
  if (answer) return { label: options.trueLabel, tone: options.trueLabel ? "warn" : "none", understood: true };
  if (!options.falseLabel) return { label: "", tone: "none", understood: true };
  return { label: options.falseLabel, tone: "calm", understood: true };
}
