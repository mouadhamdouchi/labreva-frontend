import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface Chapter {
  id: string;
  label: string;
}

interface ScrollProgressRailProps {
  chapters: Chapter[];
}

export default function ScrollProgressRail({ chapters }: ScrollProgressRailProps) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handler = () => {
      const viewportMid = window.innerHeight * 0.4;
      let current = 0;
      chapters.forEach((chapter, idx) => {
        const el = document.getElementById(chapter.id);
        if (!el) return;
        if (el.getBoundingClientRect().top <= viewportMid) {
          current = idx;
        }
      });
      setActiveIndex(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [chapters]);

  if (reduce) return null;

  const active = chapters[activeIndex];

  return (
    <div className="fixed right-5 lg:right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-end gap-5 pointer-events-none">
      {/* Vertical progress bar */}
      <div className="relative h-96 w-[3px] bg-blush/15 rounded-full overflow-hidden">
        <motion.div
          style={{ scaleY: progress }}
          className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-amber via-soft-gold to-amber/60 origin-top rounded-full shadow-[0_0_12px_rgba(200,149,108,0.6)]"
        />
      </div>

      {/* Current chapter label */}
      <div className="flex items-center gap-4 min-h-[20px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={active?.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="font-mono text-sm tracking-[0.22em] uppercase text-amber whitespace-nowrap"
          >
            {active?.label}
          </motion.span>
        </AnimatePresence>
        <span className="block w-3.5 h-3.5 rounded-full bg-amber ring-1 ring-amber/60 ring-offset-2 ring-offset-void shadow-[0_0_20px_rgba(200,149,108,0.9)]" />
      </div>
    </div>
  );
}
