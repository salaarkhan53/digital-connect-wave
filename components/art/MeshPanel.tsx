/**
 * Generated brand art, used wherever a stock photo would normally go.
 *
 * Each panel is a deterministic variation on the logo's language — contour
 * lines and a blue glow field — seeded by index so the same slot always draws
 * the same art, and no two sit next to each other looking identical.
 */
export function MeshPanel({
  seed = 0,
  className = '',
}: {
  seed?: number;
  className?: string;
}) {
  const hueShift = (seed * 37) % 60;
  const cx = 20 + ((seed * 23) % 60);
  const cy = 15 + ((seed * 41) % 55);
  const rot = (seed * 17) % 40 - 20;

  return (
    <div className={`pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(70% 70% at ${cx}% ${cy}%, hsl(${208 + hueShift} 92% 45% / 0.55), transparent 72%),
                       radial-gradient(50% 50% at ${100 - cx}% ${100 - cy}%, hsl(${192 + hueShift} 100% 62% / 0.3), transparent 70%)`,
        }}
      />
      {/* Contour lines: concentric ellipses echoing the tube's crosshatch. */}
      <svg
        className="absolute inset-0 size-full opacity-[0.5]"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `rotate(${rot}deg) scale(1.25)` }}
      >
        <g fill="none" stroke="white" strokeOpacity="0.16" strokeWidth="0.4">
          {Array.from({ length: 14 }, (_, i) => (
            <ellipse
              key={i}
              cx={cx * 2}
              cy={cy * 2}
              rx={8 + i * 11}
              ry={5 + i * 7.5}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
