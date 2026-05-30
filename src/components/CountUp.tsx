import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface CountUpProps {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  format?: (value: number) => string;
}

export default function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className,
  format,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 70,
    damping: 22,
    duration: duration * 1000,
  });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(to);
      return;
    }
    motionValue.set(to);
  }, [inView, to, motionValue, reduce]);

  useEffect(() => {
    const unsub = spring.on("change", (latest) => {
      setDisplay(latest);
    });
    return () => unsub();
  }, [spring]);

  const rendered = format
    ? format(display)
    : Number.isInteger(to)
    ? Math.round(display).toLocaleString()
    : display.toFixed(1);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
}
