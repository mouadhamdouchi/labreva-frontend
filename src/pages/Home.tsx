import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Clock, Star, X } from "lucide-react";
import { trpc } from "@/providers/trpc";
import ChapterHeading from "@/components/ChapterHeading";
import Marquee from "@/components/Marquee";
import FloatingReserve from "@/components/FloatingReserve";
import Reveal from "@/components/Reveal";
import { fadeUp, staggerContainer, viewportOnce, EASE_OUT_EXPO } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

type SignatureDish = {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  origin?: string;
  pairing?: string;
  ingredients?: string[];
};

const DEFAULT_SIGNATURES: SignatureDish[] = [
  {
    id: 1,
    name: "Bar Poêlé",
    price: 280,
    image: "/picts/menu/sea-bass.jpg",
    description: "Bar pêché du jour, peau dorée au beurre noisette, sur lit de fenouil confit et émulsion safranée — un plat marin qui marie la Méditerranée et la cuisine de Fès.",
    origin: "Côte Atlantique · Maroc",
    pairing: "Smoothie agrumes & gingembre",
    ingredients: ["Bar entier du jour", "Fenouil confit", "Safran d'Imouzzer", "Beurre noisette", "Citron confit"],
  },
  {
    id: 2,
    name: "Rfissa",
    price: 320,
    image: "/picts/menu/lamb-tagine.jpg",
    description: "Rfissa traditionnelle aux lentilles, fenugrec et poulet beldi mijoté pendant six heures sur msemen déchiré à la main — recette transmise de mère en fille à Fès.",
    origin: "Médina de Fès",
    pairing: "Thé à la menthe fraîche",
    ingredients: ["Poulet beldi fermier", "Lentilles vertes", "Fenugrec", "Msemen feuilleté", "Ras el hanout maison"],
  },
  {
    id: 3,
    name: "Salade de Burrata",
    price: 150,
    image: "/picts/menu/burrata-salad.jpg",
    description: "Burrata crémeuse des Pouilles, tomates anciennes du Moyen Atlas, basilic frais et huile d'olive première pression de Meknès — une ode à la saison.",
    origin: "Italie & Moyen Atlas",
    pairing: "Limonade au romarin",
    ingredients: ["Burrata des Pouilles", "Tomates anciennes", "Basilic du jardin", "Huile d'olive Meknès", "Fleur de sel"],
  },
  {
    id: 4,
    name: "Poulpe Grillé",
    price: 195,
    image: "/picts/menu/grilled-octopus.jpg",
    description: "Poulpe d'Essaouira braisé puis grillé au feu de bois, accompagné de pommes de terre fumées, paprika doux et chimichurri à la coriandre.",
    origin: "Essaouira",
    pairing: "Mocktail concombre & menthe",
    ingredients: ["Poulpe d'Essaouira", "Pommes de terre fumées", "Paprika doux", "Chimichurri coriandre", "Ail confit"],
  },
  {
    id: 5,
    name: "Fondant au Chocolat",
    price: 120,
    image: "/picts/menu/chocolate-fondant.jpg",
    description: "Cœur coulant au chocolat noir 70%, fleur d'oranger et glace à la cardamome maison — un dessert qui ferme le repas comme une caresse.",
    origin: "Pâtisserie de la Maison",
    pairing: "Café arabe à la cardamome",
    ingredients: ["Chocolat noir 70%", "Fleur d'oranger", "Cardamome verte", "Glace maison", "Beurre noisette"],
  },
  {
    id: 6,
    name: "Paella aux Fruits de Mer",
    price: 350,
    image: "/picts/menu/seafood-paella.jpg",
    description: "Riz bomba safrané cuit au feu de bois, gambas, moules de Dakhla, calamars et bar — partage pour deux, à la croûte dorée et au cœur fondant.",
    origin: "Valence revisitée · Maroc",
    pairing: "Jus de grenade frais",
    ingredients: ["Riz bomba", "Gambas sauvages", "Moules de Dakhla", "Calamars", "Safran & paprika fumé"],
  },
];

const DEFAULT_GALLERY = [
  { id: 1, image: "/picts/rooftop/rooftop.jpg", title: "Terrasse de Nuit" },
  { id: 2, image: "/picts/menu/orange-juice.jpg", title: "Jus Artisanaux" },
  { id: 3, image: "/picts/inside/interior.jpg", title: "Salle Intérieure" },
];

type HomeEvent = {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
  time?: string;
  price?: string;
  longDescription?: string;
  gallery?: string[];
  highlights?: string[];
};

const DEFAULT_EVENTS: HomeEvent[] = [
  {
    id: 1,
    title: "Soirée Jazz : Spécial Saint-Valentin",
    description: "Une soirée intime de jazz live sous les étoiles avec notre menu signature spécialement composé pour la Saint-Valentin.",
    category: "live-music",
    date: "2025-02-14",
    image: "/picts/events/jazz-night.jpg",
    time: "20:00",
    price: "À partir de 400 MAD",
    longDescription: "Sous les lanternes et le ciel de Fès, le Trio Casablanca interprète des classiques du jazz et des compositions originales pendant que vous savourez un menu de saison en cinq services, conçu pour deux. Une coupe de champagne, une rose, et un mot personnel du chef accompagnent chaque table. Une nuit que l'on n'oublie pas.",
    gallery: ["/picts/rooftop/rooftop.jpg", "/picts/inside/lanterns.jpg", "/picts/menu/chocolate-fondant.jpg", "/picts/rooftop/fes-sunset.jpg"],
    highlights: ["Menu 5 services pour deux", "Coupe de champagne offerte", "Trio Jazz en direct toute la soirée", "Rose & mot du chef à chaque table"],
  },
  {
    id: 2,
    title: "Cours de Cuisine Marocaine",
    description: "Apprenez les secrets du tagine parfait et de la cuisson traditionnelle du pain avec le Chef Krishna.",
    category: "workshops",
    date: "2025-02-21",
    image: "/picts/events/cooking-class.jpg",
    time: "11:00",
    price: "450 MAD",
    longDescription: "Trois heures aux côtés du Chef Krishna pour démystifier le tajine, le couscous roulé à la main, et le pain marocain au four traditionnel. Chacun repart avec son propre tajine cuisiné, un livret de recettes, et un déjeuner partagé sur la terrasse panoramique.",
    gallery: ["/picts/menu/lamb-tagine.jpg", "/picts/menu/couscous.jpg", "/picts/menu/pastilla.jpg", "/picts/team/chef.jpg"],
    highlights: ["Tajine, couscous & pain en pratique", "Livret de recettes à emporter", "Déjeuner sur le rooftop inclus", "Petits groupes — max 8 personnes"],
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    rating: 5,
    quote: "Une soirée inoubliable. La terrasse au coucher du soleil, la rfissa, la chaleur du personnel — La Breva capture l'âme de Fès comme nulle part ailleurs.",
    authorName: "Sophie Laurent",
    authorLocation: "Paris, France",
  },
  {
    id: 2,
    rating: 5,
    quote: "Le menu dégustation du Chef Krishna était une lettre d'amour à l'Inde. Chaque plat racontait une histoire et les accords étaient impeccables. Cela vaut le voyage en avion.",
    authorName: "Marcus Chen",
    authorLocation: "Singapour",
  },
  {
    id: 3,
    rating: 5,
    quote: "Nous avons célébré notre anniversaire sur le rooftop et l'équipe a rendu ce moment magique — bougies, thé à la menthe, un mot personnel du chef. Pure hospitalité.",
    authorName: "Amal & Hicham El Idrissi",
    authorLocation: "Casablanca, Maroc",
  },
];

type Promise = {
  numeral: string;
  kicker: string;
  title: string;
  quote: string;
  image: string;
};

function PromiseCard({ p, i }: { p: Promise; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Image lifts upward as the card travels through the viewport
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["12%", "-12%"]);
  // Image grows then settles
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [1.08, 1, 1.06]);
  // Roman numeral drifts down slightly and dims at the extremes
  const numeralY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 40]);
  const numeralOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], reduce ? [0.18, 0.18, 0.18, 0.18] : [0, 0.22, 0.22, 0]);
  // Caption text glides upward gently
  const captionY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["20px", "-20px"]);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.4, delay: i * 0.15, ease: EASE_OUT_EXPO }}
      className="relative group/promise"
    >
      {/* Oversize Roman numeral behind — scroll-linked parallax */}
      <motion.span
        style={{ y: numeralY, opacity: numeralOpacity }}
        className="absolute -top-5 -left-2 font-display italic text-[3.75rem] md:text-[5.5rem] leading-[0.85] text-gold-shimmer select-none pointer-events-none z-0 will-change-transform"
        aria-hidden="true"
      >
        {p.numeral}
      </motion.span>

      {/* Image — scroll-linked parallax + scale */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: EASE_OUT_EXPO }}
        className="relative aspect-[4/5] overflow-hidden rounded-sm bg-obsidian z-10 shadow-[0_18px_45px_-15px_rgba(0,0,0,0.65)]"
      >
        <motion.img
          src={p.image}
          alt={p.title}
          loading="lazy"
          decoding="async"
          style={{ y: imageY, scale: imageScale }}
          className="w-full h-[112%] object-cover grayscale-[25%] group-hover/promise:grayscale-0 transition-[filter] duration-700 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent pointer-events-none" />
        <span aria-hidden="true" className="absolute top-3 left-3 w-4 h-4 border-l border-t border-amber/70" />
        <span aria-hidden="true" className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-amber/70" />
      </motion.div>

      {/* Caption — scroll-linked gentle lift */}
      <motion.div style={{ y: captionY }} className="mt-5 relative z-10 will-change-transform">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, delay: 0.7 + i * 0.15, ease: EASE_OUT_EXPO }}
          className="font-mono font-bold text-[13px] md:text-[14px] uppercase text-amber mb-2"
        >
          {p.numeral} · {p.kicker}
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, delay: 0.85 + i * 0.15, ease: EASE_OUT_EXPO }}
          className="font-display font-semibold italic text-2xl md:text-3xl text-blush leading-tight min-h-[2.6em] flex items-start"
        >
          {p.title}
        </motion.h3>
        <Reveal delay={1 + i * 0.15}>
          <p className="font-accent font-semibold italic text-lg md:text-xl text-parchment/90 mt-2.5 leading-relaxed">
            &ldquo;{p.quote}&rdquo;
          </p>
        </Reveal>
      </motion.div>
    </motion.article>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const chapter01Ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [detailsEvent, setDetailsEvent] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeDish, setActiveDish] = useState<number | null>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);

  // Zoom-in effect on Chapter 01 as it scrolls into view
  const { scrollYProgress: ch1Scroll } = useScroll({
    target: chapter01Ref,
    offset: ["start end", "center center"],
  });
  const ch1Opacity = useTransform(ch1Scroll, [0, 0.6, 1], reduce ? [1, 1, 1] : [0.35, 0.85, 1]);

  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      if (parallaxRef.current && heroRef.current) {
        gsap.to(parallaxRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }
    });
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [reduce]);

  const { data: menuData } = trpc.public.menu.useQuery({ category: "all" });
  const { data: eventsData } = trpc.public.events.useQuery({ category: "all" });
  const { data: testimonialsData } = trpc.public.testimonials.useQuery();
  const { data: galleryData } = trpc.public.gallery.useQuery({ category: "all" });

  const signatureDishes = menuData && menuData.length > 0 ? menuData.filter((m) => m.isChefsRec).slice(0, 6) : DEFAULT_SIGNATURES;
  const upcomingEvents: HomeEvent[] = eventsData && eventsData.length > 0 ? (eventsData.slice(0, 2) as HomeEvent[]) : DEFAULT_EVENTS;
  const testimonials = testimonialsData && testimonialsData.length > 0 ? testimonialsData : DEFAULT_TESTIMONIALS;
  const galleryImages = galleryData && galleryData.length > 0 ? galleryData.slice(0, 5) : DEFAULT_GALLERY;

  const activeDetailEvent = useMemo<HomeEvent | undefined>(
    () => upcomingEvents.find((e) => e.id === detailsEvent),
    [detailsEvent, upcomingEvents]
  );

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

  const muralImages = galleryImages.slice(0, 5);

  const activeDishItem = useMemo<SignatureDish | undefined>(
    () => (signatureDishes as SignatureDish[]).find((d) => d.id === activeDish),
    [activeDish, signatureDishes]
  );

  useEffect(() => {
    if (activeDish === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveDish(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeDish]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % muralImages.length));
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + muralImages.length) % muralImages.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxIndex, muralImages.length]);

  return (
    <div className="bg-void relative">
      <FloatingReserve />

      {/* ====== HERO ====== */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen min-h-[100svh] flex items-center overflow-hidden"
      >
        {/* Background */}
        <div ref={parallaxRef} className="absolute inset-0 -top-20 -bottom-20">
          <img
            src="/picts/rooftop/labreva-night.png"
            alt="La Breva de nuit"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover animate-hero-zoom"
          />
          {/* Left-to-right dark veil — keeps text readable on the left, photo glows on the right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/85 via-[#0A0A0A]/45 to-transparent"
          />
        </div>

        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[18%] left-[12%] w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.25)_0%,transparent_70%)] blur-2xl animate-drift-slow" />
          <div className="absolute top-[55%] right-[8%] w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(245,230,211,0.12)_0%,transparent_70%)] blur-3xl animate-drift-slow" style={{ animationDelay: "-6s" }} />
          <div className="absolute bottom-[12%] left-[40%] w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.18)_0%,transparent_70%)] blur-2xl animate-drift-slow" style={{ animationDelay: "-12s" }} />
        </div>

        {/* Content — left-aligned */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-left px-6 md:px-12 lg:px-20 max-w-4xl mr-auto"
        >
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1, 0.5)}
            className="font-display text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.05] text-blush tracking-tight"
          >
            {[
              { word: "Une" },
              { word: "Soirée", italic: true, shimmer: true },
              { word: "Méditerranéenne" },
              { word: "au" },
              { word: "Cœur" },
              { word: "de" },
              { word: "Fès" },
            ].map((item, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 80, rotateX: -25 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    transition: { duration: 1.2, ease: EASE_OUT_EXPO },
                  },
                }}
                className="inline-block mr-[0.22em]"
                style={{ transformOrigin: "50% 100%" }}
              >
                {item.italic ? (
                  <em className={`italic ${item.shimmer ? "text-gold-shimmer" : ""}`}>
                    {item.word}
                  </em>
                ) : (
                  item.word
                )}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2 }}
            className="mt-12 flex items-center justify-start gap-5 flex-wrap"
          >
            <Link
              to="/reservation"
              className="magnetic-btn inline-flex items-center px-8 py-4 bg-amber text-void text-sm font-medium tracking-wide rounded-full hover:bg-soft-gold transition-all duration-300 hover:scale-105 animate-glow-pulse"
            >
              Réserver une Table
            </Link>
            <Link
              to="/menu"
              className="group inline-flex items-center px-8 py-4 border-2 border-white text-white text-sm font-medium tracking-wide rounded-full hover:bg-white/15 hover:tracking-[0.18em] hover:scale-[1.04] hover:shadow-[0_12px_36px_-10px_rgba(255,255,255,0.45)] hover:[text-shadow:0_0_0.4px_currentColor] transition-all duration-500 ease-out will-change-transform"
            >
              Voir la Carte
            </Link>
          </motion.div>
        </motion.div>

        {/* Marquee — sits at the bottom of the hero, on a black band */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.9, ease: EASE_OUT_EXPO }}
          className="absolute bottom-0 left-0 right-0 z-10 bg-[#0A0A0A] py-4 md:py-5 border-t border-amber/15"
        >
          <Marquee
            items={["Méditerranéen", "Marocain", "Mémorable", "Méditerranéen", "Marocain", "Mémorable"]}
            size="sm"
            speed="slow"
          />
        </motion.div>

      </section>

      {/* ====== CHAPTER 01 — THREE PROMISES ====== */}
      <section
        id="chapter-01"
        ref={chapter01Ref}
        className="relative py-14 md:py-20 px-6 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #141414 50%, #0A0A0A 100%)" }}
      >
        {/* Ambient drifting pools */}
        <div className="pointer-events-none absolute top-[8%] -right-32 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.16)_0%,transparent_70%)] blur-3xl animate-drift-slow" />
        <div
          className="pointer-events-none absolute bottom-[12%] -left-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,230,211,0.06)_0%,transparent_70%)] blur-3xl animate-drift-slow"
          style={{ animationDelay: "-8s" }}
        />

        {/* Subtle paper-grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <motion.div style={{ opacity: ch1Opacity }} className="max-w-5xl mx-auto relative">
          {/* Chapter mark */}
          <Reveal>
            <div className="flex items-center gap-3 mb-5 md:mb-7">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
                className="h-px w-20 md:w-32 bg-amber/45 origin-left"
              />
              <p className="font-mono text-[11px] tracking-[0.45em] uppercase text-amber whitespace-nowrap">
                Trois Promesses
              </p>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
                className="h-px flex-1 bg-amber/25 origin-left"
              />
            </div>
          </Reveal>

          {/* Editorial headline — letter-stagger */}
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={staggerContainer(0.05, 0.05)}
            style={{ perspective: "1200px" }}
            className="font-display text-[clamp(1.75rem,4.5vw,3.75rem)] leading-[1.02] tracking-tight text-blush max-w-3xl"
          >
            <motion.span variants={staggerContainer(0.03)} className="inline-block mr-[0.25em]">
              {"Trois".split("").map((ch, i) => (
                <motion.span
                  key={`tp-a-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: 80, rotateX: -90, scale: 0.7 },
                    visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.85, ease: EASE_OUT_EXPO } },
                  }}
                  className="inline-block"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {ch}
                </motion.span>
              ))}
            </motion.span>
            <motion.span variants={staggerContainer(0.03, 0.05)} className="inline-block italic">
              {"promesses,".split("").map((ch, i) => (
                <motion.span
                  key={`tp-b-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: 80, rotateX: -90, scale: 0.7 },
                    visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.85, ease: EASE_OUT_EXPO } },
                  }}
                  className="inline-block"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {ch}
                </motion.span>
              ))}
            </motion.span>
            <br />
            <motion.span variants={staggerContainer(0.03, 0.2)} className="inline-block italic">
              {"tenues chaque soir.".split("").map((ch, i) => (
                <motion.span
                  key={`tp-c-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: 90, rotateX: -100, scale: 0.65 },
                    visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
                  }}
                  className="inline-block text-gold-shimmer"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </motion.span>
          </motion.h2>

          {/* Subtitle */}
          <Reveal delay={0.4}>
            <p className="font-accent font-semibold italic text-lg md:text-xl text-parchment/90 mt-4 max-w-lg leading-relaxed">
              Les choses simples que nous ne brisons jamais — une promesse pour chaque invité qui franchit notre porte.
            </p>
          </Reveal>

          {/* Triptych — three promises, with connector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-10 mt-12 md:mt-14 relative">
            {/* Animated connector line drawn behind the cards (desktop only) */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.8, delay: 0.2, ease: EASE_OUT_EXPO }}
              className="hidden md:block absolute top-[34%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent origin-left pointer-events-none"
              aria-hidden="true"
            />

            {[
              { numeral: "I", kicker: "L'Accueil", title: "Une table est toujours dressée.", quote: "Nous vous accueillons comme un invité de la maison.", image: "/picts/inside/lanterns.jpg" },
              { numeral: "II", kicker: "L'Assiette", title: "De la terre, au feu, à vous.", quote: "Chaque assiette est façonnée à la main, au gré des saisons.", image: "/picts/menu/sea-bass.jpg" },
              { numeral: "III", kicker: "L'Heure", title: "Le temps ralentit au coucher du soleil.", quote: "Fès vit dans chaque saveur que nous servons.", image: "/picts/rooftop/fes-sunset.jpg" },
            ].map((p, i) => (
              <PromiseCard key={p.numeral} p={p} i={i} />
            ))}
          </div>

          {/* Closing line + CTA */}
          <div className="mt-14 md:mt-18 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
              className="flex items-center gap-2.5 mb-4 origin-center"
            >
              <span className="h-px w-10 bg-amber/40" />
              <span className="w-1.5 h-1.5 rotate-45 border border-amber" aria-hidden="true" />
              <span className="h-px w-10 bg-amber/40" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
              className="font-accent italic text-xl md:text-2xl text-blush max-w-lg leading-relaxed"
            >
              Trois promesses. Une soirée sans hâte.
            </motion.p>

            <Reveal delay={0.3}>
              <Link
                to="/about"
                className="group/cta inline-flex items-center gap-2.5 mt-6 font-mono text-[12px] tracking-[0.3em] uppercase text-amber hover:text-soft-gold transition-colors duration-500"
              >
                <span className="h-px w-6 bg-amber transition-all duration-500 group-hover/cta:w-9" />
                Découvrir Notre Histoire
                <span aria-hidden="true" className="transition-transform duration-500 group-hover/cta:translate-x-1.5">
                  &rarr;
                </span>
              </Link>
            </Reveal>
          </div>
        </motion.div>
      </section>

      {/* ====== CHAPTER 02 — SIGNATURE DISHES ====== */}
      <section id="chapter-02" className="pt-16 md:pt-24 pb-0 bg-obsidian px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 -left-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.1)_0%,transparent_70%)] blur-3xl animate-drift-slow" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 md:mb-24">
            <ChapterHeading
              eyebrow="Dans l'Assiette"
              title={
                <>
                  Plats <em className="italic text-gold-shimmer">Signature</em>
                </>
              }
            />
            <Reveal delay={0.2}>
              <Link
                to="/menu"
                className="magnetic-btn inline-flex items-center px-7 py-3 border border-amber text-amber text-sm rounded-full hover:bg-amber/10 transition-colors duration-300 self-start lg:self-auto"
              >
                Voir la Carte Complète &rarr;
              </Link>
            </Reveal>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.08)}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5"
          >
            {signatureDishes.map((dish) => (
              <motion.div
                key={dish.id}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                onClick={() => setActiveDish(dish.id)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4 bg-charcoal/40">
                  <motion.img
                    src={dish.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"}
                    alt={dish.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 1, ease: EASE_OUT_EXPO }}
                  />
                  {/* Price badge — solid amber pill, readable on any background, no filter on the photo */}
                  <span className="absolute top-3 right-3 inline-flex items-baseline gap-1 px-2.5 py-1 rounded-full bg-amber text-void font-mono text-[11px] font-bold tracking-wider shadow-[0_6px_16px_-4px_rgba(0,0,0,0.45)] group-hover:scale-105 transition-transform duration-500">
                    {dish.price}
                    <span className="text-[9px] opacity-75 font-semibold">MAD</span>
                  </span>
                </div>
                <p className="font-display text-base text-blush group-hover:text-amber transition-colors duration-300">
                  {dish.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Reserve · Dine · Linger marquee — part of the Plate section, small footer band */}
        <div className="mt-20 md:mt-24 -mx-6 py-4 border-t border-charcoal/50 overflow-hidden">
          <Marquee
            items={["Réserver", "Savourer", "S'attarder", "Réserver", "Savourer", "S'attarder"]}
            size="sm"
            speed="normal"
            reverse
          />
        </div>
      </section>

      {/* ====== CHAPTER 03 — THE BAR ====== */}
      <section
        id="chapter-03"
        className="py-20 md:py-28 px-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(195deg, #F5E6D3 0%, #EFDEC2 55%, #E2C99E 100%)",
        }}
      >
        <div className="pointer-events-none absolute top-1/4 -left-32 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.5)_0%,transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 -right-32 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.18)_0%,transparent_70%)] blur-3xl animate-drift-slow" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative">
          {/* Image */}
          <Reveal variant="scale" delay={0.2} className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl shadow-elevated max-w-md mx-auto lg:max-w-none">
              <motion.img
                src="/picts/menu/orange-juice.jpg"
                alt="Jus frais"
                loading="lazy"
                decoding="async"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </Reveal>

          {/* Text */}
          <div className="lg:col-span-7">
            <ChapterHeading
              eyebrow="Derrière le Bar"
              theme="light"
              title={
                <>
                  Rafraîchissements <em className="italic text-gold-shimmer">artisanaux</em>
                </>
              }
            />
            <Reveal delay={0.1}>
              <p className="font-body font-medium text-lg md:text-xl text-[#2A2520]/90 leading-relaxed max-w-lg mt-8">
                Jus marocains vibrants, thés traditionnels et cocktails sans alcool artisanaux — chaque
                boisson est une célébration des ingrédients locaux pressés, infusés et préparés à la commande.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 space-y-1">
                {[
                  { name: "Smoothie Avocat & Amande", origin: "Moyen Atlas", price: "65" },
                  { name: "Thé à la Menthe Marocain", origin: "Mélange Traditionnel", price: "45" },
                  { name: "Mojito sans Alcool", origin: "Menthe du Jardin", price: "75" },
                ].map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: EASE_OUT_EXPO }}
                    className="flex items-center justify-between py-4 border-b border-[#2A2520]/20 group hover:border-amber/70 transition-colors duration-500"
                  >
                    <div>
                      <p className="font-display font-semibold text-xl md:text-2xl text-[#2A2520] group-hover:text-amber transition-colors duration-300">
                        {c.name}
                      </p>
                      <p className="font-mono font-bold text-[12px] md:text-[13px] tracking-[0.22em] uppercase text-[#2A2520]/65 mt-1.5">
                        {c.origin}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-base md:text-lg text-amber whitespace-nowrap">{c.price} MAD</span>
                  </motion.div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <Link
                to="/menu"
                className="inline-flex items-center mt-10 font-body font-bold text-base md:text-lg text-[#2A2520] hover:text-amber transition-colors duration-300 group underline-grow"
              >
                Explorer Notre Bar
                <span className="ml-3 group-hover:translate-x-2 transition-transform duration-500">&rarr;</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== CHAPTER 04 — STEP INSIDE ====== */}
      <section
        id="chapter-04"
        className="min-h-[85svh] md:min-h-0 pt-20 md:pt-28 pb-10 md:pb-8 bg-obsidian px-6 relative overflow-hidden"
      >
        <div className="pointer-events-none absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,230,211,0.06)_0%,transparent_70%)] blur-3xl animate-drift-slow" style={{ animationDelay: "-8s" }} />

        <div className="max-w-7xl mx-auto">
          <ChapterHeading
            align="center"
            eyebrow="L'Ambiance"
            title={
              <>
                Entrez <em className="italic text-gold-shimmer">chez nous</em>
              </>
            }
            className="mb-10 md:mb-14"
          />

          {/* Mobile carousel — horizontal auto-scroll, tiles snap left to right (md:hidden) */}
          <div
            className="md:hidden -mx-6 overflow-hidden"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            }}
          >
            <div
              className="flex gap-3 px-6 animate-ticker [@media(hover:hover)]:hover:[animation-play-state:paused]"
              style={{ width: "max-content", animationDuration: "32s" }}
            >
              {[...muralImages, ...muralImages].map((img, i) => (
                <figure
                  key={`m-${img.id}-${i}`}
                  onClick={() => setLightboxIndex(i % muralImages.length)}
                  className="relative w-[72vw] max-w-[320px] aspect-[4/5] overflow-hidden rounded-sm flex-shrink-0 group cursor-pointer"
                >
                  <img
                    src={img.image || "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1000&q=80"}
                    alt={img.title || "Galerie"}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                  <figcaption className="absolute bottom-3 left-3 right-3 flex justify-start pointer-events-none">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-void/85 backdrop-blur-md font-display font-semibold text-sm text-blush leading-tight shadow-[0_6px_18px_-4px_rgba(0,0,0,0.5)]">
                      {img.title}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Desktop mural — every tile snaps to a 12×7 grid filling one solid rectangle (hidden on mobile) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.12, 0.1)}
            className="hidden md:grid grid-cols-12 gap-3 max-w-6xl mx-auto md:grid-rows-[repeat(7,minmax(0,1fr))] md:aspect-[16/10]"
          >
            {muralImages.map((img, i) => {
              // Layout fills 12×7 grid with no empty cells:
              //  1: col 1-7, row 1-5  (large hero)
              //  2: col 8-12, row 1-3 (top right)
              //  3: col 8-12, row 4-5 (mid right)
              //  4: col 1-4,  row 6-7 (bottom left small)
              //  5: col 5-12, row 6-7 (bottom wide)
              const layouts = [
                "col-span-12 aspect-[4/3] md:aspect-auto md:col-start-1 md:row-start-1 md:col-span-7 md:row-span-5",
                "col-span-12 aspect-[4/3] md:aspect-auto md:col-start-8 md:row-start-1 md:col-span-5 md:row-span-3",
                "col-span-12 aspect-[4/3] md:aspect-auto md:col-start-8 md:row-start-4 md:col-span-5 md:row-span-2",
                "col-span-12 aspect-[4/3] md:aspect-auto md:col-start-1 md:row-start-6 md:col-span-4 md:row-span-2",
                "col-span-12 aspect-[4/3] md:aspect-auto md:col-start-5 md:row-start-6 md:col-span-8 md:row-span-2",
              ];
              return (
                <motion.figure
                  key={img.id}
                  variants={fadeUp}
                  transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                  tabIndex={-1}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative overflow-hidden rounded-sm group cursor-pointer select-none outline-none focus:outline-none focus-visible:outline-none border-0 ${layouts[i % layouts.length]}`}
                >
                  <motion.img
                    src={img.image || "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1000&q=80"}
                    alt={img.title || "Galerie"}
                    loading="lazy"
                    decoding="async"
                    initial={{ scale: 1.12 }}
                    whileInView={{ scale: 1 }}
                    viewport={viewportOnce}
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                  {/* Title pill — solid backdrop so the name is readable on any photo (light or dark) */}
                  <figcaption className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 flex justify-start pointer-events-none">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-void/85 backdrop-blur-md font-display font-semibold text-sm md:text-base text-blush leading-tight shadow-[0_6px_18px_-4px_rgba(0,0,0,0.5)] group-hover:bg-amber group-hover:text-void transition-colors duration-500">
                      {img.title}
                    </span>
                  </figcaption>
                </motion.figure>
              );
            })}
          </motion.div>

          <Reveal delay={0.4}>
            <div className="text-center mt-10 md:-mt-32">
              <Link
                to="/gallery"
                className="inline-flex items-center font-body text-sm text-blush hover:text-amber transition-colors duration-300 group underline-grow"
              >
                Parcourir la Galerie Complète
                <span className="ml-3 group-hover:translate-x-2 transition-transform duration-500">&rarr;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====== CHEF PULL-QUOTE ====== */}
      <section
        className="py-32 md:py-48 px-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #F5E6D3 0%, #EAD2B0 50%, #D4A574 100%)",
        }}
      >
        {/* Soft ambient glows that harmonize with the gradient */}
        <div className="pointer-events-none absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.5)_0%,transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.3)_0%,transparent_70%)] blur-3xl animate-drift-slow" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative">
          {/* Chef portrait */}
          <Reveal variant="scale" delay={0.2} className="lg:col-span-5">
            <div className="relative">
              <div className="overflow-hidden rounded-xl shadow-elevated">
                <motion.img
                  src="/picts/team/chef.jpg"
                  alt="Chef Krishna Chaithanya"
                  loading="lazy"
                  decoding="async"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
                  className="w-full aspect-[3/4] object-cover"
                />
              </div>
              {/* Signature card — frosted glass with soft rounded corners */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: 0.6, duration: 0.9, ease: EASE_OUT_EXPO }}
                className="absolute -bottom-6 -right-3 lg:-bottom-8 lg:-right-8 bg-[#2A2520]/55 backdrop-blur-xl rounded-3xl p-5 max-w-[200px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
              >
                <p className="font-mono text-[10px] tracking-[0.2em] text-amber uppercase mb-1">Chef Exécutif</p>
                <p className="font-accent text-2xl text-blush italic leading-tight">Krishna Chaithanya</p>
              </motion.div>
            </div>
          </Reveal>

          {/* Pull quote */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="font-display text-9xl text-[#2A2520]/40 leading-none block mb-4" aria-hidden="true">
                &ldquo;
              </span>
            </Reveal>
            <motion.blockquote
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer(0.04, 0.2)}
              className="font-accent font-semibold text-3xl md:text-5xl lg:text-6xl text-[#2A2520] italic leading-[1.1]"
            >
              {"La cuisine est l'art de transformer la mémoire en saveur.".split(" ").map((w, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
                  }}
                  className="inline-block mr-[0.18em]"
                >
                  {w}
                </motion.span>
              ))}
            </motion.blockquote>
            <Reveal delay={0.4}>
              <div className="mt-10 flex items-center gap-4">
                <div className="h-px w-16 bg-[#2A2520]" />
                <p className="font-mono text-xs tracking-[0.25em] text-[#2A2520]/80 uppercase">
                  Deux Décennies de Maîtrise
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.5}>
              <Link
                to="/about"
                className="inline-flex items-center mt-8 font-body font-semibold text-sm text-[#2A2520] hover:text-amber transition-colors duration-300 group underline-grow"
              >
                Rencontrer le Chef
                <span className="ml-3 group-hover:translate-x-2 transition-transform duration-500">&rarr;</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== CHAPTER 05 — TESTIMONIALS ====== */}
      <section id="chapter-05" className="py-32 md:py-48 bg-obsidian px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <ChapterHeading
            align="center"
            eyebrow="Témoignages"
            title={
              <>
                Ce que nos invités <em className="italic text-gold-shimmer">disent</em>
              </>
            }
            className="mb-16 md:mb-20"
          />

          <div className="relative overflow-hidden">
            {/* Edge gradients for the ticker */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-obsidian to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-obsidian to-transparent z-10" />

            <div className="flex gap-6 animate-ticker hover:[animation-play-state:paused]" style={{ width: "max-content" }}>
              {[...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={`${t.id}-${i}`}
                  className="glass-card p-6 md:p-8 w-[80vw] sm:w-[360px] md:w-[400px] max-w-[420px] flex-shrink-0 hover-lift group"
                >
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="text-amber fill-amber" />
                    ))}
                  </div>
                  <p className="font-accent font-semibold text-2xl md:text-[1.6rem] text-blush italic leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-charcoal">
                    <div className="w-11 h-11 rounded-full bg-amber/20 flex items-center justify-center">
                      <span className="font-display font-semibold text-base text-amber">{t.authorName[0]}</span>
                    </div>
                    <div>
                      <p className="font-body font-semibold text-base md:text-lg text-blush">{t.authorName}</p>
                      <p className="font-mono font-bold text-[12px] md:text-[13px] tracking-[0.18em] uppercase text-muted-taupe mt-1">
                        {t.authorLocation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== CHAPTER 06 — EVENTS ====== */}
      <section
        id="chapter-06"
        className="py-32 md:py-48 px-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #EAD7B9 0%, #F5E6D3 50%, #FAF1E2 100%)",
        }}
      >
        <div className="pointer-events-none absolute top-1/3 -right-32 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.18)_0%,transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 -left-32 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55)_0%,transparent_70%)] blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 md:mb-24">
            <ChapterHeading
              eyebrow="À l'Affiche"
              theme="light"
              title={
                <>
                  Événements <em className="italic text-gold-shimmer">à venir</em>
                </>
              }
            />
            <Reveal delay={0.2}>
              <Link
                to="/events"
                className="magnetic-btn inline-flex items-center px-7 py-3 border border-amber text-amber text-sm rounded-full hover:bg-amber/10 transition-colors duration-300 self-start lg:self-auto"
              >
                Voir Tous les Événements &rarr;
              </Link>
            </Reveal>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.15)}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                onClick={() => setDetailsEvent(event.id)}
                className="group cursor-pointer relative overflow-hidden rounded-xl bg-[#FFF8EE] border border-[#2A2520]/15 hover:border-amber/60 shadow-[0_15px_50px_-15px_rgba(42,37,32,0.4)] hover:shadow-[0_25px_70px_-15px_rgba(42,37,32,0.5)] transition-all duration-500"
              >
                <div className="aspect-video overflow-hidden">
                  <motion.img
                    src={event.image || "https://images.unsplash.com/photo-1514525253361-bee8a197c0c5?w=800&q=80"}
                    alt={event.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono font-bold text-sm md:text-[15px] text-amber tracking-[0.18em]">
                      {new Date(event.date).toLocaleDateString("fr-FR", { month: "short", day: "numeric" }).toUpperCase()}
                    </span>
                    <span className="h-px w-8 bg-amber/40" />
                    <span className="font-mono font-bold text-[12px] md:text-[13px] tracking-[0.22em] uppercase text-[#2A2520]/70">
                      {event.category.replace("-", " ")}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-2xl md:text-3xl text-[#2A2520] group-hover:text-amber transition-colors duration-500 mb-3 leading-tight">
                    {event.title}
                  </h3>
                  <p className="font-body font-medium text-base md:text-lg text-[#2A2520]/85 line-clamp-2 mb-6 leading-relaxed">
                    {event.description}
                  </p>
                  <Link
                    to="/reservation"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center font-body font-bold text-base md:text-lg text-[#2A2520] hover:text-amber transition-colors group/link"
                  >
                    Réserver Votre Place
                    <span className="ml-2 group-hover/link:translate-x-2 transition-transform duration-500">&rarr;</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== CINEMATIC RESERVATION CTA ====== */}
      <section
        id="chapter-reserve"
        className="relative min-h-[55vh] flex items-center justify-center overflow-hidden bg-fixed bg-cover bg-center px-6 py-14 md:py-16"
        style={{ backgroundImage: `url("/picts/rooftop/rooftop.jpg")` }}
      >
        {/* Subtle darkening over the fixed image */}
        <div className="absolute inset-0 bg-void/40" />

        {/* Light parchment card — scrolls over the fixed image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
          className="relative z-10 max-w-3xl w-full mx-auto bg-blush border border-amber/30 shadow-elevated rounded-sm px-8 py-10 md:px-14 md:py-12 text-center"
        >
          {/* Decorative corner ticks */}
          <span className="absolute top-3 left-3 w-5 h-5 border-l border-t border-amber/60" aria-hidden="true" />
          <span className="absolute top-3 right-3 w-5 h-5 border-r border-t border-amber/60" aria-hidden="true" />
          <span className="absolute bottom-3 left-3 w-5 h-5 border-l border-b border-amber/60" aria-hidden="true" />
          <span className="absolute bottom-3 right-3 w-5 h-5 border-r border-b border-amber/60" aria-hidden="true" />

          <Reveal>
            <p className="font-mono font-bold text-[13px] md:text-[15px] tracking-[0.4em] uppercase text-amber mb-6">REJOIGNEZ-NOUS</p>
          </Reveal>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.1, 0.1)}
            className="font-display font-semibold text-5xl md:text-7xl lg:text-8xl text-[#2A2520] leading-[1.05] tracking-tight"
          >
            {[{ w: "Réservez" }, { w: "votre", italic: true }, { w: "table" }].map((item, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 50, rotateX: -20 },
                  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 1.2, ease: EASE_OUT_EXPO } },
                }}
                className="inline-block mr-[0.22em]"
                style={{ transformOrigin: "50% 100%" }}
              >
                {item.italic ? <em className="italic text-amber">{item.w}</em> : item.w}
              </motion.span>
            ))}
          </motion.h2>
          <Reveal delay={0.5}>
            <p className="font-body font-semibold text-lg md:text-xl text-[#2A2520] mt-8 max-w-lg mx-auto leading-relaxed">
              Que ce soit pour un dîner intime à deux ou une célébration entre amis, nous serions ravis de vous accueillir.
            </p>
          </Reveal>
          <Reveal delay={0.7}>
            <Link
              to="/reservation"
              className="magnetic-btn inline-flex items-center mt-10 px-10 py-5 bg-[#2A2520] text-blush text-base md:text-lg font-bold tracking-[0.18em] uppercase rounded-full hover:bg-void transition-all duration-300 hover:scale-105"
            >
              Réserver Maintenant
            </Link>
          </Reveal>

          {/* Quick contact */}
          <Reveal delay={0.9}>
            <div className="mt-12 flex items-center justify-center gap-6 flex-wrap">
              <a href="tel:+212535123456" className="font-mono font-bold text-base md:text-lg tracking-[0.2em] text-[#2A2520] hover:text-amber transition-colors">
                +212 535 123 456
              </a>
            </div>
          </Reveal>
        </motion.div>
      </section>

      {/* ====== GALLERY LIGHTBOX ====== */}
      <AnimatePresence>
        {lightboxIndex !== null && muralImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-void/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.12, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-void/70 backdrop-blur-md border border-amber/30 flex items-center justify-center text-parchment hover:text-amber z-10"
              aria-label="Fermer"
            >
              <X size={20} />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + muralImages.length) % muralImages.length));
              }}
              className="absolute left-4 md:left-8 w-10 h-10 rounded-full bg-void/70 backdrop-blur-md border border-amber/30 flex items-center justify-center text-parchment hover:text-amber z-10"
              aria-label="Précédent"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % muralImages.length));
              }}
              className="absolute right-4 md:right-8 w-10 h-10 rounded-full bg-void/70 backdrop-blur-md border border-amber/30 flex items-center justify-center text-parchment hover:text-amber z-10"
              aria-label="Suivant"
            >
              <ChevronRight size={20} />
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                src={muralImages[lightboxIndex].image}
                alt={muralImages[lightboxIndex].title || ""}
                decoding="async"
                className="max-w-[90vw] max-h-[80vh] object-contain rounded shadow-elevated"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            <motion.div
              key={`info-${lightboxIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 inset-x-0 mx-auto w-fit text-center px-7 py-4 bg-black/65 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)]"
            >
              <p className="font-mono font-semibold text-sm md:text-base text-parchment mb-2 tracking-[0.2em]">
                {lightboxIndex + 1} / {muralImages.length}
              </p>
              <p className="font-display italic font-semibold text-2xl md:text-3xl text-blush">
                {muralImages[lightboxIndex].title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== DISH DETAILS MODAL ====== */}
      <AnimatePresence>
        {activeDish !== null && activeDishItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-void/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
            onClick={() => setActiveDish(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 14 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl my-8 rounded-xl overflow-hidden border border-amber/30 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)]"
              style={{ background: "linear-gradient(180deg, #0E0D0C 0%, #141414 100%)" }}
            >
              <button
                onClick={() => setActiveDish(null)}
                aria-label="Fermer"
                className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-void/70 backdrop-blur-md border border-amber/30 text-blush hover:text-amber hover:border-amber transition-colors"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-[5fr_6fr]">
                {/* LEFT — hero image */}
                <div className="relative bg-charcoal/30">
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
                    <img
                      src={activeDishItem.image}
                      alt={activeDishItem.name}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0C]/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0E0D0C]/30" />
                    {/* Price pill */}
                    <span className="absolute bottom-4 left-4 inline-flex items-baseline gap-1 px-3.5 py-1.5 bg-amber text-void font-mono text-sm font-bold tracking-wider rounded-full shadow-[0_4px_12px_-4px_rgba(0,0,0,0.5)]">
                      {activeDishItem.price}
                      <span className="text-[10px] opacity-80 font-semibold">MAD</span>
                    </span>
                  </div>
                </div>

                {/* RIGHT — content */}
                <div className="p-6 md:p-8 md:max-h-[80vh] md:overflow-y-auto">
                  {activeDishItem.origin && (
                    <p className="font-mono text-[10px] font-bold tracking-[0.4em] uppercase text-amber mb-3">
                      {activeDishItem.origin}
                    </p>
                  )}

                  <h2 className="font-display italic font-semibold text-3xl md:text-4xl text-blush leading-tight mb-5">
                    {activeDishItem.name}
                  </h2>

                  {activeDishItem.description && (
                    <p className="font-body text-base md:text-[17px] text-parchment/85 leading-relaxed mb-6 pb-6 border-b border-amber/15">
                      {activeDishItem.description}
                    </p>
                  )}

                  {activeDishItem.ingredients && activeDishItem.ingredients.length > 0 && (
                    <div className="mb-6">
                      <p className="font-mono text-[10px] font-bold tracking-[0.35em] uppercase text-amber mb-3">
                        Au cœur de l&apos;assiette
                      </p>
                      <ul className="flex flex-col gap-2">
                        {activeDishItem.ingredients.map((ing, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-parchment/85">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" aria-hidden="true" />
                            <span>{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeDishItem.pairing && (
                    <div className="mb-7 px-4 py-3 rounded-md bg-amber/8 border border-amber/20">
                      <p className="font-mono text-[10px] font-bold tracking-[0.35em] uppercase text-amber mb-1">
                        Suggestion d&apos;accord
                      </p>
                      <p className="font-accent font-semibold italic text-xl md:text-2xl text-blush leading-snug">
                        {activeDishItem.pairing}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-4 border-t border-amber/15">
                    <Link
                      to="/menu"
                      onClick={() => setActiveDish(null)}
                      className="inline-flex items-center px-6 py-3 bg-amber text-void text-sm font-semibold rounded-full hover:bg-soft-gold transition-colors"
                    >
                      Voir la Carte
                    </Link>
                    <button
                      onClick={() => setActiveDish(null)}
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

      {/* ====== EVENT DETAILS MODAL ====== */}
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
                      src={activeDetailEvent.image}
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
                              src={src}
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
                  {(activeDetailEvent.time || activeDetailEvent.price) && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-parchment/80 mb-5 pb-5 border-b border-amber/15">
                      {activeDetailEvent.time && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={14} className="text-amber" /> {activeDetailEvent.time}
                        </span>
                      )}
                      {activeDetailEvent.time && activeDetailEvent.price && (
                        <span className="text-amber/40">&middot;</span>
                      )}
                      {activeDetailEvent.price && (
                        <span className="font-semibold text-amber">{activeDetailEvent.price}</span>
                      )}
                    </div>
                  )}

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
                    <Link
                      to="/reservation"
                      onClick={() => setDetailsEvent(null)}
                      className="inline-flex items-center px-6 py-3 bg-amber text-void text-sm font-semibold rounded-full hover:bg-soft-gold transition-colors"
                    >
                      Réserver Votre Place
                    </Link>
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
    </div>
  );
}
