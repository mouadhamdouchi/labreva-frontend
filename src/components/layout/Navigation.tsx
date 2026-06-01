import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { preloadCoreRoutes, preloadRoute } from "@/lib/route-preload";
import { EASE_OUT_EXPO } from "@/lib/motion";

const navLinks = [
  { name: "ACCUEIL", path: "/" },
  { name: "CARTE", path: "/menu" },
  { name: "RÉSERVATION", path: "/reservation" },
  { name: "ÉVÉNEMENTS", path: "/events" },
  { name: "GALERIE", path: "/gallery" },
  { name: "À PROPOS", path: "/about" },
  { name: "CONTACT", path: "/contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    preloadCoreRoutes();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,height,backdrop-filter] duration-300 max-md:bg-[rgba(10,10,10,0.85)] max-md:backdrop-blur-md max-md:border-b max-md:border-white/[0.06] ${
          scrolled ? "h-16 md:glass-nav" : "h-20 md:bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="font-body text-sm font-semibold tracking-[0.14em] text-blush hover:text-amber transition-colors duration-300 relative group"
          >
            <span className="relative">
              LA BREVA
              <span className="absolute -bottom-1 left-0 h-px bg-amber w-0 group-hover:w-full transition-[width] duration-500 ease-out" />
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 relative">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onFocus={() => preloadRoute(link.path)}
                  onPointerEnter={() => preloadRoute(link.path)}
                  className={`relative font-body text-xs font-semibold tracking-[0.1em] py-1 transition-colors duration-300 ${
                    active ? "text-amber" : "text-parchment hover:text-blush"
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.span
                      layoutId={reduce ? undefined : "nav-underline"}
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-amber rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Reserve CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="hidden sm:block"
            >
              <Link
                to="/reservation"
                onFocus={() => preloadRoute("/reservation")}
                onPointerEnter={() => preloadRoute("/reservation")}
                className="magnetic-btn inline-flex items-center px-6 py-2.5 bg-amber text-void text-[12px] md:text-[13px] font-semibold tracking-[0.1em] rounded-full hover:bg-soft-gold transition-colors duration-300 shadow-[0_8px_22px_-12px_rgba(200,149,108,0.5)]"
              >
                Réserver une Table
              </Link>
            </motion.div>
            <button
              className="md:hidden text-parchment hover:text-amber transition-colors duration-200"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex"
                >
                  {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[rgba(10,10,10,0.88)] backdrop-blur-xl flex flex-col items-center justify-center gap-8 overflow-hidden border-t border-white/[0.06]"
          >
            {/* Ambient orb */}
            <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.15)_0%,transparent_70%)] blur-2xl animate-drift-slow" />

            <button
              className="absolute top-6 right-6 text-parchment hover:text-amber transition-colors"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.06, duration: 0.55, ease: EASE_OUT_EXPO }}
                className="relative"
              >
                <Link
                  to={link.path}
                  onFocus={() => preloadRoute(link.path)}
                  onPointerEnter={() => preloadRoute(link.path)}
                  className={`font-display text-4xl transition-colors duration-300 ${
                    isActive(link.path) ? "text-amber" : "text-blush hover:text-amber"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
