import { ChevronLeft, Flame, Heart, Volume2, VolumeX, Zap } from "lucide-react";
import { Mark } from "@/components/codelingo/mark";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress";

type HeaderProps = {
  pct: number;
  label: string;
  showBack: boolean;
  onTrack: () => void;
};

export function Header({ pct, label, showBack, onTrack }: HeaderProps) {
  const xp = useProgress((state) => state.xp);
  const streak = useProgress((state) => state.streak);
  const hearts = useProgress((state) => state.hearts);
  const maxHearts = useProgress((state) => state.maxHearts);
  const muted = useProgress((state) => state.muted);
  const toggleMute = useProgress((state) => state.toggleMute);

  return (
    <header className="relative z-20 shrink-0 border-b border-hairline bg-canvas/90 px-3 py-3 backdrop-blur-md sm:px-5">
      <div className="flex items-center gap-2 sm:gap-3">
        {showBack ? (
          <button
            type="button"
            onClick={onTrack}
            className="press inline-flex size-11 items-center justify-center rounded-sm bg-indigo text-ink"
            aria-label="Back to track"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : null}
        <button type="button" onClick={onTrack} className="press flex min-w-0 items-center gap-2 rounded-sm">
          <Mark />
          <span className="truncate font-display text-base font-bold uppercase leading-none sm:text-lg">CodeLingo</span>
        </button>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <span className="hidden h-11 items-center gap-1.5 rounded-sm bg-indigo px-2.5 font-medium tabular-nums text-ink sm:inline-flex">
            <Zap className="size-4 text-blurple" aria-hidden="true" />
            <span>{xp}</span>
            <span className="hidden text-ink-soft sm:inline">XP</span>
          </span>
          <span className="inline-flex h-11 items-center gap-1.5 rounded-sm bg-indigo px-2.5 font-medium tabular-nums text-ink">
            <Flame className="size-4 text-magenta" aria-hidden="true" />
            <span>{streak}</span>
            <span className="hidden text-ink-soft md:inline">day streak</span>
          </span>
          <span
            className="inline-flex h-11 items-center gap-1.5 rounded-sm bg-indigo px-2.5 font-medium tabular-nums text-ink"
            aria-label={`${hearts} of ${maxHearts} hearts`}
          >
            <Heart
              className={cn("size-4", hearts === 0 ? "text-ink-faint" : "fill-danger text-danger")}
              aria-hidden="true"
            />
            <span>
              {hearts}/{maxHearts}
            </span>
          </span>
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={muted}
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            className="press inline-flex size-11 items-center justify-center rounded-sm bg-indigo text-ink"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div
          className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-indigo"
          role="meter"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}, ${pct} percent complete`}
        >
          <div className="h-full rounded-full bg-blurple transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        <p className="shrink-0 font-display text-kicker uppercase tabular-nums text-ink-soft">
          {pct}% <span className="hidden sm:inline">{label}</span>
        </p>
      </div>
    </header>
  );
}
