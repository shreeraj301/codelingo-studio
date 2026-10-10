import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const MAX_HEARTS = 5;

type ProgressState = {
  xp: number;
  streak: number;
  hearts: number;
  maxHearts: number;
  completed: string[];
  muted: boolean;
  completeLesson: (id: string, xp: number) => void;
  loseHeart: () => number;
  refillHearts: () => void;
  toggleMute: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 5,
      hearts: MAX_HEARTS,
      maxHearts: MAX_HEARTS,
      completed: [],
      muted: false,
      completeLesson: (id, xp) =>
        set((state) => {
          if (state.completed.includes(id)) return state;
          return { completed: [...state.completed, id], xp: state.xp + xp };
        }),
      loseHeart: () => {
        const next = Math.max(0, get().hearts - 1);
        set({ hearts: next });
        return next;
      },
      refillHearts: () => set({ hearts: MAX_HEARTS }),
      toggleMute: () => set((state) => ({ muted: !state.muted })),
    }),
    {
      name: "codelingo-progress",
      skipHydration: true,
      version: 1,
      storage: createJSONStorage(() =>
        typeof window === "undefined"
          ? { getItem: () => null, setItem: () => undefined, removeItem: () => undefined }
          : localStorage,
      ),
    },
  ),
);
