import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  fadeUp,
  fadeIn,
  scaleIn,
  slideLeft,
  slideRight,
  blurUp,
  viewportOnce,
} from "@/lib/motion";

type RevealVariant = "up" | "fade" | "scale" | "left" | "right" | "blur";

const VARIANT_MAP: Record<RevealVariant, Variants> = {
  up: fadeUp,
  fade: fadeIn,
  scale: scaleIn,
  left: slideLeft,
  right: slideRight,
  blur: blurUp,
};

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "li" | "span";
  amount?: number;
}

export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className,
  as = "div",
  amount = 0.15,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  const variants = reduce ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : VARIANT_MAP[variant];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewportOnce, amount }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}
