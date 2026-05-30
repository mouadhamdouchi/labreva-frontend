import { startTransition, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Clock, Music, Ticket, X, Check } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { imageSrc, imageSrcSet, preloadImages } from "@/lib/images";
import { gridItem, staggerContainer, EASE_OUT_EXPO } from "@/lib/motion";

const categories = ["all", "live-music", "workshops", "dj-nights", "private-events", "special-occasions"];

const DEFAULT_EVENTS = [
  { id: 1, title: "Jazz Night: Valentine Special", description: "An intimate evening of live jazz under the stars with our specially curated Valentine's menu and champagne service.", category: "live-music", date: "2025-02-14", time: "20:00", price: "From 400 MAD", image: "/picts/events/jazz-night.jpg", isFeatured: true },
  { id: 2, title: "Moroccan Cooking Workshop", description: "Learn the secrets of traditional tagines and bread making followed by a rooftop lunch.", category: "workshops", date: "2025-02-21", time: "11:00", price: "450 MAD", image: "/picts/events/cooking-class.jpg", isFeatured: false },
  { id: 3, title: "Saturday Sessions: DJ Leila", description: "Resident DJ Leila brings deep house and Mediterranean vibes to the terrace every Saturday night.", category: "dj-nights", date: "2025-02-22", time: "22:00", price: "Free entry", image: "/picts/rooftop/rooftop.jpg", isFeatured: false },
  { id: 4, title: "Private Dining Masterclass", description: "Join Chef Krishna for an exclusive cooking masterclass followed by a 5-course dinner with wine pairings.", category: "private-events", date: "2025-03-01", time: "18:00", price: "1,200 MAD", image: "/picts/inside/interior.jpg", isFeatured: true },
];

export default function Events() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [rsvpEvent, setRsvpEvent] = useState<number | null>(null);
  const [rsvpForm, setRsvpForm] = useState({ name: "", email: "", phone: "", guests: 1, requests: "" });
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const reduce = useReducedMotion();

  const { data: eventsData } = trpc.public.events.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const filteredEvents = useMemo(() => {
    const source = eventsData && eventsData.length > 0 ? eventsData : DEFAULT_EVENTS;
    if (activeCategory === "all") return source;
    return source.filter(e => e.category === activeCategory);
  }, [eventsData, activeCategory]);

  const { featuredEvents, regularEvents } = useMemo(() => ({
    featuredEvents: filteredEvents.filter((e) => e.isFeatured),
    regularEvents: filteredEvents.filter((e) => !e.isFeatured)
  }), [filteredEvents]);

  useEffect(() => {
    const source = eventsData && eventsData.length > 0 ? eventsData : DEFAULT_EVENTS;
    preloadImages(source.map((event) => event.image), 800);
  }, [eventsData]);

  const closeRsvp = () => {
    setRsvpEvent(null);
    setRsvpSuccess(false);
    setRsvpForm({ name: "", email: "", phone: "", guests: 1, requests: "" });
  };

  useEffect(() => {
    if (rsvpEvent === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRsvp();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [rsvpEvent]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #FAF1E2 0%, #F5E6D3 50%, #EAD7B9 100%)" }}
    >
      {/* Hero — dark marquee dropping into the programme, over the interior shot.
          Extends under the fixed nav so the photo shows behind it. */}
      <section className="relative pt-44 pb-24 md:pt-52 md:pb-32 text-center px-6 overflow-hidden">
        {/* Interior backdrop — dark at the top for legibility, fades to transparent at the bottom */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("/picts/events/event.jpg")` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0E0D0C]/85 via-[#0E0D0C]/35 to-transparent"
          aria-hidden="true"
        />
        {/* Amber spotlight */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(200,149,108,0.22)_0%,transparent_70%)] blur-3xl animate-drift-slow" />
        {/* Engraved corner brackets */}
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute top-10 left-10 w-12 h-12 border-l border-t border-amber/40" />
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute top-10 right-10 w-12 h-12 border-r border-t border-amber/40" />
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute bottom-10 left-10 w-12 h-12 border-l border-b border-amber/40" />
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute bottom-10 right-10 w-12 h-12 border-r border-b border-amber/40" />

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className="h-px w-10 bg-amber/55" />
            <p className="font-mono text-[10px] tracking-[0.45em] uppercase text-amber">
              The Marquee
            </p>
            <span className="h-px w-10 bg-amber/55" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.25, ease: EASE_OUT_EXPO }}
            className="font-display italic text-[clamp(3.5rem,10vw,8rem)] leading-[0.95] text-blush tracking-tight"
          >
            What&apos;s <span className="text-gold-shimmer not-italic">On</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.7, ease: EASE_OUT_EXPO }}
            className="flex items-center justify-center gap-3 mt-6 origin-center"
          >
            <span className="h-px w-16 bg-blush/30" />
            <span className="w-1.5 h-1.5 rotate-45 border border-amber" aria-hidden="true" />
            <span className="h-px w-16 bg-blush/30" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9 }}
            className="font-accent italic text-lg md:text-xl text-parchment/85 mt-8 max-w-xl mx-auto leading-relaxed"
          >
            Live music, wine tastings, and unforgettable nights &mdash; composed for the season.
          </motion.p>
        </div>
      </section>

      {/* Filter — dark band, buttons stay light */}
      <div
        className="sticky top-16 z-30 backdrop-blur-md border-b border-amber/15"
        style={{ background: "rgba(14, 13, 12, 0.88)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => startTransition(() => setActiveCategory(cat))}
                className={`relative px-5 py-2 text-xs font-medium tracking-wider uppercase rounded-full whitespace-nowrap transition-colors duration-300 ${
                  active ? "text-void" : "text-parchment hover:text-blush"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={reduce ? undefined : "events-pill"}
                    className="absolute inset-0 bg-amber rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {!active && (
                  <span className="absolute inset-0 border border-blush/20 rounded-full transition-colors duration-200 hover:border-amber/60" />
                )}
                <span className="relative">{cat.replace("-", " ")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              variants={staggerContainer(0.1)}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {featuredEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  variants={gridItem}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  className="md:col-span-2 rounded-xl p-0 overflow-hidden group transition-all duration-500 shadow-[0_25px_60px_-20px_rgba(14,13,12,0.55)] hover:shadow-[0_35px_80px_-20px_rgba(14,13,12,0.7)] border border-amber/30 hover:border-amber/60 [content-visibility:auto] [contain-intrinsic-size:520px]"
                  style={{ background: "linear-gradient(180deg, #0E0D0C 0%, #141414 100%)" }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="aspect-video md:aspect-auto overflow-hidden bg-charcoal/20 relative">
                      <motion.img
                        src={imageSrc(event.image || "https://images.unsplash.com/photo-1514525253361-bee8a197c0c5?w=1200&q=80", 1200)}
                        srcSet={imageSrcSet(event.image)}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        alt={event.title}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={i === 0 ? "high" : "auto"}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0E0D0C]/70 via-transparent to-transparent" />
                      {/* Featured ribbon — pulses on the poster */}
                      <span className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-amber/95 backdrop-blur-sm rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-void animate-pulse" aria-hidden="true" />
                        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-void font-semibold">Featured</span>
                      </span>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-amber/15 text-amber text-xs font-medium rounded-full">
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <span className="section-label text-xs">{event.category.replace("-", " ").toUpperCase()}</span>
                      </div>
                      <h2 className="font-display italic text-3xl md:text-4xl text-blush mb-3 group-hover:text-amber transition-colors duration-500 leading-tight">
                        {event.title}
                      </h2>
                      <p className="font-body text-parchment/85 mb-4 line-clamp-3">{event.description}</p>
                      <div className="flex items-center gap-6 mb-6 text-muted-taupe">
                        <span className="flex items-center gap-1.5 text-xs"><Clock size={14} /> {event.time}</span>
                        <span className="flex items-center gap-1.5 text-xs"><Music size={14} /> Live Music</span>
                        <span className="flex items-center gap-1.5 text-xs"><Ticket size={14} /> {event.price}</span>
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: "spring", stiffness: 400, damping: 22 }}
                          onClick={() => setRsvpEvent(event.id)}
                          className="magnetic-btn px-6 py-3 bg-amber text-void text-sm font-medium rounded-full hover:bg-soft-gold transition-colors"
                        >
                          Reserve Your Spot
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: "spring", stiffness: 400, damping: 22 }}
                          className="px-6 py-3 border border-amber text-amber text-sm rounded-full hover:bg-amber/10 transition-colors"
                        >
                          Learn More
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {regularEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={gridItem}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  className="rounded-xl p-0 overflow-hidden group border border-amber/20 hover:border-amber/50 shadow-[0_20px_50px_-20px_rgba(14,13,12,0.5)] hover:shadow-[0_30px_70px_-20px_rgba(14,13,12,0.65)] transition-all duration-500 [content-visibility:auto] [contain-intrinsic-size:420px]"
                  style={{ background: "linear-gradient(180deg, #0E0D0C 0%, #141414 100%)" }}
                >
                  <div className="aspect-video overflow-hidden bg-charcoal/20">
                    <motion.img
                      src={imageSrc(event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80", 800)}
                      srcSet={imageSrcSet(event.image)}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      alt={event.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-flex px-3 py-1 bg-amber/15 text-amber text-xs font-medium rounded-full tracking-wider">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <h3 className="font-display italic text-xl text-blush mt-3 mb-2 group-hover:text-amber transition-colors duration-500 leading-tight">
                      {event.title}
                    </h3>
                    <p className="font-body text-sm text-parchment/80 line-clamp-2 mb-3">{event.description}</p>
                    <span className="flex items-center gap-1.5 text-xs text-muted-taupe">
                      <Clock size={14} /> {event.time} &middot; {event.price}
                    </span>
                    <button
                      onClick={() => setRsvpEvent(event.id)}
                      className="inline-flex items-center mt-4 font-body text-sm text-blush hover:text-amber transition-colors group/rsvp"
                    >
                      RSVP
                      <span className="ml-2 transition-transform duration-300 group-hover/rsvp:translate-x-1.5">&rarr;</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* RSVP Modal */}
      <AnimatePresence>
        {rsvpEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-void/85 backdrop-blur-md flex items-center justify-center p-6"
            onClick={closeRsvp}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-md w-full p-8 relative"
            >
              <button
                onClick={closeRsvp}
                className="absolute top-4 right-4 text-parchment hover:text-amber hover:rotate-90 transition-all duration-300"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <AnimatePresence mode="wait">
                {rsvpSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 14 }}
                      className="w-16 h-16 rounded-full border-2 border-success flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="text-success" size={28} />
                    </motion.div>
                    <h3 className="font-display text-xl text-blush mb-2">You&apos;re on the list!</h3>
                    <p className="font-body text-sm text-parchment">We&apos;ll send details to your email.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="font-display text-xl text-blush mb-1">RSVP</h3>
                    <p className="font-body text-sm text-muted-taupe mb-6">
                      {filteredEvents.find((e) => e.id === rsvpEvent)?.title}
                    </p>
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={staggerContainer(0.06, 0.05)}
                      className="space-y-4"
                    >
                      {[
                        { type: "text", placeholder: "Your name", value: rsvpForm.name, key: "name" as const },
                        { type: "email", placeholder: "Email", value: rsvpForm.email, key: "email" as const },
                        { type: "tel", placeholder: "Phone", value: rsvpForm.phone, key: "phone" as const },
                      ].map((field) => (
                        <motion.input
                          key={field.key}
                          variants={gridItem}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={field.value}
                          onChange={(e) => setRsvpForm((p) => ({ ...p, [field.key]: e.target.value }))}
                          className="w-full bg-transparent border-b border-charcoal text-blush py-3 focus:border-amber focus:outline-none placeholder:text-muted-taupe/50 transition-colors"
                        />
                      ))}
                      <motion.div variants={gridItem} className="flex items-center gap-4">
                        <span className="font-body text-sm text-parchment">Guests:</span>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => setRsvpForm((p) => ({ ...p, guests: Math.max(1, p.guests - 1) }))}
                            className="w-8 h-8 rounded-full border border-charcoal text-parchment hover:border-amber transition-colors"
                          >
                            -
                          </motion.button>
                          <motion.span
                            key={rsvpForm.guests}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 18 }}
                            className="font-mono text-blush w-6 text-center"
                          >
                            {rsvpForm.guests}
                          </motion.span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => setRsvpForm((p) => ({ ...p, guests: Math.min(10, p.guests + 1) }))}
                            className="w-8 h-8 rounded-full border border-charcoal text-parchment hover:border-amber transition-colors"
                          >
                            +
                          </motion.button>
                        </div>
                      </motion.div>
                      <motion.button
                        variants={gridItem}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setRsvpSuccess(true)}
                        className="w-full py-3 bg-amber text-void font-medium rounded-full hover:bg-soft-gold transition-colors mt-4"
                      >
                        Confirm RSVP
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
