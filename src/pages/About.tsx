import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trpc } from "@/providers/trpc";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { fadeUp, staggerContainer, viewportOnce, EASE_OUT_EXPO } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  { year: "2012", title: "The Beginning", desc: "Amira and Karim open a small terrace cafe in the Fes medina" },
  { year: "2014", title: "First Recognition", desc: "Featured in Conde Nast Traveller as 'Fes' Best-Kept Secret'" },
  { year: "2015", title: "Chef Krishna Joins", desc: "Chef Krishna Chaithanya joins from London to lead the kitchen" },
  { year: "2016", title: "The Expansion", desc: "Terrace expanded, bar added, first cocktail menu launched" },
  { year: "2018", title: "Award-Winning", desc: "Named 'Best Restaurant in Morocco' by Moroccan Food Awards" },
  { year: "2019", title: "Private Dining", desc: "Exclusive private dining room opens for intimate events" },
  { year: "2020", title: "Adaptation", desc: "Launched takeaway and at-home dining experiences" },
  { year: "2022", title: "10 Years", desc: "Celebrated a decade of excellence with a month-long festival" },
  { year: "2025", title: "Today", desc: "Continuing to push boundaries and welcome guests worldwide" },
];

const stats: Array<{ value: number; suffix: string; label: string; decimal?: boolean }> = [
  { value: 12, suffix: "+", label: "Years of Excellence" },
  { value: 3, suffix: "", label: "Master Chefs" },
  { value: 50, suffix: "k+", label: "Guests Served" },
  { value: 4.9, suffix: "", label: "Average Rating", decimal: true },
];

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    rating: 5,
    quote:
      "An unforgettable evening. The terrace at sunset, the rfissa, the warmth of the staff — La Breva captures the soul of Fes like nowhere else.",
    authorName: "Sophie Laurent",
    authorLocation: "Paris, France",
  },
  {
    id: 2,
    rating: 5,
    quote:
      "Chef Krishna's tasting menu was a love letter to India. Every course told a story, and the pairings were impeccable. Worth flying for.",
    authorName: "Marcus Chen",
    authorLocation: "Singapore",
  },
  {
    id: 3,
    rating: 5,
    quote:
      "We celebrated our anniversary on the rooftop and the team made it magical — candles, mint tea, a personal note from the chef. Pure hospitality.",
    authorName: "Amal & Hicham El Idrissi",
    authorLocation: "Casablanca, Morocco",
  },
];

export default function About() {
  const { data: testimonialsData } = trpc.public.testimonials.useQuery();
  const testimonials =
    testimonialsData && testimonialsData.length > 0
      ? testimonialsData.slice(0, 3)
      : DEFAULT_TESTIMONIALS;
  const reduce = useReducedMotion();

  const headerRef = useRef<HTMLDivElement>(null);
  const chefImgRef = useRef<HTMLImageElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);

  // Parallax on header background pattern
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });
  const patternY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // GSAP: timeline center line draw + chef image parallax
  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: timelineLineRef.current.parentElement!,
              start: "top 75%",
              end: "bottom 25%",
              scrub: 1.4,
            },
          }
        );
      }
      if (chefImgRef.current) {
        gsap.to(chefImgRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: chefImgRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }
    });
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [reduce]);

  return (
    <div className="bg-void min-h-screen">
      {/* Header */}
      <section
        ref={headerRef}
        className="relative min-h-screen min-h-[100svh] flex items-center justify-center bg-void text-center px-6 overflow-hidden"
      >
        {/* Layer 1 — cinematic background photo with parallax */}
        <motion.div
          style={{ y: patternY }}
          className="absolute inset-0 -top-10 -bottom-10"
        >
          <img
            src="/picts/inside/interior.jpg"
            alt=""
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover animate-hero-zoom"
            aria-hidden="true"
          />
        </motion.div>

        {/* Layer 2 — dark at top, fades to transparent at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E0D0C]/85 via-[#0E0D0C]/35 to-transparent" />
        {/* Layer 3 — side vignette for cinematic edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,10,0.85)_100%)]" />
        {/* Layer 4 — subtle noise texture (already global noise-overlay style) */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Layer 5 — amber spotlight behind heading */}
        <motion.div
          style={{ opacity: headerOpacity }}
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(200,149,108,0.18)_0%,transparent_70%)] blur-3xl animate-drift-slow"
        />

        {/* Layer 6 — Roman numeral year watermark */}
        <motion.span
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.07, scale: 1 }}
          transition={{ duration: 2, ease: EASE_OUT_EXPO }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display italic text-[clamp(8rem,22vw,22rem)] text-blush leading-none pointer-events-none select-none whitespace-nowrap z-0"
          aria-hidden="true"
        >
          MMXII
        </motion.span>

        {/* Layer 7 — architectural rule lines */}
        <div className="absolute top-0 bottom-0 left-6 lg:left-12 w-px bg-gradient-to-b from-transparent via-amber/30 to-transparent hidden md:block" />
        <div className="absolute top-0 bottom-0 right-6 lg:right-12 w-px bg-gradient-to-b from-transparent via-amber/30 to-transparent hidden md:block" />

        {/* Content */}
        <motion.div style={{ opacity: headerOpacity }} className="relative z-10 max-w-5xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-5 mb-8">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.1 }}
              className="h-px w-14 md:w-20 bg-amber/60 origin-right inline-block"
            />
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.05em" }}
              animate={{ opacity: 1, letterSpacing: "0.32em" }}
              transition={{ duration: 1.1, delay: 0.2 }}
              className="font-mono text-[11px] md:text-xs uppercase text-amber"
            >
              Our Story
            </motion.p>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.1 }}
              className="h-px w-14 md:w-20 bg-amber/60 origin-left inline-block"
            />
          </div>

          {/* Title — deep amber so it stays readable on both bright and dark areas of the photo */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.08, 0.4)}
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] text-blush leading-[0.98] tracking-tight [text-shadow:0_2px_30px_rgba(10,10,10,0.7),0_0_60px_rgba(10,10,10,0.4)]"
          >
            {[
              { w: "The" },
              { w: "Story" },
              { w: "of", italic: true },
              { w: "La", brand: true },
              { w: "Breva", brand: true },
            ].map((item, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 70, rotateX: -25 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    transition: { duration: 1.2, ease: EASE_OUT_EXPO },
                  },
                }}
                className={`inline-block mr-[0.18em] ${item.brand ? "text-amber" : ""}`}
                style={{ transformOrigin: "50% 100%" }}
              >
                {item.italic ? <em className="italic font-normal">{item.w}</em> : item.w}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 1, ease: EASE_OUT_EXPO }}
            className="font-accent text-xl md:text-2xl italic text-parchment/85 mt-10 max-w-2xl mx-auto leading-relaxed"
          >
            Where tradition meets modernity &mdash; in the heart of Fes.
          </motion.p>

        </motion.div>
      </section>

      {/* Brand Story */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal>
              <h2 className="font-display text-4xl md:text-5xl text-blush mb-6">
                A Dream Born at Dusk
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-body text-base text-parchment leading-relaxed max-w-md mb-4">
                La Breva was born from a simple idea: to create a place where the Mediterranean&apos;s golden light meets the ancient soul of Morocco. Named after the evening breeze that sweeps across the Mediterranean coast, our restaurant is a sanctuary of warmth and flavor in the heart of the Fes medina.
              </p>
              <p className="font-body text-base text-parchment leading-relaxed max-w-md">
                Founded in 2012 by siblings Amira and Karim Benali, La Breva began as a small terrace cafe serving mint tea and homemade pastries. Over the years, it evolved into one of Morocco&apos;s most celebrated dining destinations.
              </p>
            </Reveal>
          </div>
          <div className="relative">
            <Reveal variant="scale" delay={0.2}>
              <div className="overflow-hidden rounded-lg w-[85%] ml-auto shadow-elevated">
                <motion.img
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1000&q=80"
                  alt="Cocktail preparation"
                  loading="lazy"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
                  className="w-full"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Philosophy — a typographic manifesto: three inscriptions on the kitchen wall */}
      <section className="relative py-32 md:py-48 px-6 overflow-hidden" style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #141414 50%, #0A0A0A 100%)" }}>
        {/* Single quiet amber pool, drifting */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.10)_0%,transparent_65%)] blur-3xl animate-drift-slow" />

        <div className="max-w-4xl mx-auto relative">
          {/* Cover plate — like the title page of a chef's notebook */}
          <div className="text-center mb-20 md:mb-28">
            <Reveal>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-12 bg-amber/50" />
                <p className="font-mono text-[10px] tracking-[0.45em] uppercase text-amber">— Philosophy —</p>
                <span className="h-px w-12 bg-amber/50" />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <h2 className="font-display italic text-5xl md:text-7xl text-blush leading-[1.02] tracking-tight">
                Our <span className="text-gold-shimmer not-italic font-display italic">Approach</span>
              </h2>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="font-accent italic text-lg md:text-xl text-parchment/70 mt-6 max-w-xl mx-auto leading-relaxed">
                Three lines, written in 2012 — still pinned to the wall of our kitchen today.
              </p>
            </Reveal>
          </div>

          {/* Three manifesto entries — pull-quote treatment, no images */}
          <ol className="space-y-20 md:space-y-28">
            {[
              {
                roman: "i",
                eyebrow: "On Sourcing",
                quote: "Nothing on our plate travels further than fifty kilometres.",
                signature: "Local Ingredients",
              },
              {
                roman: "ii",
                eyebrow: "On the Season",
                quote: "The menu is rewritten four times a year. The kitchen listens to the calendar.",
                signature: "Seasonal Menu",
              },
              {
                roman: "iii",
                eyebrow: "On Craft",
                quote: "Bread at dawn. Pasta by hand. Patience by the day.",
                signature: "Artisan Craft",
              },
            ].map((p, idx, arr) => (
              <li key={p.roman} className="relative">
                {/* Inscription block */}
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-start">
                  {/* Roman numeral — large, italic, drops in with a rotation */}
                  <motion.span
                    initial={{ opacity: 0, x: -30, rotate: -8 }}
                    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
                    className="font-display italic text-[clamp(5rem,12vw,9rem)] leading-[0.85] text-gold-shimmer select-none -mt-1"
                  >
                    {p.roman}.
                  </motion.span>

                  <div>
                    {/* Eyebrow — chapter tag */}
                    <motion.div
                      initial={{ opacity: 0, letterSpacing: "0.1em" }}
                      whileInView={{ opacity: 1, letterSpacing: "0.42em" }}
                      viewport={viewportOnce}
                      transition={{ duration: 1.2, delay: 0.15, ease: EASE_OUT_EXPO }}
                      className="flex items-center gap-3 mb-5"
                    >
                      <span className="h-px w-8 bg-amber/55" />
                      <span className="font-mono text-[10px] uppercase text-amber">{p.eyebrow}</span>
                    </motion.div>

                    {/* The quote — clip-path wipes open like ink absorbing into paper */}
                    <motion.blockquote
                      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                      whileInView={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                      viewport={viewportOnce}
                      transition={{ duration: 1.4, delay: 0.25, ease: EASE_OUT_EXPO }}
                      className="font-accent italic text-3xl md:text-5xl text-blush leading-[1.15]"
                    >
                      &ldquo;{p.quote}&rdquo;
                    </motion.blockquote>

                    {/* Signature line */}
                    <Reveal delay={0.55}>
                      <div className="flex items-center gap-3 mt-8">
                        <span className="h-px w-12 bg-amber/40" />
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-parchment/65">
                          {p.signature}
                        </span>
                      </div>
                    </Reveal>
                  </div>
                </div>

                {/* Connecting divider — diamond + rules, scales open between entries */}
                {idx < arr.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={viewportOnce}
                    transition={{ duration: 1.1, delay: 0.5, ease: EASE_OUT_EXPO }}
                    className="flex items-center justify-center gap-3 mt-20 md:mt-28 origin-center"
                  >
                    <span className="h-px w-32 md:w-40 bg-amber/25" />
                    <span className="w-1.5 h-1.5 rotate-45 border border-amber/60" aria-hidden="true" />
                    <span className="h-px w-32 md:w-40 bg-amber/25" />
                  </motion.div>
                )}
              </li>
            ))}
          </ol>

          {/* Closing signature stamp */}
          <Reveal delay={0.2}>
            <div className="flex flex-col items-center mt-24 md:mt-32">
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-amber/70 mb-3">
                — Signed —
              </span>
              <span className="font-accent italic text-2xl md:text-3xl text-blush">
                Krishna Chaithanya
              </span>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-parchment/55 mt-2">
                Head Chef
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Chef */}
      <section className="py-24 md:py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="section-label mb-4">THE CHEF</p>
              <h2 className="font-display text-4xl md:text-5xl text-blush mb-2">
                Meet Our Chef
              </h2>
              <p className="font-accent text-xl text-amber mb-6">Krishna Chaithanya</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-body text-base text-parchment leading-relaxed max-w-md mb-4">
                Born in Hyderabad and trained at the Institute of Hotel Management Mumbai before earning his Grand Dipl&ocirc;me at Le Cordon Bleu London, Chef Krishna brings a refined perspective to modern Indian cuisine. His cooking is deeply rooted in the flavors of his grandmother&apos;s kitchen in the old city &mdash; slow-cooked dum biryani, fragrant kebabs, the patient layering of garam masala &mdash; yet elevated through modern technique and presentation.
              </p>
              <p className="font-body text-base text-parchment leading-relaxed max-w-md">
                Before joining La Breva, Krishna spent a decade working in Michelin-starred kitchens across London and Singapore, from Gymkhana to Burnt Ends.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <motion.blockquote
                initial={{ borderLeftColor: "rgba(200,149,108,0)" }}
                whileInView={{ borderLeftColor: "rgba(200,149,108,1)" }}
                viewport={viewportOnce}
                transition={{ duration: 1, delay: 0.3 }}
                className="mt-8 border-l-2 pl-5"
              >
                <p className="font-accent text-xl text-blush italic">
                  &ldquo;The best dishes are the ones that make you close your eyes and remember.&rdquo;
                </p>
              </motion.blockquote>
            </Reveal>
          </div>
          <div className="order-1 lg:order-2">
            <Reveal variant="scale" delay={0.2}>
              <div className="overflow-hidden rounded-lg w-[80%] mx-auto shadow-elevated">
                <img
                  ref={chefImgRef}
                  src="/picts/team/chef.jpg"
                  alt="Chef Krishna Chaithanya"
                  loading="lazy"
                  className="w-full"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32 md:py-48 bg-obsidian px-6 relative overflow-hidden">
        {/* Ambient backdrop */}
        <div className="pointer-events-none absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.1)_0%,transparent_70%)] blur-3xl animate-drift-slow" />
        <div
          className="pointer-events-none absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,230,211,0.06)_0%,transparent_70%)] blur-3xl animate-drift-slow"
          style={{ animationDelay: "-9s" }}
        />

        <div className="max-w-5xl mx-auto relative">
          {/* Heading block */}
          <Reveal>
            <div className="text-center mb-20 md:mb-28">
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
                  className="h-px w-16 bg-amber/40 origin-right"
                />
                <motion.div
                  initial={{ rotate: 0, opacity: 0, scale: 0 }}
                  whileInView={{ rotate: 45, opacity: 1, scale: 1 }}
                  viewport={viewportOnce}
                  transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 120, damping: 18 }}
                  className="w-2.5 h-2.5 border border-amber"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
                  className="h-px w-16 bg-amber/40 origin-left"
                />
              </div>
              <motion.p
                initial={{ opacity: 0, letterSpacing: "0.05em" }}
                whileInView={{ opacity: 1, letterSpacing: "0.12em" }}
                viewport={viewportOnce}
                transition={{ duration: 1.3 }}
                className="section-label mb-5 text-base"
              >
                JOURNEY
              </motion.p>
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.4, margin: "-80px" }}
                variants={staggerContainer(0.08, 0.05)}
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-blush leading-[1.05] tracking-tight"
                style={{ perspective: "1200px" }}
              >
                {/* "Our" — letters fall in from above */}
                <motion.span
                  variants={staggerContainer(0.04)}
                  className="inline-block mr-[0.25em] align-middle"
                >
                  {"Our".split("").map((ch, idx) => (
                    <motion.span
                      key={`our-${idx}`}
                      variants={{
                        hidden: { opacity: 0, y: -80, rotateX: 95, scale: 0.7 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          rotateX: 0,
                          scale: 1,
                          transition: { duration: 0.65, ease: EASE_OUT_EXPO },
                        },
                      }}
                      className="inline-block"
                      style={{ transformOrigin: "50% 0%" }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </motion.span>

                {/* "Milestones" — italic gold-shimmer letters drop in from above too */}
                <motion.span
                  variants={staggerContainer(0.04, 0.1)}
                  className="inline-block align-middle italic"
                >
                  {"Milestones".split("").map((ch, idx) => (
                    <motion.span
                      key={`m-${idx}`}
                      variants={{
                        hidden: { opacity: 0, y: -90, rotateX: 110, scale: 0.6 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          rotateX: 0,
                          scale: 1,
                          transition: { duration: 0.7, ease: EASE_OUT_EXPO },
                        },
                      }}
                      className="inline-block text-gold-shimmer"
                      style={{ transformOrigin: "50% 0%" }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </motion.span>
              </motion.h2>

              {/* Underline — draws in from center after the title settles */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 1.4, delay: 1.4, ease: EASE_OUT_EXPO }}
                className="mt-6 h-px w-48 md:w-64 mx-auto bg-gradient-to-r from-transparent via-amber to-transparent origin-center"
                aria-hidden="true"
              />

              {/* Floating gold sparkle that rises after the title */}
              <motion.span
                initial={{ opacity: 0, y: 10, scale: 0 }}
                whileInView={{ opacity: [0, 1, 0], y: -40, scale: [0, 1, 0.6] }}
                viewport={viewportOnce}
                transition={{ duration: 2.2, delay: 1.8, ease: EASE_OUT_EXPO }}
                className="inline-block mt-3 w-1.5 h-1.5 rotate-45 bg-amber shadow-[0_0_18px_rgba(200,149,108,0.8)]"
                aria-hidden="true"
              />
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: 1.4, duration: 1.2 }}
                className="font-body text-base md:text-lg text-parchment/70 mt-8 max-w-xl mx-auto leading-relaxed"
              >
                Thirteen years of moments that shaped who we are &mdash; each one a story carved into the soul of La Breva.
              </motion.p>
            </div>
          </Reveal>

          {/* Timeline */}
          <div className="relative">
            {/* Background guide line */}
            <div className="absolute left-[23px] md:left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-amber/10 rounded-full" />
            {/* Animated foreground line — drawn on scroll by GSAP */}
            <div
              ref={timelineLineRef}
              className="absolute left-[23px] md:left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber via-soft-gold to-amber/20 rounded-full shadow-[0_0_20px_rgba(200,149,108,0.3)]"
            />

            {milestones.map((m, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 70, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 1.5, ease: EASE_OUT_EXPO }}
                  className="relative mb-20 md:mb-28 last:mb-0"
                >
                  <div
                    className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 items-center ${
                      isEven ? "" : "md:[direction:rtl]"
                    }`}
                  >
                    {/* Illustration — faded line-art Moroccan archway with the year inscribed */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: 1.7, delay: 0.25, ease: EASE_OUT_EXPO }}
                      className="hidden md:flex justify-center items-center pl-16 md:pl-0 [direction:ltr]"
                    >
                      <svg
                        viewBox="0 0 220 220"
                        className="w-[260px] h-[260px] lg:w-[300px] lg:h-[300px] opacity-30"
                        aria-hidden="true"
                      >
                        {/* Outer ornamental ring */}
                        <circle cx="110" cy="110" r="105" fill="none" stroke="#C8956C" strokeWidth="0.7" />
                        <circle cx="110" cy="110" r="92" fill="none" stroke="#C8956C" strokeWidth="0.4" strokeDasharray="2 4" />
                        {/* Twelve tick marks around the inner ring */}
                        {Array.from({ length: 12 }).map((_, k) => (
                          <line
                            key={k}
                            x1="110"
                            y1="14"
                            x2="110"
                            y2="22"
                            stroke="#C8956C"
                            strokeWidth="0.7"
                            transform={`rotate(${k * 30} 110 110)`}
                          />
                        ))}
                        {/* Moroccan keyhole arch */}
                        <path
                          d="M 65,165 L 65,95 Q 65,52 110,52 Q 155,52 155,95 L 155,165 Z"
                          fill="none"
                          stroke="#C8956C"
                          strokeWidth="1"
                        />
                        <path
                          d="M 76,165 L 76,100 Q 76,63 110,63 Q 144,63 144,100 L 144,165"
                          fill="none"
                          stroke="#C8956C"
                          strokeWidth="0.5"
                          opacity="0.7"
                        />
                        {/* Top crown — minaret spire */}
                        <path
                          d="M 100,52 Q 110,30 120,52"
                          fill="none"
                          stroke="#C8956C"
                          strokeWidth="0.8"
                        />
                        <line x1="110" y1="40" x2="110" y2="28" stroke="#C8956C" strokeWidth="0.7" />
                        <circle cx="110" cy="26" r="2.2" fill="#C8956C" />
                        {/* Year inscribed inside the arch */}
                        <text
                          x="110"
                          y="135"
                          textAnchor="middle"
                          fill="#C8956C"
                          fontSize="26"
                          fontFamily="Playfair Display, serif"
                          fontStyle="italic"
                          fontWeight="500"
                        >
                          {m.year}
                        </text>
                        {/* Decorative arabesque flourishes at the base */}
                        <path d="M 50,180 Q 110,170 170,180" fill="none" stroke="#C8956C" strokeWidth="0.5" opacity="0.5" />
                        <path d="M 40,190 Q 110,178 180,190" fill="none" stroke="#C8956C" strokeWidth="0.4" opacity="0.4" />
                        {/* Tiny corner stars */}
                        <g fill="#C8956C" opacity="0.65">
                          <path d="M 110,15 l 2,5 5,1 -4,3 1,5 -4,-3 -4,3 1,-5 -4,-3 5,-1 z" transform="translate(-80 70)" />
                          <path d="M 110,15 l 2,5 5,1 -4,3 1,5 -4,-3 -4,3 1,-5 -4,-3 5,-1 z" transform="translate(80 70)" />
                        </g>
                      </svg>
                    </motion.div>

                    {/* Content side — pill + title + card */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 60 : -60, filter: "blur(4px)" }}
                      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.35 }}
                      className={`relative pl-16 md:pl-0 [direction:ltr] ${
                        isEven ? "md:pl-10 lg:pl-16" : "md:pr-10 lg:pr-16"
                      }`}
                    >
                      {/* Date pill — amber gradient, sits beside the dot */}
                      <div className={`relative inline-flex items-center gap-2 mb-5 ${isEven ? "" : "md:ml-auto"}`}>
                        <span className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-amber via-soft-gold to-amber text-void font-mono text-[11px] font-semibold tracking-[0.25em] uppercase rounded-full shadow-[0_8px_24px_-8px_rgba(200,149,108,0.7)]">
                          {m.year}
                        </span>
                      </div>

                      {/* Title with subtitle pill */}
                      <h3 className="font-display text-2xl md:text-3xl text-blush leading-tight">
                        {m.title}
                      </h3>

                      {/* Description card */}
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                        className="group mt-5 relative rounded-xl bg-gradient-to-br from-warm-stone/40 to-obsidian/60 border border-charcoal/80 hover:border-amber/40 backdrop-blur-[6px] transition-colors duration-700 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
                      >
                        <div className="p-6 md:p-7">
                          <p className="font-body text-base md:text-[16.5px] text-parchment/85 leading-relaxed">
                            {m.desc}
                          </p>
                          <button
                            type="button"
                            className="inline-flex items-center mt-5 font-mono text-[11px] tracking-[0.3em] uppercase text-amber hover:text-soft-gold transition-colors duration-300 group/link"
                          >
                            Read More
                            <span className="ml-2 transition-transform duration-300 group-hover/link:translate-x-1">&rsaquo;</span>
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Dot cluster on the center line */}
                    <div className="absolute left-6 md:left-1/2 top-8 md:top-1/2 -ml-5 md:-ml-5 -mt-5 md:-mt-5 z-10 flex items-center justify-center w-10 h-10 [direction:ltr]">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: [0, 1.6, 1.3], opacity: [0, 0.8, 0.35] }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: 0.9, duration: 2.4, ease: EASE_OUT_EXPO }}
                        className="absolute w-10 h-10 rounded-full border-2 border-amber/60"
                      />
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: 0.6, duration: 1.1, ease: EASE_OUT_EXPO }}
                        className="absolute w-6 h-6 rounded-full bg-amber/15 border border-amber/30 backdrop-blur-sm"
                      />
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 110, damping: 16 }}
                        whileHover={{ scale: 1.4 }}
                        className="relative w-3.5 h-3.5 rounded-full bg-amber shadow-[0_0_25px_rgba(200,149,108,0.9),0_0_40px_rgba(200,149,108,0.4)]"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* End cap — animated diamond */}
            <div className="absolute left-6 md:left-1/2 bottom-0 -ml-2 md:-ml-2 w-4 h-4 z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 45 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.4, type: "spring", stiffness: 90, damping: 18 }}
                className="w-full h-full border-2 border-amber bg-obsidian shadow-[0_0_25px_rgba(200,149,108,0.6)]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 bg-warm-stone px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,149,108,0.08)_0%,transparent_70%)]" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.12)}
          className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 lg:gap-12 relative"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center">
              <p className="font-display text-5xl text-amber">
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
                transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
                className="w-10 h-px bg-amber/40 mx-auto mt-2 mb-2 origin-center"
              />
              <p className="font-body text-sm text-parchment">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="section-label mb-2 text-center">VOICES</p>
            <h2 className="font-display text-4xl md:text-5xl text-blush text-center mb-12">
              What They Say
            </h2>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.12)}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                className="glass-card p-8 hover-lift"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <motion.svg
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.08, type: "spring", stiffness: 300, damping: 16 }}
                      className="w-4 h-4 text-amber fill-amber"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </motion.svg>
                  ))}
                </div>
                <p className="font-accent text-lg text-blush italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center">
                    <span className="font-body text-xs text-amber">{t.authorName[0]}</span>
                  </div>
                  <div>
                    <p className="font-body text-sm text-blush">{t.authorName}</p>
                    <p className="font-body text-xs text-muted-taupe">{t.authorLocation}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
