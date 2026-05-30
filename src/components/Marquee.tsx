interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  speed?: "slow" | "normal" | "fast";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SPEED_MAP = {
  slow: "60s",
  normal: "40s",
  fast: "25s",
};

const SIZE_MAP = {
  sm: "text-2xl md:text-4xl",
  md: "text-4xl md:text-6xl",
  lg: "text-6xl md:text-8xl",
  xl: "text-7xl md:text-9xl",
};

export default function Marquee({
  items,
  reverse = false,
  speed = "normal",
  size = "lg",
  className = "",
}: MarqueeProps) {
  // Double the array for seamless loop
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="flex gap-12 whitespace-nowrap w-max"
        style={{
          animation: `marqueeRoll ${SPEED_MAP[speed]} linear infinite${reverse ? " reverse" : ""}`,
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className={`font-display ${SIZE_MAP[size]} italic text-blush/60 flex items-center gap-12 flex-shrink-0`}
          >
            {item}
            <span className="inline-block w-2 h-2 rotate-45 border border-amber/60" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
