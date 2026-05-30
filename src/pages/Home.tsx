import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Star } from "lucide-react";
import { trpc } from "@/providers/trpc";
import CountUp from "@/components/CountUp";
import ChapterHeading from "@/components/ChapterHeading";
import Marquee from "@/components/Marquee";
import ScrollProgressRail from "@/components/ScrollProgressRail";
import FloatingReserve from "@/components/FloatingReserve";
import Reveal from "@/components/Reveal";
import { fadeUp, staggerContainer, viewportOnce, EASE_OUT_EXPO } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  { id: "hero", label: "Welcome" },
  { id: "chapter-01", label: "01 / Experience" },
  { id: "chapter-02", label: "02 / Plate" },
  { id: "chapter-03", label: "03 / Bar" },
  { id: "chapter-04", label: "04 / Inside" },
  { id: "chapter-05", label: "05 / Voices" },
  { id: "chapter-06", label: "06 / Events" },
  { id: "chapter-reserve", label: "Reserve" },
];

const DEFAULT_SIGNATURES = [
  { id: 1, name: "Pan-Seared Sea Bass", price: 280, image: "/picts/menu/sea-bass.jpg" },
  { id: 2, name: "Rfissa", price: 320, image: "/picts/menu/lamb-tagine.jpg" },
  { id: 3, name: "Burrata Salad", price: 150, image: "/picts/menu/burrata-salad.jpg" },
  { id: 4, name: "Grilled Octopus", price: 195, image: "/picts/menu/grilled-octopus.jpg" },
  { id: 5, name: "Chocolate Fondant", price: 120, image: "/picts/menu/chocolate-fondant.jpg" },
  { id: 6, name: "Seafood Paella", price: 350, image: "/picts/menu/seafood-paella.jpg" },
];

const DEFAULT_GALLERY = [
  { id: 1, image: "/picts/rooftop/rooftop.jpg", title: "Terrace at Night" },
  { id: 2, image: "/picts/menu/orange-juice.jpg", title: "Crafted Juices" },
  { id: 3, image: "/picts/inside/interior.jpg", title: "Interior Dining" },
];

const DEFAULT_EVENTS = [
  { id: 1, title: "Jazz Night: Valentine Special", description: "An intimate evening of live jazz under the stars with our specially curated Valentine's signature menu.", category: "live-music", date: "2025-02-14", image: "/picts/events/jazz-night.jpg" },
  { id: 2, title: "Moroccan Cooking Class", description: "Learn the secrets of the perfect tagine and traditional bread baking with Chef Krishna.", category: "workshops", date: "2025-02-21", image: "/picts/events/cooking-class.jpg" },
];

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    rating: 5,
    quote: "An unforgettable evening. The terrace at sunset, the rfissa, the warmth of the staff — La Breva captures the soul of Fes like nowhere else.",
    authorName: "Sophie Laurent",
    authorLocation: "Paris, France",
  },
  {
    id: 2,
    rating: 5,
    quote: "Chef Krishna's tasting menu was a love letter to India. Every course told a story and the pairings were impeccable. Worth flying for.",
    authorName: "Marcus Chen",
    authorLocation: "Singapore",
  },
  {
    id: 3,
    rating: 5,
    quote: "We celebrated our anniversary on the rooftop and the team made it magical — candles, mint tea, a personal note from the chef. Pure hospitality.",
    authorName: "Amal & Hicham El Idrissi",
    authorLocation: "Casablanca, Morocco",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const chapter01Ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

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
  const ch1Scale = useTransform(ch1Scroll, [0, 1], reduce ? [1, 1] : [0.82, 1]);
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
  const upcomingEvents = eventsData && eventsData.length > 0 ? eventsData.slice(0, 2) : DEFAULT_EVENTS;
  const testimonials = testimonialsData && testimonialsData.length > 0 ? testimonialsData : DEFAULT_TESTIMONIALS;
  const galleryImages = galleryData && galleryData.length > 0 ? galleryData.slice(0, 5) : DEFAULT_GALLERY;

  return (
    <div className="bg-void relative">
      <ScrollProgressRail chapters={CHAPTERS} />
      <FloatingReserve />

      {/* ====== HERO ====== */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div ref={parallaxRef} className="absolute inset-0 -top-20 -bottom-20">
          <img
            src="/picts/rooftop/rooftop.jpg"
            alt="La Breva terrace"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover animate-hero-zoom"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-b from-[#0E0D0C]/85 via-[#0E0D0C]/35 to-transparent"
          />
        </div>

        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[18%] left-[12%] w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.25)_0%,transparent_70%)] blur-2xl animate-drift-slow" />
          <div className="absolute top-[55%] right-[8%] w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(245,230,211,0.12)_0%,transparent_70%)] blur-3xl animate-drift-slow" style={{ animationDelay: "-6s" }} />
          <div className="absolute bottom-[12%] left-[40%] w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.18)_0%,transparent_70%)] blur-2xl animate-drift-slow" style={{ animationDelay: "-12s" }} />
        </div>

        {/* Vertical accent left */}
        <div className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col items-center gap-4 pointer-events-none">
          <div className="h-24 w-px bg-blush/30" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-blush/60 text-vertical">
            EST · MMXII · FES
          </span>
          <div className="h-24 w-px bg-blush/30" />
        </div>

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, y: 20, letterSpacing: "0.05em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.18em" }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT_EXPO }}
            className="section-label mb-6"
          >
            WELCOME TO LA BREVA
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1, 0.5)}
            className="font-display text-[clamp(3rem,9vw,8rem)] leading-[1.02] text-blush tracking-tight"
          >
            {[
              { word: "A" },
              { word: "Mediterranean" },
              { word: "Evening", italic: true, shimmer: true },
              { word: "in" },
              { word: "the" },
              { word: "Heart" },
              { word: "of" },
              { word: "Fes" },
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

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.6 }}
            className="font-body text-base md:text-lg text-parchment/85 mt-8 max-w-xl mx-auto leading-relaxed"
          >
            Where golden sunsets, artisan flavors, and Moroccan hospitality converge into a single, unrepeatable evening.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2 }}
            className="mt-12 flex items-center justify-center gap-5 flex-wrap"
          >
            <Link
              to="/reservation"
              className="magnetic-btn inline-flex items-center px-8 py-4 bg-amber text-void text-sm font-medium tracking-wide rounded-full hover:bg-soft-gold transition-all duration-300 hover:scale-105 animate-glow-pulse"
            >
              Reserve a Table
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center px-8 py-4 border border-blush/30 text-blush text-sm font-medium tracking-wide rounded-full hover:border-amber hover:text-amber transition-all duration-300 underline-grow"
            >
              View the Menu
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-parchment/70 uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 text-parchment animate-bounce-slow" />
        </motion.div>

        {/* Vertical accent right */}
        <div className="absolute right-6 lg:right-10 bottom-10 z-10 hidden md:block pointer-events-none">
          <span className="font-mono text-[10px] tracking-[0.3em] text-blush/50 text-vertical">
            FES &middot; MOROCCO &middot; 34&deg;N
          </span>
        </div>
      </section>

      {/* ====== MARQUEE ====== */}
      <section className="py-10 md:py-14 bg-warm-stone border-y border-charcoal/60 overflow-hidden">
        <Marquee
          items={["Mediterranean", "Moroccan", "Memorable", "Mediterranean", "Moroccan", "Memorable"]}
          size="lg"
          speed="slow"
        />
      </section>

      {/* ====== CHAPTER 01 — THE EXPERIENCE ====== */}
      <section
        id="chapter-01"
        ref={chapter01Ref}
        className="py-32 md:py-48 px-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FAF1E2 0%, #F5E6D3 60%, #EAD7B9 100%)",
        }}
      >
        <div className="pointer-events-none absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.22)_0%,transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 -left-32 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55)_0%,transparent_70%)] blur-3xl" />

        <motion.div
          style={{ scale: ch1Scale, opacity: ch1Opacity }}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center origin-center will-change-transform">
          {/* Text column */}
          <div className="lg:col-span-6 lg:order-1">
            <ChapterHeading
              number="01"
              eyebrow="The Experience"
              theme="light"
              title={
                <>
                  More than a meal.<br />
                  <em className="italic text-gold-shimmer">A memory.</em>
                </>
              }
            />
            <Reveal delay={0.1}>
              <p className="font-body text-base md:text-lg text-[#2A2520]/85 leading-relaxed max-w-lg mt-8">
                La Breva is where the warm Mediterranean breeze meets the ancient soul of Fes. Our menu
                celebrates the finest local ingredients — fresh seafood from the Atlantic, fragrant
                spices from the medina, and seasonal produce from the Middle Atlas.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-body text-base text-[#2A2520]/70 leading-relaxed max-w-lg mt-5">
                Every dish tells a story of tradition reimagined through a modern lens — every evening,
                a new chapter.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <Link
                to="/about"
                className="inline-flex items-center mt-10 font-body text-sm font-semibold text-[#2A2520] hover:text-amber transition-colors duration-300 group underline-grow"
              >
                Discover Our Story
                <span className="ml-3 group-hover:translate-x-2 transition-transform duration-500">&rarr;</span>
              </Link>
            </Reveal>
          </div>

          {/* Image column */}
          <div className="lg:col-span-6 lg:order-2 relative">
            <Reveal variant="scale" delay={0.2}>
              <div className="overflow-hidden rounded-xl shadow-elevated">
                <motion.img
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1000&q=80"
                  alt="Cocktail preparation"
                  loading="lazy"
                  decoding="async"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
                  className="w-full"
                />
              </div>
            </Reveal>
            <Reveal variant="scale" delay={0.4}>
              <div className="absolute -bottom-10 -left-6 w-[55%] overflow-hidden rounded-xl shadow-elevated border-4 border-blush hidden lg:block">
                <motion.img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                  alt="Table setting"
                  loading="lazy"
                  decoding="async"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
                  className="w-full"
                />
              </div>
            </Reveal>
            {/* Floating year badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={viewportOnce}
              transition={{ delay: 0.5, duration: 0.9, ease: EASE_OUT_EXPO }}
              className="absolute -top-6 -right-3 lg:-top-10 lg:-right-10 w-32 h-32 rounded-full border border-amber/40 bg-void/80 backdrop-blur-md flex flex-col items-center justify-center text-center hidden lg:flex"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-amber/70">EST.</span>
              <span className="font-display text-3xl text-amber leading-none mt-1">2012</span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-amber/70 mt-1">FES</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats band */}
        <div className="max-w-7xl mx-auto mt-32 md:mt-40 pt-16 border-t border-[#2A2520]/15">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.15)}
            className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center"
          >
            {[
              { value: 12, suffix: "+", label: "Years of Excellence" },
              { value: 3, suffix: "", label: "Master Chefs" },
              { value: 50, suffix: "k+", label: "Guests Served" },
              { value: 4.9, suffix: "", label: "Average Rating", decimal: true },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <p className="font-display text-5xl md:text-6xl text-amber leading-none">
                  <CountUp
                    to={stat.value}
                    suffix={stat.suffix}
                    format={stat.decimal ? (v) => v.toFixed(1) : undefined}
                  />
                </p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: EASE_OUT_EXPO }}
                  className="w-8 h-px bg-amber/50 mx-auto mt-4 origin-center"
                />
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#2A2520]/70 mt-3">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== CHAPTER 02 — SIGNATURE DISHES ====== */}
      <section id="chapter-02" className="py-32 md:py-48 bg-obsidian px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 -left-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.1)_0%,transparent_70%)] blur-3xl animate-drift-slow" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 md:mb-24">
            <ChapterHeading
              number="02"
              eyebrow="On The Plate"
              title={
                <>
                  Signature <em className="italic text-gold-shimmer">Dishes</em>
                </>
              }
            />
            <Reveal delay={0.2}>
              <Link
                to="/menu"
                className="magnetic-btn inline-flex items-center px-7 py-3 border border-amber text-amber text-sm rounded-full hover:bg-amber/10 transition-colors duration-300 self-start lg:self-auto"
              >
                View Full Menu &rarr;
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
                  {/* Bottom gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  {/* Price chip slides up on hover */}
                  <div className="absolute bottom-0 inset-x-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="font-mono text-xs text-amber">{dish.price} MAD</span>
                  </div>
                </div>
                <p className="font-display text-base text-blush group-hover:text-amber transition-colors duration-300">
                  {dish.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== MARQUEE 2 ====== */}
      <section className="py-8 md:py-12 bg-void border-y border-charcoal/40 overflow-hidden">
        <Marquee
          items={["Reserve", "Dine", "Linger", "Reserve", "Dine", "Linger"]}
          size="md"
          speed="normal"
          reverse
        />
      </section>

      {/* ====== CHAPTER 03 — THE BAR ====== */}
      <section
        id="chapter-03"
        className="py-32 md:py-48 px-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(195deg, #F5E6D3 0%, #EFDEC2 55%, #E2C99E 100%)",
        }}
      >
        <div className="pointer-events-none absolute top-1/4 -left-32 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.5)_0%,transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 -right-32 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.18)_0%,transparent_70%)] blur-3xl animate-drift-slow" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative">
          {/* Image */}
          <Reveal variant="scale" delay={0.2} className="lg:col-span-6">
            <div className="overflow-hidden rounded-xl shadow-elevated">
              <motion.img
                src="/picts/menu/orange-juice.jpg"
                alt="Fresh juices"
                loading="lazy"
                decoding="async"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </Reveal>

          {/* Text */}
          <div className="lg:col-span-6">
            <ChapterHeading
              number="03"
              eyebrow="Behind The Bar"
              theme="light"
              title={
                <>
                  Artisan <em className="italic text-gold-shimmer">refreshments</em>
                </>
              }
            />
            <Reveal delay={0.1}>
              <p className="font-body text-base md:text-lg text-[#2A2520]/85 leading-relaxed max-w-lg mt-8">
                Vibrant Moroccan juices, traditional teas, and crafted virgin cocktails — each drink a
                celebration of local ingredients squeezed, brewed, and muddled to order.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 space-y-1">
                {[
                  { name: "Avocado & Almond Shake", origin: "Middle Atlas", price: "65" },
                  { name: "Moroccan Mint Tea", origin: "Traditional Blend", price: "45" },
                  { name: "Virgin Mojito", origin: "Garden Mint", price: "75" },
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
                      <p className="font-display text-lg text-[#2A2520] group-hover:text-amber transition-colors duration-300">
                        {c.name}
                      </p>
                      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#2A2520]/55 mt-1">
                        {c.origin}
                      </p>
                    </div>
                    <span className="font-mono text-sm text-amber whitespace-nowrap">{c.price} MAD</span>
                  </motion.div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <Link
                to="/menu"
                className="inline-flex items-center mt-10 font-body text-sm font-semibold text-[#2A2520] hover:text-amber transition-colors duration-300 group underline-grow"
              >
                Explore Our Bar
                <span className="ml-3 group-hover:translate-x-2 transition-transform duration-500">&rarr;</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== CHAPTER 04 — STEP INSIDE ====== */}
      <section id="chapter-04" className="py-32 md:py-48 bg-obsidian px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,230,211,0.06)_0%,transparent_70%)] blur-3xl animate-drift-slow" style={{ animationDelay: "-8s" }} />

        <div className="max-w-7xl mx-auto">
          <ChapterHeading
            align="center"
            number="04"
            eyebrow="The Atmosphere"
            title={
              <>
                Step <em className="italic text-gold-shimmer">Inside</em>
              </>
            }
            className="mb-16 md:mb-24"
          />

          {/* Mural composition — every tile snaps to a 12×7 grid filling one solid rectangle */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.12, 0.1)}
            className="grid grid-cols-12 gap-2 md:gap-3 max-w-6xl mx-auto md:grid-rows-[repeat(7,minmax(0,1fr))] md:aspect-[16/10]"
          >
            {galleryImages.slice(0, 5).map((img, i) => {
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
              const indexLabel = String(i + 1).padStart(2, "0");
              return (
                <motion.figure
                  key={img.id}
                  variants={fadeUp}
                  transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                  tabIndex={-1}
                  className={`relative overflow-hidden rounded-sm group cursor-pointer select-none outline-none focus:outline-none focus-visible:outline-none border-0 ${layouts[i % layouts.length]}`}
                >
                  <motion.img
                    src={img.image || "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1000&q=80"}
                    alt={img.title || "Gallery"}
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
                  {/* Permanent index marker */}
                  <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.3em] text-blush/85 px-2 py-1 rounded-sm bg-void/40 backdrop-blur-sm transition-colors duration-500 group-hover:bg-amber group-hover:text-void">
                    {indexLabel}
                  </span>
                  {/* Caption — always visible, deepens on hover */}
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-void/85 via-void/40 to-transparent">
                    <div className="flex items-end justify-between gap-3">
                      <span className="font-display text-base md:text-lg text-blush leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                        {img.title}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-amber whitespace-nowrap pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        View &rarr;
                      </span>
                    </div>
                  </figcaption>
                </motion.figure>
              );
            })}
          </motion.div>

          <Reveal delay={0.4}>
            <div className="text-center mt-14">
              <Link
                to="/gallery"
                className="inline-flex items-center font-body text-sm text-blush hover:text-amber transition-colors duration-300 group underline-grow"
              >
                Browse the Full Gallery
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
              <div className="overflow-hidden rounded-xl shadow-elevated border border-amber/30">
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
                className="absolute -bottom-6 -right-3 lg:-bottom-8 lg:-right-8 bg-[#2A2520]/55 backdrop-blur-xl border border-amber/30 rounded-3xl p-5 max-w-[200px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
              >
                <p className="font-mono text-[10px] tracking-[0.2em] text-amber uppercase mb-1">Head Chef</p>
                <p className="font-accent text-2xl text-blush italic leading-tight">Krishna Chaithanya</p>
                <p className="font-mono text-[10px] tracking-[0.15em] text-parchment/70 uppercase mt-2">
                  Le Cordon Bleu &middot; London
                </p>
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
              {"Cuisine is the art of turning memory into flavor.".split(" ").map((w, i) => (
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
                  Two Decades of Mastery
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.5}>
              <Link
                to="/about"
                className="inline-flex items-center mt-8 font-body font-semibold text-sm text-[#2A2520] hover:text-amber transition-colors duration-300 group underline-grow"
              >
                Meet The Chef
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
            number="05"
            eyebrow="Guest Voices"
            title={
              <>
                What our guests <em className="italic text-gold-shimmer">say</em>
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
                  className="glass-card p-8 w-[400px] flex-shrink-0 hover-lift group"
                >
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="text-amber fill-amber" />
                    ))}
                  </div>
                  <p className="font-accent text-xl text-blush italic leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-charcoal">
                    <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center">
                      <span className="font-display text-sm text-amber">{t.authorName[0]}</span>
                    </div>
                    <div>
                      <p className="font-body text-sm text-blush">{t.authorName}</p>
                      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-taupe mt-0.5">
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
              number="06"
              eyebrow="What's On"
              theme="light"
              title={
                <>
                  Upcoming <em className="italic text-gold-shimmer">events</em>
                </>
              }
            />
            <Reveal delay={0.2}>
              <Link
                to="/events"
                className="magnetic-btn inline-flex items-center px-7 py-3 border border-amber text-amber text-sm rounded-full hover:bg-amber/10 transition-colors duration-300 self-start lg:self-auto"
              >
                View All Events &rarr;
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
                className="group cursor-pointer relative overflow-hidden rounded-xl bg-white/55 backdrop-blur-sm border border-[#2A2520]/15 hover:border-amber/60 shadow-[0_10px_40px_-15px_rgba(42,37,32,0.25)] hover:shadow-[0_20px_60px_-15px_rgba(42,37,32,0.35)] transition-all duration-500"
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
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs text-amber tracking-[0.15em]">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
                    </span>
                    <span className="h-px w-8 bg-amber/40" />
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#2A2520]/60">
                      {event.category.replace("-", " ")}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-[#2A2520] group-hover:text-amber transition-colors duration-500 mb-3">
                    {event.title}
                  </h3>
                  <p className="font-body text-sm text-[#2A2520]/75 line-clamp-2 mb-5">
                    {event.description}
                  </p>
                  <Link
                    to="/reservation"
                    className="inline-flex items-center font-body text-sm font-semibold text-[#2A2520] hover:text-amber transition-colors group/link"
                  >
                    Reserve Your Spot
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
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-fixed bg-cover bg-center px-6 py-24"
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
          className="relative z-10 max-w-3xl w-full mx-auto bg-blush/95 backdrop-blur-sm border border-amber/30 shadow-elevated rounded-sm px-8 py-14 md:px-16 md:py-20 text-center"
        >
          {/* Decorative corner ticks */}
          <span className="absolute top-3 left-3 w-5 h-5 border-l border-t border-amber/60" aria-hidden="true" />
          <span className="absolute top-3 right-3 w-5 h-5 border-r border-t border-amber/60" aria-hidden="true" />
          <span className="absolute bottom-3 left-3 w-5 h-5 border-l border-b border-amber/60" aria-hidden="true" />
          <span className="absolute bottom-3 right-3 w-5 h-5 border-r border-b border-amber/60" aria-hidden="true" />

          <Reveal>
            <p className="section-label mb-5">JOIN US</p>
          </Reveal>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.1, 0.1)}
            className="font-display font-semibold text-5xl md:text-7xl lg:text-8xl text-[#2A2520] leading-[1.05] tracking-tight"
          >
            {[{ w: "Reserve" }, { w: "your", italic: true }, { w: "table" }].map((item, i) => (
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
            <p className="font-body font-semibold text-base md:text-lg text-[#2A2520] mt-8 max-w-md mx-auto">
              Whether an intimate dinner for two or a celebration with friends, we&apos;d love to welcome you.
            </p>
          </Reveal>
          <Reveal delay={0.7}>
            <Link
              to="/reservation"
              className="magnetic-btn inline-flex items-center mt-10 px-10 py-5 bg-[#2A2520] text-blush text-sm font-medium tracking-[0.15em] uppercase rounded-full hover:bg-void transition-all duration-300 hover:scale-105"
            >
              Book Now
            </Link>
          </Reveal>

          {/* Quick contact */}
          <Reveal delay={0.9}>
            <div className="mt-12 flex items-center justify-center gap-6 flex-wrap text-[#2A2520]/70">
              <a href="tel:+212535123456" className="font-mono text-xs tracking-[0.2em] hover:text-amber transition-colors">
                +212 535 123 456
              </a>
              <span className="text-amber/60">&middot;</span>
              <span className="font-mono text-xs tracking-[0.2em]">
                OPEN DAILY &middot; 8AM &ndash; 12AM
              </span>
            </div>
          </Reveal>
        </motion.div>
      </section>
    </div>
  );
}
