import { useEffect, useState } from "react";
import { ClearedScreen } from "@/components/codelingo/cleared-screen";
import { Header } from "@/components/codelingo/header";
import { LessonScreen } from "@/components/codelingo/lesson-screen";
import { PathScreen } from "@/components/codelingo/path-screen";
import { allLessons, findLesson, moduleOf, nextLesson, percent, type Module } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";

type Screen =
  | { name: "path" }
  | { name: "lesson"; id: string }
  | { name: "cleared"; module: Module; nextId: string | null };

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: "lesson", id: "m1-color" });
  const completed = useProgress((state) => state.completed);
  const completeLesson = useProgress((state) => state.completeLesson);

  useEffect(() => {
    void useProgress.persist.rehydrate();
  }, []);

  const activeLesson = screen.name === "lesson" ? findLesson(screen.id) : null;
  const pct =
    screen.name === "lesson" && activeLesson
      ? percent(completed, moduleOf(activeLesson.id).lessons)
      : percent(completed, allLessons());
  const label = screen.name === "lesson" ? "this module" : "track";

  return (
    <div className="relative z-10 flex h-dvh flex-col overflow-hidden">
      <Header pct={pct} label={label} showBack={screen.name !== "path"} onTrack={() => setScreen({ name: "path" })} />
      {screen.name === "path" ? (
        <PathScreen completed={completed} onOpen={(lesson) => setScreen({ name: "lesson", id: lesson.id })} />
      ) : null}
      {screen.name === "lesson" ? (
        <LessonScreen
          lessonId={screen.id}
          onContinue={(lesson) => {
            completeLesson(lesson.id, lesson.xp);
            const upcoming = nextLesson(lesson.id);
            const module = moduleOf(lesson.id);
            const lastInModule = module.lessons[module.lessons.length - 1]?.id === lesson.id;
            if (lastInModule) {
              setScreen({ name: "cleared", module, nextId: upcoming?.id ?? null });
              return;
            }
            if (upcoming) setScreen({ name: "lesson", id: upcoming.id });
          }}
        />
      ) : null}
      {screen.name === "cleared" ? (
        <ClearedScreen
          module={screen.module}
          nextLabel={screen.nextId ? "Next module" : "Back to the track"}
          onNext={() => {
            if (screen.nextId) setScreen({ name: "lesson", id: screen.nextId });
            else setScreen({ name: "path" });
          }}
        />
      ) : null}
    </div>
  );
}
