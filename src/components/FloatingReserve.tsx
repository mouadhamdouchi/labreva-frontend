import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion";

export default function FloatingReserve() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="fixed bottom-8 right-6 z-40 md:bottom-10 md:right-10"
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <Link
              to="/reservation"
              className="magnetic-btn inline-flex items-center gap-2.5 px-6 py-3.5 bg-amber text-void text-xs font-medium tracking-wider uppercase rounded-full shadow-[0_10px_40px_-10px_rgba(200,149,108,0.5)] animate-glow-pulse"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-void animate-pulse" aria-hidden="true" />
              Réserver une Table
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
