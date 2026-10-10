import { cn } from "@/lib/cn";

type RichTextProps = {
  text: string;
  onCode?: (token: string) => void;
  className?: string;
};

export function RichText({ text, onCode, className }: RichTextProps) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!(part.startsWith("`") && part.endsWith("`") && part.length > 2)) {
          return <span key={index}>{part}</span>;
        }
        const token = part.slice(1, -1);
        if (!onCode) {
          return (
            <code key={index} className="rounded-xs bg-pitch px-1.5 py-0.5 font-mono text-sm text-green">
              {token}
            </code>
          );
        }
        return (
          <button
            key={index}
            type="button"
            onClick={() => {
              for (const piece of token.split(/\s+/)) onCode(piece);
            }}
            className="press mx-0.5 inline-flex min-h-8 items-center rounded-xs bg-pitch px-1.5 align-baseline font-mono text-sm text-green"
          >
            {token}
          </button>
        );
      })}
    </span>
  );
}

export function codeButtonClass(active: boolean) {
  return cn(
    "press min-h-11 rounded-sm border px-3 py-2 font-mono text-sm",
    active ? "border-blurple bg-blurple text-ink" : "border-hairline bg-pitch text-ink-soft",
  );
}
