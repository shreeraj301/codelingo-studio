const COLORS = [
  "var(--color-blurple)",
  "var(--color-green)",
  "var(--color-magenta)",
  "var(--color-ink)",
  "var(--color-link)",
];

function pieces() {
  return Array.from({ length: 42 }, (_, index) => {
    const drift = (index % 2 === 0 ? -1 : 1) * (12 + ((index * 17) % 48));
    return {
      id: index,
      left: (index * 37) % 100,
      delay: (index % 8) * 0.04,
      duration: 1.15 + (index % 5) * 0.12,
      color: COLORS[index % COLORS.length],
      width: index % 3 === 0 ? 8 : 6,
      height: index % 4 === 0 ? 14 : 8,
      dx: `${drift}px`,
      spin: `${180 + (index % 6) * 40}deg`,
      radius: index % 3 === 0 ? "9999px" : "2px",
    };
  });
}

const PIECES = pieces();

export function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {PIECES.map((piece) => (
        <span
          key={piece.id}
          className="absolute top-0"
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.height,
            background: piece.color,
            borderRadius: piece.radius,
            animation: `confetti-fall ${piece.duration}s ease-in ${piece.delay}s both`,
            ["--dx" as string]: piece.dx,
            ["--spin" as string]: piece.spin,
          }}
        />
      ))}
    </div>
  );
}
