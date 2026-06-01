import { useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/Reveal";
import { EASE_OUT_EXPO, staggerContainer, viewportOnce } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/* -----------------------------------------------------------------------------
 * About — three chapters:
 *   01 · Cinematic hero (Home-style)
 *   02 · Distinctions / Press archive
 *   03 · Hairline + signature close
 * -------------------------------------------------------------------------- */

const recognitions = [
  {
    title: "Choix des Voyageurs",
    desc:
      "Classée parmi les meilleures tables de Fès selon les avis des voyageurs et l'expérience d'hospitalité que nous offrons depuis 2012.",
  },
  {
    title: "Plébiscitée par nos Invités",
    desc:
      "Une vaste communauté de visiteurs locaux et internationaux nous a accordé des notes d'exception sur les principales plateformes.",
  },
  {
    title: "Destination Gastronomique",
    desc:
      "Reconnue parmi les restaurants les plus appréciés de la ville pour son atmosphère, son service, et son rooftop panoramique sur la médina.",
  },
];

const ROMAN = ["i", "ii", "iii"];

export default function About() {
  const reduce = useReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const heroParallaxRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 0.75], [1, 0]);
  const heroContentY = useTransform(
    heroProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "26%"]
  );

  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      if (heroParallaxRef.current && heroRef.current) {
        gsap.to(heroParallaxRef.current, {
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

  return (
    <div className="bg-void">
      {/* ====================================================================
        * 01 — CINEMATIC HERO (Home-style)
        * ================================================================== */}
      <section
        ref={heroRef}
        className="relative min-h-screen min-h-[100svh] flex items-center overflow-hidden"
      >
        {/* Parallax background photo */}
        <div ref={heroParallaxRef} className="absolute inset-0 -top-20 -bottom-20">
          <img
            src="/picts/inside/interior.jpg"
            alt=""
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover animate-hero-zoom"
            aria-hidden="true"
          />
          {/* Left-to-right dark veil */}
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
          <div
            className="absolute top-[55%] right-[8%] w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(245,230,211,0.12)_0%,transparent_70%)] blur-3xl animate-drift-slow"
            style={{ animationDelay: "-6s" }}
          />
          <div
            className="absolute bottom-[12%] left-[40%] w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.18)_0%,transparent_70%)] blur-2xl animate-drift-slow"
            style={{ animationDelay: "-12s" }}
          />
        </div>

        {/* Architectural side rules */}
        <div className="absolute top-0 bottom-0 left-6 lg:left-12 w-px bg-gradient-to-b from-transparent via-amber/30 to-transparent hidden md:block" />
        <div className="absolute top-0 bottom-0 right-6 lg:right-12 w-px bg-gradient-to-b from-transparent via-amber/30 to-transparent hidden md:block" />

        {/* Content — left-aligned */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroContentY }}
          className="relative z-10 text-left px-6 md:px-12 lg:px-20 max-w-5xl mr-auto"
        >
          {/* Word-stagger title */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1, 0.5)}
            className="font-display text-[clamp(2.6rem,7vw,6rem)] leading-[1.04] text-blush tracking-tight [text-shadow:0_2px_30px_rgba(10,10,10,0.55)]"
          >
            {[
              { word: "L'Histoire" },
              { word: "de", italic: true },
              { word: "La" },
              { word: "Breva", italic: true, shimmer: true },
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
                  <em
                    className={`italic font-normal ${item.shimmer ? "text-gold-shimmer" : ""}`}
                  >
                    {item.word}
                  </em>
                ) : (
                  item.word
                )}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 2 }}
            className="font-accent italic text-xl md:text-2xl lg:text-3xl text-parchment/90 mt-10 md:mt-12 max-w-2xl leading-relaxed"
          >
            Une maison méditerranéenne sur les hauteurs de Fès.
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.9 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-blush/60">
            défiler
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="block w-px h-8 bg-gradient-to-b from-amber/70 to-transparent"
            aria-hidden="true"
          />
        </motion.div>
      </section>

      {/* ====================================================================
        * 02 — EXCELLENCE RECONNUE · luxury awards block
        * ================================================================== */}
      <section className="relative bg-obsidian py-28 md:py-44 px-6 md:px-12 lg:px-20 overflow-hidden">
        {/* Single restrained ambient pool */}
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(200,149,108,0.06)_0%,transparent_70%)] blur-3xl animate-drift-slow" />

        <div className="max-w-5xl mx-auto relative">
          {/* Heading block — centered, editorial restraint */}
          <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28">
            <div className="flex items-center justify-center gap-4 mb-7">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
                className="block h-px w-10 md:w-14 bg-amber/70 origin-right"
              />
              <motion.span
                initial={{ opacity: 0, letterSpacing: "0.12em" }}
                whileInView={{ opacity: 1, letterSpacing: "0.42em" }}
                viewport={viewportOnce}
                transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.15 }}
                className="font-mono font-semibold text-[10px] md:text-[11px] uppercase text-amber"
              >
                Distinctions
              </motion.span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
                className="block h-px w-10 md:w-14 bg-amber/70 origin-left"
              />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
              className="font-display text-[clamp(2.4rem,5.4vw,4.75rem)] leading-[1.06] tracking-tight text-blush"
            >
              Une maison{" "}
              <em className="italic text-gold-shimmer">distinguée</em>.
            </motion.h2>

            <Reveal delay={0.35}>
              <p className="font-accent italic text-lg md:text-xl text-parchment/75 mt-8 md:mt-10 leading-relaxed">
                Saluée par les voyageurs, les passionnés de gastronomie et nos invités du
                quartier — pour une hospitalité exceptionnelle, des vues panoramiques sur la
                médina, et des soirées que l&apos;on n&apos;oublie pas.
              </p>
            </Reveal>
          </div>

          {/* Recognition entries — vertical list, no boxes */}
          <div className="border-y border-amber/25">
            {recognitions.map((r, i) => (
              <RecognitionRow
                key={r.title}
                roman={ROMAN[i]}
                title={r.title}
                desc={r.desc}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
        * 03 — HAIRLINE + SIGNATURE CLOSE
        * ================================================================== */}
      <section className="relative bg-void py-28 md:py-44 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
            className="block h-px w-full bg-amber/40 origin-center mb-14 md:mb-20"
            aria-hidden="true"
          />

          <div className="flex items-center justify-center gap-4 mb-8 md:mb-10">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
              className="block h-px w-10 md:w-14 bg-amber/70 origin-right"
            />
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.12em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.42em" }}
              viewport={viewportOnce}
              transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.15 }}
              className="font-mono font-semibold text-[10px] md:text-[11px] uppercase text-amber"
            >
              La Table
            </motion.span>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
              className="block h-px w-10 md:w-14 bg-amber/70 origin-left"
            />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.15 }}
            className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-tight text-blush mb-10 md:mb-12"
          >
            Rejoignez-<em className="italic text-gold-shimmer">nous</em>.
          </motion.h2>

          <Reveal delay={0.35}>
            <p className="font-accent italic text-2xl md:text-3xl lg:text-4xl text-blush leading-[1.4]">
              Une soirée à La Breva commence par{" "}
              <em className="text-gold-shimmer not-italic font-accent italic">
                un simple message
              </em>
              .
            </p>
          </Reveal>

          <Reveal delay={0.6}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="inline-block mt-12 md:mt-14"
            >
              <Link
                to="/reservation"
                className="magnetic-btn inline-flex items-center px-10 py-4 bg-amber text-void text-sm md:text-base font-bold tracking-[0.22em] uppercase rounded-full hover:bg-soft-gold transition-colors duration-300 shadow-[0_18px_40px_-14px_rgba(200,149,108,0.45)]"
              >
                Réserver une Table
              </Link>
            </motion.div>
          </Reveal>

        </div>
      </section>
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * Sub-components
 * -------------------------------------------------------------------------- */

function RecognitionRow({
  roman,
  title,
  desc,
  index,
}: {
  roman: string;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.95, delay: index * 0.08, ease: EASE_OUT_EXPO }}
      className="group grid grid-cols-12 gap-4 md:gap-8 py-10 md:py-14 border-b border-amber/20 transition-colors duration-500 hover:bg-amber/[0.025]"
    >
      {/* Roman numeral */}
      <div className="col-span-2 md:col-span-1 flex items-start pt-1">
        <span className="font-display italic text-3xl md:text-4xl text-amber/80 leading-none tracking-tight transition-colors duration-500 group-hover:text-amber">
          {roman}.
        </span>
      </div>

      {/* Content */}
      <div className="col-span-10 md:col-span-11">
        <h3 className="font-display text-3xl md:text-4xl lg:text-[2.6rem] text-blush leading-[1.12] mb-4 md:mb-5 transition-colors duration-500 group-hover:text-amber">
          {title}
        </h3>
        <p className="font-accent italic text-xl md:text-2xl text-parchment/85 leading-[1.5] max-w-3xl">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

