import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail, ArrowUp, Check, Clock } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce, EASE_OUT_EXPO } from "@/lib/motion";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const exploreLinks = [
    { name: "Accueil", path: "/" },
    { name: "Carte", path: "/menu" },
    { name: "Réservation", path: "/reservation" },
    { name: "Événements", path: "/events" },
    { name: "Galerie", path: "/gallery" },
    { name: "À Propos", path: "/about" },
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
        initial={false}
        animate="visible"
        variants={staggerContainer(0.08)}
        className="relative max-w-7xl mx-auto px-5 md:px-6 pt-10 md:pt-24 pb-6 md:pb-10"
      >
        {/* === Letterpress Invitation Card (Home only, desktop only) — combines brand quote + newsletter === */}
        {isHome && (
          <motion.div
            variants={fadeUp}
            className="hidden md:block relative max-w-3xl mx-auto mb-20 md:mb-24"
          >
            {/* Engraved card */}
            <div
              className="relative px-10 md:px-16 py-12 md:py-16 overflow-hidden rounded-sm shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)]"
              style={{
                background:
                  "linear-gradient(155deg, rgba(245,230,211,0.06) 0%, rgba(200,149,108,0.10) 50%, rgba(245,230,211,0.04) 100%)",
                border: "1px solid rgba(200,149,108,0.35)",
              }}
            >
              {/* Ambient warm pool inside the card */}
              <div
                className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[450px] h-[450px] rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(200,149,108,0.15) 0%, transparent 65%)",
                }}
              />

              {/* Engraved corner brackets */}
              <span aria-hidden="true" className="absolute top-3 left-3 w-6 h-6 border-l border-t border-amber/75" />
              <span aria-hidden="true" className="absolute top-3 right-3 w-6 h-6 border-r border-t border-amber/75" />
              <span aria-hidden="true" className="absolute bottom-3 left-3 w-6 h-6 border-l border-b border-amber/75" />
              <span aria-hidden="true" className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-amber/75" />

              {/* Brand title + quote */}
              <div className="relative text-center mb-10">
                <h2 className="font-display italic text-5xl md:text-7xl text-blush leading-[0.95] tracking-tight">
                  La <span className="text-gold-shimmer not-italic font-display italic">Breva</span>
                </h2>
                <p className="font-accent font-semibold italic text-xl md:text-2xl lg:text-3xl text-parchment mt-5 max-w-2xl mx-auto leading-[1.45]">
                  &ldquo;Où l&apos;élégance méditerranéenne rencontre l&apos;âme marocaine.&rdquo;
                </p>
              </div>

              {/* Vintage divider — wax-seal style */}
              <div className="relative flex items-center justify-center gap-4 mb-9">
                <span className="h-px flex-1 max-w-[140px] bg-gradient-to-r from-transparent to-amber/40" />
                <span className="font-mono font-bold text-[12px] md:text-[13px] tracking-[0.5em] uppercase text-amber">
                  La Lettre
                </span>
                <span className="h-px flex-1 max-w-[140px] bg-gradient-to-l from-transparent to-amber/40" />
              </div>

              {/* Newsletter copy */}
              <p className="relative font-accent font-semibold italic text-lg md:text-xl lg:text-2xl text-parchment text-center mb-8 max-w-2xl mx-auto leading-[1.5]">
                Menus de saison, soirées privées et invitations discrètes &mdash; livrés quatre fois par an.
              </p>

              {/* Form */}
              <div className="relative max-w-lg mx-auto">
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
                        Merci &mdash; vous êtes inscrit.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubscribe}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="flex-1 bg-void/30 backdrop-blur-sm border border-amber/25 text-blush py-3 px-4 rounded-full focus:border-amber focus:outline-none focus:bg-void/50 transition-all placeholder:text-parchment/45 text-[15px]"
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        className="magnetic-btn inline-flex items-center justify-center gap-2 px-8 py-3 bg-amber text-void font-medium text-[13px] tracking-[0.25em] uppercase rounded-full hover:bg-soft-gold transition-colors shadow-[0_8px_24px_-8px_rgba(200,149,108,0.55)]"
                      >
                        S&apos;abonner
                        <span aria-hidden="true">&rarr;</span>
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* === Section separator (Home only, desktop only) — sets newsletter apart from the directory below === */}
        {isHome && (
          <motion.div
            variants={fadeUp}
            className="hidden md:flex relative items-center justify-center gap-4 my-16 md:my-20"
            aria-hidden="true"
          >
            <span className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-transparent to-amber/45" />
            <span className="w-2 h-2 rotate-45 border border-amber bg-void" />
            <span className="h-px flex-1 max-w-[200px] bg-gradient-to-l from-transparent to-amber/45" />
          </motion.div>
        )}

        {/* === MOBILE COMPACT LAYOUT (md:hidden) === */}
        <div className="md:hidden">
          {/* Brand */}
          <div className="text-center mb-5">
            <h2 className="font-display italic text-3xl text-blush leading-none">
              La <span className="text-gold-shimmer not-italic font-display italic">Breva</span>
            </h2>
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-amber/80 mt-2">
              Fès &middot; Maroc
            </p>
          </div>

          {/* Nav pills */}
          <ul className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-5 px-2">
            {exploreLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="font-display italic text-[15px] text-blush hover:text-amber transition-colors duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Info grid 2x2 */}
          <div className="grid grid-cols-2 gap-3 mb-5 text-[12px]">
            <a
              href="https://maps.app.goo.gl/2n3io47fHbzv6d7Q6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 hover:text-amber transition-colors"
            >
              <MapPin size={13} className="text-amber mt-0.5 shrink-0" />
              <div className="leading-tight">
                <p className="text-blush">La Breva Rooftop</p>
                <p className="text-parchment/60 text-[11px]">Fès &middot; Maroc</p>
              </div>
            </a>
            <div className="flex items-start gap-2">
              <Clock size={13} className="text-amber mt-0.5 shrink-0" />
              <div className="leading-tight">
                <p className="text-blush">Lun-Ven &middot; 8h-0h</p>
                <p className="text-parchment/60 text-[11px]">Sam-Dim &middot; étendu</p>
              </div>
            </div>
            <a href="tel:+212535123456" className="flex items-start gap-2 hover:text-amber transition-colors">
              <Phone size={13} className="text-amber mt-0.5 shrink-0" />
              <span className="text-blush leading-tight">+212 535 123 456</span>
            </a>
            <a href="mailto:bonjour@labreva.ma" className="flex items-start gap-2 hover:text-amber transition-colors">
              <Mail size={13} className="text-amber mt-0.5 shrink-0" />
              <span className="text-blush leading-tight text-[11px]">bonjour@labreva.ma</span>
            </a>
          </div>

          {/* Social + Back to top */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/labrevafes/", label: "Instagram" },
                { Icon: Facebook, href: "https://www.facebook.com/moroccanrestaurantlabrevafes?locale=fr_FR", label: "Facebook" },
                { Icon: MessageCircle, href: "https://wa.me/212535123456", label: "WhatsApp" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-amber/30 text-parchment/80 hover:text-amber hover:border-amber transition-colors"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={scrollTop}
              aria-label="Retour en haut"
              className="flex items-center justify-center w-8 h-8 rounded-full border border-amber/40 text-amber hover:border-amber hover:bg-amber/10 transition-colors"
            >
              <ArrowUp size={13} />
            </button>
          </div>

          {/* Copyright + legal */}
          <div className="border-t border-amber/15 pt-3 flex flex-col items-center gap-1.5">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-parchment/55">
              &copy; 2026 &middot; La Breva
            </p>
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] uppercase text-parchment/55">
              <a href="#" className="hover:text-amber transition-colors">Confidentialité</a>
              <span className="text-amber/40">&diams;</span>
              <a href="#" className="hover:text-amber transition-colors">Mentions Légales</a>
            </div>
          </div>
        </div>

        {/* === Three columns (desktop only) === */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-16">
          {/* Explore */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-amber/50" />
              <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber">Explorer</p>
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
              <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber">Nous Trouver</p>
            </div>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <MapPin size={16} className="text-amber mt-1 shrink-0" />
                <a
                  href="https://maps.app.goo.gl/2n3io47fHbzv6d7Q6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-block"
                >
                  <p className="font-body text-[15px] text-blush leading-snug group-hover:text-amber transition-colors">
                    La Breva Rooftop
                  </p>
                  <p className="font-body text-[14px] text-parchment/70 leading-snug">
                    Fès &middot; Maroc
                  </p>
                </a>
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
              <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber">Horaires</p>
            </div>
            <div className="space-y-2 mb-8">
              {[
                { days: "Lun — Ven", hours: "8h – 0h" },
                { days: "Samedi", hours: "9h – 1h" },
                { days: "Dimanche", hours: "9h – 23h" },
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
              <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber">Suivez-nous</p>
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

        {/* === Decorative divider (desktop only) === */}
        <motion.div
          variants={fadeUp}
          className="hidden md:flex items-center justify-center gap-4 my-10"
        >
          <span className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-amber/30 to-amber/30" />
          <span className="w-1.5 h-1.5 rotate-45 border border-amber" aria-hidden="true" />
          <span className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent via-amber/30 to-amber/30" />
        </motion.div>

        {/* === Sub-footer (desktop only) === */}
        <motion.div
          variants={fadeUp}
          className="hidden md:flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left"
        >
          <p className="font-mono text-[12px] tracking-[0.3em] uppercase text-parchment/55">
            &copy; 2026 &nbsp;&middot;&nbsp; La Breva
            <span className="hidden md:inline">
              &nbsp;&middot;&nbsp; Tous droits réservés
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono text-[12px] tracking-[0.25em] uppercase text-parchment/55">
            <a href="#" className="hover:text-amber transition-colors">Confidentialité</a>
            <span className="text-amber/50" aria-hidden="true">&diams;</span>
            <a href="#" className="hover:text-amber transition-colors">Mentions Légales</a>
          </div>

          {/* Back to top */}
          <motion.button
            type="button"
            onClick={scrollTop}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            aria-label="Retour en haut"
            className="group inline-flex items-center gap-3 font-mono text-[12px] tracking-[0.3em] uppercase text-amber hover:text-soft-gold transition-colors"
          >
            <span>Haut</span>
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
