import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { viewportOnce, EASE_OUT_EXPO } from "@/lib/motion";

interface ChapterHeadingProps {
  eyebrow: string;
  title: ReactNode;
  align?: "left" | "center";
  theme?: "dark" | "light";
  className?: string;
}

export default function ChapterHeading({
  eyebrow,
  title,
  align = "left",
  theme = "dark",
  className = "",
}: ChapterHeadingProps) {
  const isCenter = align === "center";
  const titleColor = theme === "light" ? "text-[#2A2520]" : "text-blush";

  return (
    <div className={`${isCenter ? "text-center" : ""} ${className}`}>
      <div className={`flex items-center gap-5 mb-6 ${isCenter ? "justify-center" : ""}`}>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
          className="h-px w-12 md:w-20 bg-amber/40 origin-left inline-block"
        />
        <motion.span
          initial={{ opacity: 0, letterSpacing: "0.05em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.18em" }}
          viewport={viewportOnce}
          transition={{ duration: 1.1, delay: 0.2 }}
          className="section-label"
        >
          {eyebrow}
        </motion.span>
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.15 }}
        className={`font-display text-5xl sm:text-6xl md:text-7xl ${titleColor} leading-[1.02] tracking-tight`}
      >
        {title}
      </motion.h2>
    </div>
  );
}
