import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail, ArrowUp, Check } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce, EASE_OUT_EXPO } from "@/lib/motion";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const exploreLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Reservation", path: "/reservation" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const subscribedTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (subscribedTimerRef.current !== undefined) {
        window.clearTimeout(subscribedTimerRef.current);
      }
    };
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    if (subscribedTimerRef.current !== undefined) {
      window.clearTimeout(subscribedTimerRef.current);
    }
    subscribedTimerRef.current = window.setTimeout(() => setSubscribed(false), 4000);
  };

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      className="relative overflow-hidden border-t border-amber/20"
      style={{ background: "linear-gradient(180deg, #0E0D0C 0%, #141414 50%, #0A0A0A 100%)" }}
    >
      {/* Ambient amber glow */}
      <div className="pointer-events-none absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.10)_0%,transparent_70%)] blur-3xl animate-drift-slow" />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,230,211,0.05)_0%,transparent_70%)] blur-3xl animate-drift-slow"
        style={{ animationDelay: "-7s" }}
      />
      {/* Engraved corner brackets */}
      <span aria-hidden="true" className="hidden md:block pointer-events-none absolute top-10 left-10 w-10 h-10 border-l border-t border-amber/30" />
      <span aria-hidden="true" className="hidden md:block pointer-events-none absolute top-10 right-10 w-10 h-10 border-r border-t border-amber/30" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.08)}
        className="relative max-w-7xl mx-auto px-6 pt-24 pb-10"
      >
        {/* === Poetic farewell + monogram === */}
        <motion.div variants={fadeUp} className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-12 bg-amber/45" />
            <span className="w-1.5 h-1.5 rotate-45 border border-amber" aria-hidden="true" />
            <span className="h-px w-12 bg-amber/45" />
          </div>
          <p className="font-mono text-[12px] tracking-[0.45em] uppercase text-amber mb-5">
            Maison La Breva
          </p>
          <h2 className="font-display italic text-5xl md:text-7xl text-blush leading-[0.95] tracking-tight">
            La <span className="text-gold-shimmer not-italic font-display italic">Breva</span>
          </h2>
          <p className="font-accent italic text-lg md:text-xl text-parchment/75 mt-5 max-w-xl mx-auto leading-relaxed">
            &ldquo;Where Mediterranean elegance meets Moroccan soul.&rdquo;
          </p>
        </motion.div>

        {/* === Newsletter strip === */}
        <motion.div variants={fadeUp} className="max-w-2xl mx-auto mb-20 md:mb-24">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-amber/40" />
            <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber">Stay in Touch</p>
            <span className="h-px w-10 bg-amber/40" />
          </div>
          <p className="font-accent italic text-base md:text-lg text-parchment/70 text-center mb-7 leading-relaxed">
            Seasonal menus, private nights, and quiet invitations &mdash; delivered four times a year.
          </p>

          <AnimatePresence mode="wait">
            {subscribed ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                className="flex items-center justify-center gap-3 py-4"
              >
                <Check size={18} className="text-amber" />
                <p className="font-accent italic text-lg text-blush">
                  Merci &mdash; you&apos;re on the list.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent border-b border-blush/25 text-blush py-3 px-1 focus:border-amber focus:outline-none transition-colors placeholder:text-parchment/40 text-[15px]"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="magnetic-btn inline-flex items-center justify-center gap-2 px-8 py-3 bg-amber text-void font-medium text-[13px] tracking-[0.25em] uppercase rounded-full hover:bg-soft-gold transition-colors"
                >
                  Subscribe
                  <span aria-hidden="true">&rarr;</span>
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* === Three columns === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-16">
          {/* Explore */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-amber/50" />
              <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber">Explore</p>
            </div>
            <ul className="flex flex-col gap-3">
              {exploreLinks.map((link, i) => (
                <motion.li
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.05, duration: 0.6, ease: EASE_OUT_EXPO }}
                >
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-3 font-display italic text-lg text-blush hover:text-amber transition-colors duration-300"
                  >
                    <span className="h-px w-4 bg-amber/40 group-hover:w-8 group-hover:bg-amber transition-all duration-500" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Visit Us */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-amber/50" />
              <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber">Visit Us</p>
            </div>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <MapPin size={16} className="text-amber mt-1 shrink-0" />
                <div>
                  <p className="font-body text-[15px] text-blush leading-snug">
                    12 Rue Sidi El Khiya
                  </p>
                  <p className="font-body text-[14px] text-parchment/70 leading-snug">
                    Fes el Bali &middot; Morocco
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone size={16} className="text-amber mt-1 shrink-0" />
                <a
                  href="tel:+212535123456"
                  className="font-body text-[15px] text-blush hover:text-amber transition-colors underline-grow"
                >
                  +212 535 123 456
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Mail size={16} className="text-amber mt-1 shrink-0" />
                <a
                  href="mailto:bonjour@labreva.ma"
                  className="font-body text-[15px] text-blush hover:text-amber transition-colors underline-grow"
                >
                  bonjour@labreva.ma
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Hours + Social */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-amber/50" />
              <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber">Open Hours</p>
            </div>
            <div className="space-y-2 mb-8">
              {[
                { days: "Mon — Fri", hours: "8 AM – 12 AM" },
                { days: "Saturday", hours: "9 AM – 1 AM" },
                { days: "Sunday", hours: "9 AM – 11 PM" },
              ].map((s) => (
                <div key={s.days} className="flex items-baseline justify-between py-1">
                  <span className="font-display italic text-base text-blush">{s.days}</span>
                  <span className="font-mono text-[13px] tracking-[0.15em] text-parchment/70">
                    {s.hours}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-amber/50" />
              <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber">Follow</p>
            </div>
            <div className="flex items-center gap-5">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/labrevafes/", label: "Instagram" },
                { Icon: Facebook, href: "https://www.facebook.com/moroccanrestaurantlabrevafes?locale=fr_FR", label: "Facebook" },
                { Icon: MessageCircle, href: "https://wa.me/212535123456", label: "WhatsApp" },
              ].map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-amber/30 hover:border-amber hover:bg-amber/10 text-parchment/80 hover:text-amber transition-colors duration-500"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* === Decorative divider === */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-4 my-10"
        >
          <span className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-amber/30 to-amber/30" />
          <span className="w-1.5 h-1.5 rotate-45 border border-amber" aria-hidden="true" />
          <span className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent via-amber/30 to-amber/30" />
        </motion.div>

        {/* === Sub-footer === */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left"
        >
          <p className="font-mono text-[12px] tracking-[0.3em] uppercase text-parchment/55">
            &copy; MMXXV &nbsp;&middot;&nbsp; La Breva
            <span className="hidden md:inline">
              &nbsp;&middot;&nbsp; All rights reserved
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono text-[12px] tracking-[0.25em] uppercase text-parchment/55">
            <a href="#" className="hover:text-amber transition-colors">Privacy</a>
            <span className="text-amber/50" aria-hidden="true">&diams;</span>
            <a href="#" className="hover:text-amber transition-colors">Terms</a>
            <span className="text-amber/50" aria-hidden="true">&diams;</span>
            <span className="text-parchment/55">Crafted in Fes</span>
          </div>

          {/* Back to top */}
          <motion.button
            type="button"
            onClick={scrollTop}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            aria-label="Back to top"
            className="group inline-flex items-center gap-3 font-mono text-[12px] tracking-[0.3em] uppercase text-amber hover:text-soft-gold transition-colors"
          >
            <span>Top</span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full border border-amber/40 group-hover:border-amber group-hover:bg-amber/10 transition-colors duration-500">
              <ArrowUp size={14} />
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom hairline accent */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-amber/40 to-transparent" aria-hidden="true" />
    </footer>
  );
}
