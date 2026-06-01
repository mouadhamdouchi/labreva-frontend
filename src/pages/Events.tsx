import { startTransition, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Clock, X, Check } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { imageSrc, imageSrcSet, preloadImages } from "@/lib/images";
import { gridItem, staggerContainer, EASE_OUT_EXPO } from "@/lib/motion";

const categories = ["all", "live-music", "workshops", "dj-nights", "private-events", "special-occasions"];

type EventItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  price: string;
  image: string;
  isFeatured: boolean;
  longDescription?: string;
  gallery?: string[];
  highlights?: string[];
};

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: 1,
    title: "Soirée Jazz : Spécial Saint-Valentin",
    description: "Une soirée intime de jazz live sous les étoiles avec notre menu Saint-Valentin spécialement conçu et un service de champagne.",
    category: "live-music",
    date: "2025-02-14",
    time: "20:00",
    price: "À partir de 400 MAD",
    image: "/picts/events/jazz-night.jpg",
    isFeatured: true,
    longDescription: "Sous les lanternes et le ciel de Fès, le Trio Casablanca interprète des classiques du jazz et des compositions originales pendant que vous savourez un menu de saison en cinq services, conçu pour deux. Une coupe de champagne, une rose, et un mot personnel du chef accompagnent chaque table. Une nuit que l'on n'oublie pas.",
    gallery: ["/picts/rooftop/rooftop.jpg", "/picts/inside/lanterns.jpg", "/picts/menu/chocolate-fondant.jpg", "/picts/rooftop/fes-sunset.jpg"],
    highlights: ["Menu 5 services pour deux", "Coupe de champagne offerte", "Trio Jazz en direct toute la soirée", "Rose & mot du chef à chaque table"],
  },
  {
    id: 2,
    title: "Atelier de Cuisine Marocaine",
    description: "Apprenez les secrets des tajines traditionnels et de la fabrication du pain, suivi d&apos;un déjeuner sur le rooftop.",
    category: "workshops",
    date: "2025-02-21",
    time: "11:00",
    price: "450 MAD",
    image: "/picts/events/cooking-class.jpg",
    isFeatured: false,
    longDescription: "Trois heures aux côtés du Chef Krishna pour démystifier le tajine, le couscous roulé à la main, et le pain marocain au four traditionnel. Chacun repart avec son propre tajine cuisiné, un livret de recettes, et un déjeuner partagé sur la terrasse panoramique.",
    gallery: ["/picts/menu/lamb-tagine.jpg", "/picts/menu/couscous.jpg", "/picts/menu/pastilla.jpg", "/picts/team/chef.jpg"],
    highlights: ["Tajine, couscous & pain en pratique", "Livret de recettes à emporter", "Déjeuner sur le rooftop inclus", "Petits groupes — max 8 personnes"],
  },
  {
    id: 3,
    title: "Sessions du Samedi : DJ Leila",
    description: "La DJ résidente Leila apporte des sonorités deep house et méditerranéennes sur la terrasse tous les samedis soir.",
    category: "dj-nights",
    date: "2025-02-22",
    time: "22:00",
    price: "Entrée libre",
    image: "/picts/rooftop/rooftop.jpg",
    isFeatured: false,
    longDescription: "Chaque samedi, la terrasse se transforme en club à ciel ouvert. Deep house, sonorités orientales et grooves méditerranéens — un set continu de 22h jusqu'à 2h du matin. Mocktails signature, mezze et lanternes allumées.",
    gallery: ["/picts/rooftop/labreva-night.png", "/picts/menu/cocktails.jpg", "/picts/inside/lanterns.jpg", "/picts/rooftop/fes-sunset.jpg"],
    highlights: ["DJ set 22h — 2h du matin", "Mocktails signature & mezze", "Terrasse panoramique éclairée", "Entrée libre — table sur réservation"],
  },
  {
    id: 4,
    title: "Masterclass de Cuisine Privée",
    description: "Rejoignez le Chef Krishna pour une masterclass culinaire exclusive suivie d&apos;un dîner 5 services avec accords de boissons.",
    category: "private-events",
    date: "2025-03-01",
    time: "18:00",
    price: "1 200 MAD",
    image: "/picts/inside/interior.jpg",
    isFeatured: true,
    longDescription: "Une expérience exclusive limitée à dix convives. Le Chef Krishna partage ses techniques signatures, démontre chaque plat, puis vous rejoignez sa table pour un dîner cinq services avec accords de boissons artisanales soigneusement préparés. Tablier, livret de recettes et photo souvenir inclus.",
    gallery: ["/picts/team/chef.jpg", "/picts/menu/sea-bass.jpg", "/picts/menu/chocolate-fondant.jpg", "/picts/inside/interior.jpg"],
    highlights: ["Max 10 convives — intime", "Dîner 5 services avec accords", "Démonstration & dégustation", "Tablier & livret de recettes offerts"],
  },
];

export default function Events() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [rsvpEvent, setRsvpEvent] = useState<number | null>(null);
  const [detailsEvent, setDetailsEvent] = useState<number | null>(null);
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

  useEffect(() => {
    if (detailsEvent === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailsEvent(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [detailsEvent]);

  const activeDetailEvent = useMemo<EventItem | undefined>(
    () => filteredEvents.find((e) => e.id === detailsEvent) as EventItem | undefined,
    [detailsEvent, filteredEvents]
  );

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
          className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/75 via-[#0A0A0A]/55 to-[#0A0A0A]/40"
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
          {/* Dark backdrop pool sitting just behind the title */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[160%] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.25) 60%, transparent 80%)",
              filter: "blur(20px)",
            }}
            aria-hidden="true"
          />
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.25, ease: EASE_OUT_EXPO }}
            className="relative font-display font-medium italic text-[clamp(4rem,11.5vw,9.5rem)] leading-[0.95] tracking-tight"
          >
            <span
              style={{
                color: "#FFFFFF",
                textShadow:
                  "0 2px 8px rgba(0,0,0,0.85), 0 6px 22px rgba(0,0,0,0.6)",
              }}
            >
              À l&apos;
            </span>
            <span
              className="text-gold-shimmer not-italic"
              style={{
                filter:
                  "drop-shadow(0 2px 8px rgba(0,0,0,0.8)) drop-shadow(0 6px 22px rgba(0,0,0,0.55))",
              }}
            >
              Affiche
            </span>
          </motion.h1>

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
            const labels: Record<string, string> = {
              "all": "tous",
              "live-music": "musique live",
              "workshops": "ateliers",
              "dj-nights": "soirées dj",
              "private-events": "événements privés",
              "special-occasions": "occasions spéciales",
            };
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
                <span className="relative">{labels[cat] || cat.replace("-", " ")}</span>
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
                  onClick={() => setDetailsEvent(event.id)}
                  className="rounded-xl p-0 overflow-hidden group border border-amber/20 hover:border-amber/50 shadow-[0_20px_50px_-20px_rgba(14,13,12,0.5)] hover:shadow-[0_30px_70px_-20px_rgba(14,13,12,0.65)] transition-all duration-500 cursor-pointer [content-visibility:auto] [contain-intrinsic-size:420px]"
                  style={{ background: "linear-gradient(180deg, #0E0D0C 0%, #141414 100%)" }}
                >
                  <div className="aspect-video overflow-hidden bg-charcoal/20">
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
                  </div>
                  <div className="p-6">
                    <span className="inline-flex px-3 py-1 bg-amber/15 text-amber text-xs font-semibold rounded-full tracking-wider">
                      {new Date(event.date).toLocaleDateString("fr-FR", { month: "short", day: "numeric" })}
                    </span>
                    <h3 className="font-display italic text-xl text-blush mt-3 mb-2 group-hover:text-amber transition-colors duration-500 leading-tight">
                      {event.title}
                    </h3>
                    <p className="font-body text-sm text-parchment/85 line-clamp-2 mb-3">{event.description}</p>
                    <span className="flex items-center gap-1.5 text-xs text-parchment/70">
                      <Clock size={14} /> {event.time} &middot; {event.price}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setRsvpEvent(event.id); }}
                      className="inline-flex items-center mt-4 font-body text-sm text-blush hover:text-amber transition-colors group/rsvp"
                    >
                      Réserver
                      <span className="ml-2 transition-transform duration-300 group-hover/rsvp:translate-x-1.5">&rarr;</span>
                    </button>
                  </div>
                </motion.div>
              ))}

              {regularEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={gridItem}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  onClick={() => setDetailsEvent(event.id)}
                  className="rounded-xl p-0 overflow-hidden group border border-amber/20 hover:border-amber/50 shadow-[0_20px_50px_-20px_rgba(14,13,12,0.5)] hover:shadow-[0_30px_70px_-20px_rgba(14,13,12,0.65)] transition-all duration-500 cursor-pointer [content-visibility:auto] [contain-intrinsic-size:420px]"
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
                      {new Date(event.date).toLocaleDateString("fr-FR", { month: "short", day: "numeric" })}
                    </span>
                    <h3 className="font-display italic text-xl text-blush mt-3 mb-2 group-hover:text-amber transition-colors duration-500 leading-tight">
                      {event.title}
                    </h3>
                    <p className="font-body text-sm text-parchment/80 line-clamp-2 mb-3">{event.description}</p>
                    <span className="flex items-center gap-1.5 text-xs text-muted-taupe">
                      <Clock size={14} /> {event.time} &middot; {event.price}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setRsvpEvent(event.id); }}
                      className="inline-flex items-center mt-4 font-body text-sm text-blush hover:text-amber transition-colors group/rsvp"
                    >
                      Réserver
                      <span className="ml-2 transition-transform duration-300 group-hover/rsvp:translate-x-1.5">&rarr;</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Details Modal */}
      <AnimatePresence>
        {detailsEvent !== null && activeDetailEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-void/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
            onClick={() => setDetailsEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 14 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl my-8 rounded-xl overflow-hidden border border-amber/30 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)]"
              style={{ background: "linear-gradient(180deg, #0E0D0C 0%, #141414 100%)" }}
            >
              {/* Close */}
              <button
                onClick={() => setDetailsEvent(null)}
                aria-label="Fermer"
                className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-void/70 backdrop-blur-md border border-amber/30 text-blush hover:text-amber hover:border-amber transition-colors"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr]">
                {/* LEFT — hero image + gallery thumbs */}
                <div className="relative bg-charcoal/30">
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
                    <img
                      src={imageSrc(activeDetailEvent.image, 1400)}
                      srcSet={imageSrcSet(activeDetailEvent.image)}
                      alt={activeDetailEvent.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0C]/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0E0D0C]/30" />
                    {/* Date pill on image */}
                    <span className="absolute bottom-4 left-4 inline-flex px-3 py-1.5 bg-amber text-void text-xs font-semibold rounded-full tracking-wider shadow-[0_4px_12px_-4px_rgba(0,0,0,0.5)]">
                      {new Date(activeDetailEvent.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    </span>
                  </div>

                  {/* Gallery strip overlay on the image */}
                  {activeDetailEvent.gallery && activeDetailEvent.gallery.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-[#0E0D0C]/95 via-[#0E0D0C]/70 to-transparent">
                      <div className="grid grid-cols-4 gap-1.5">
                        {activeDetailEvent.gallery.map((src, idx) => (
                          <div
                            key={idx}
                            className="aspect-square overflow-hidden rounded-sm bg-charcoal/40 group/thumb border border-amber/20"
                          >
                            <img
                              src={imageSrc(src, 300)}
                              alt={`${activeDetailEvent.title} ${idx + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT — content panel */}
                <div className="p-6 md:p-8 md:max-h-[80vh] md:overflow-y-auto">
                  {/* Category eyebrow */}
                  <p className="font-mono text-[10px] font-bold tracking-[0.4em] uppercase text-amber mb-3">
                    {activeDetailEvent.category.replace("-", " ")}
                  </p>

                  {/* Title */}
                  <h2 className="font-display italic text-2xl md:text-3xl text-blush leading-tight mb-4">
                    {activeDetailEvent.title}
                  </h2>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-parchment/80 mb-5 pb-5 border-b border-amber/15">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} className="text-amber" /> {activeDetailEvent.time}
                    </span>
                    <span className="text-amber/40">&middot;</span>
                    <span className="font-semibold text-amber">{activeDetailEvent.price}</span>
                  </div>

                  {/* Long description */}
                  <p className="font-body text-sm md:text-[15px] text-parchment/85 leading-relaxed mb-6">
                    {activeDetailEvent.longDescription || activeDetailEvent.description}
                  </p>

                  {/* Highlights */}
                  {activeDetailEvent.highlights && activeDetailEvent.highlights.length > 0 && (
                    <div className="mb-7">
                      <p className="font-mono text-[10px] font-bold tracking-[0.35em] uppercase text-amber mb-3">
                        Au Programme
                      </p>
                      <ul className="flex flex-col gap-2.5">
                        {activeDetailEvent.highlights.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-parchment/85">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" aria-hidden="true" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA row */}
                  <div className="flex items-center gap-4 pt-4 border-t border-amber/15">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      onClick={() => {
                        const id = activeDetailEvent.id;
                        setDetailsEvent(null);
                        setRsvpEvent(id);
                      }}
                      className="inline-flex items-center px-6 py-3 bg-amber text-void text-sm font-semibold rounded-full hover:bg-soft-gold transition-colors"
                    >
                      Réserver Votre Place
                    </motion.button>
                    <button
                      onClick={() => setDetailsEvent(null)}
                      className="inline-flex items-center font-body text-sm text-blush hover:text-amber transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                aria-label="Fermer"
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
                    <h3 className="font-display text-xl text-blush mb-2">Vous êtes sur la liste&nbsp;!</h3>
                    <p className="font-body text-sm text-parchment">Nous vous enverrons les détails par e-mail.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="font-display text-xl text-blush mb-1">Réserver</h3>
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
                        { type: "text", placeholder: "Votre nom", value: rsvpForm.name, key: "name" as const },
                        { type: "email", placeholder: "E-mail", value: rsvpForm.email, key: "email" as const },
                        { type: "tel", placeholder: "Téléphone", value: rsvpForm.phone, key: "phone" as const },
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
                        <span className="font-body text-sm text-parchment">Invités&nbsp;:</span>
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
                        Confirmer la Réservation
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
