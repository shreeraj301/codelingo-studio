import { cn } from "@/lib/cn";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8 shrink-0", className)} aria-hidden="true">
      <rect width="32" height="32" rx="10" className="fill-blurple" />
      <path
        d="M10 11.5 6.2 16 10 20.5M22 11.5 25.8 16 22 20.5"
        className="stroke-ink"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18.2 9.5 13.8 22.5" className="stroke-green" fill="none" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
