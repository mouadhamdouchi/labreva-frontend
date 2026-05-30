import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { EASE_OUT_EXPO } from "@/lib/motion";

const DEFAULT_MENU_ITEMS = [
  { id: 1, name: "Pan-Seared Sea Bass", description: "Saffron risotto, microgreens, lemon beurre blanc", price: 280, category: "mains", image: "/picts/menu/sea-bass.jpg", isChefsRec: true, winePairing: "Chardonnay Reserve" },
  { id: 2, name: "Rfissa", description: "Slow-cooked with apricots, almonds & fragrant spices", price: 320, category: "mains", image: "/picts/menu/lamb-tagine.jpg", isChefsRec: true, winePairing: "Mint Tea" },
  { id: 3, name: "Burrata Salad", description: "Heirloom tomatoes, basil oil, aged balsamic", price: 150, category: "starters", image: "/picts/menu/burrata-salad.jpg", isChefsRec: false, winePairing: "Sauvignon Blanc" },
  { id: 4, name: "Grilled Octopus", description: "Smoked paprika aioli, charred lemon, herbs", price: 195, category: "starters", image: "/picts/menu/grilled-octopus.jpg", isChefsRec: true, winePairing: "Albarino" },
  { id: 5, name: "Chocolate Fondant", description: "Molten center, vanilla ice cream, berry coulis", price: 120, category: "desserts", image: "/picts/menu/chocolate-fondant.jpg", isChefsRec: true, winePairing: "Dessert Wine" },
  { id: 6, name: "Moroccan Mint Tea", description: "Fresh mint, green tea, and traditional pour", price: 45, category: "tea", image: "/picts/menu/mint-tea.jpg", isChefsRec: true },
  { id: 7, name: "Fresh Orange Juice", description: "Squeezed to order from Agadir oranges", price: 40, category: "juices", image: "/picts/menu/orange-juice.jpg", isChefsRec: false },
  { id: 8, name: "Avocado & Almond Shake", description: "Rich and creamy with honey and crushed almonds", price: 65, category: "juices", image: "/picts/menu/avocado-shake.jpg" },
  { id: 9, name: "Virgin Mojito", description: "Muddled lime, fresh mint, sugar, and sparkling water", price: 75, category: "juices", image: "/picts/menu/virgin-mojito.jpg" },
  { id: 10, name: "Seasonal Smoothie", description: "Blend of fresh local mango, banana, and strawberry", price: 55, category: "juices", image: "/picts/menu/fruit-smoothie.jpg" },
];

type MenuItem = (typeof DEFAULT_MENU_ITEMS)[number];

// Course configuration — labels, French sub-labels, and order
const COURSE_ORDER: Array<{ key: string; title: string; french: string }> = [
  { key: "starters", title: "Starters", french: "Pour Commencer" },
  { key: "mains", title: "Mains", french: "Les Plats" },
  { key: "seafood", title: "Seafood", french: "De la Mer" },
  { key: "desserts", title: "Desserts", french: "La Douceur" },
  { key: "juices", title: "Juices", french: "Les Boissons" },
  { key: "tea", title: "Tea", french: "Thé à la Menthe" },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function CourseFloatingNav({ courses }: { courses: typeof COURSE_ORDER }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      // Only show the nav once you've scrolled past the header
      const top = document.getElementById("menu-top");
      const close = document.getElementById("menu-close");
      const headerBottom = top ? top.getBoundingClientRect().bottom : 0;
      const closeTop = close ? close.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
      setVisible(headerBottom < 80 && closeTop > window.innerHeight * 0.6);

      const mid = window.innerHeight * 0.4;
      let current = 0;
      courses.forEach((c, idx) => {
        const el = document.getElementById(`course-${c.key}`);
        if (!el) return;
        if (el.getBoundingClientRect().top <= mid) current = idx;
      });
      setActiveIdx(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [courses]);

  const prev = courses[activeIdx - 1];
  const next = courses[activeIdx + 1];
  const current = courses[activeIdx];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="flex items-center gap-2 px-3 py-2 bg-[#2A2520]/85 backdrop-blur-xl border border-amber/30 rounded-full shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]">
            {/* Prev */}
            <motion.button
              type="button"
              onClick={() => prev && scrollToId(`course-${prev.key}`)}
              disabled={!prev}
              whileHover={prev ? { scale: 1.08, x: -2 } : {}}
              whileTap={prev ? { scale: 0.92 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              aria-label={prev ? `Previous course: ${prev.title}` : "No previous course"}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 ${
                prev
                  ? "text-amber hover:bg-amber/15 cursor-pointer"
                  : "text-parchment/25 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </motion.button>

            {/* Current course label */}
            <div className="px-4 min-w-[140px] text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current?.key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white leading-none mb-1">
                    {String(activeIdx + 1).padStart(2, "0")} / {String(courses.length).padStart(2, "0")}
                  </p>
                  <p className="font-display italic text-base text-blush leading-none">
                    {current?.title}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next */}
            <motion.button
              type="button"
              onClick={() => next && scrollToId(`course-${next.key}`)}
              disabled={!next}
              whileHover={next ? { scale: 1.08, x: 2 } : {}}
              whileTap={next ? { scale: 0.92 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              aria-label={next ? `Next course: ${next.title}` : "No next course"}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 ${
                next
                  ? "text-amber hover:bg-amber/15 cursor-pointer"
                  : "text-parchment/25 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CoursePanel({ course, items, reduce, theme = "light" }: {
  course: typeof COURSE_ORDER[number];
  items: MenuItem[];
  reduce: boolean | null;
  theme?: "light" | "dark";
}) {
  // Default to first item in this course
  const [activeId, setActiveId] = useState<number>(items[0]?.id ?? 0);
  const activeIdx = Math.max(0, items.findIndex((i) => i.id === activeId));
  const active = items[activeIdx] ?? items[0];

  const cycle = (delta: number) => {
    if (!items.length) return;
    const nextIdx = (activeIdx + delta + items.length) % items.length;
    setActiveId(items[nextIdx].id);
    // Scroll the row into view, if user is far from it
    const el = document.getElementById(`dish-${items[nextIdx].id}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const offscreen = rect.top < 100 || rect.bottom > window.innerHeight - 100;
      if (offscreen) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const goPrev = () => cycle(-1);
  const goNext = () => cycle(1);

  if (!items.length) return null;

  const isDark = theme === "dark";
  const c = {
    sectionStyle: isDark
      ? { background: "linear-gradient(180deg, #0E0D0C 0%, #141414 100%)" }
      : undefined,
    borderTop: isDark ? "border-blush/10" : "border-[#2A2520]/15",
    title: isDark ? "text-blush" : "text-[#2A2520]",
    titleSub: isDark ? "text-parchment/60" : "text-[#2A2520]/60",
    rule: isDark ? "bg-blush/30" : "bg-[#2A2520]/40",
    imageHolder: isDark
      ? "bg-blush/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
      : "bg-[#2A2520]/5 shadow-[0_20px_60px_-15px_rgba(42,37,32,0.4)]",
    captionText: isDark ? "text-parchment/60" : "text-[#2A2520]/60",
    btnRing: isDark ? "border-blush/25" : "border-[#2A2520]/25",
    btnText: isDark ? "text-blush" : "text-[#2A2520]",
    btnBg: isDark ? "bg-void/40" : "bg-white/40",
    btnCount: isDark ? "text-parchment/55" : "text-[#2A2520]/55",
    btnCountMobile: isDark ? "text-parchment/50" : "text-[#2A2520]/50",
    rowBorder: isDark ? "border-blush/10" : "border-[#2A2520]/15",
    rowActiveBg: isDark ? "bg-blush/[0.04]" : "bg-[#2A2520]/[0.04]",
    rowIdx: isDark ? "text-parchment/40" : "text-[#2A2520]/40",
    nameActive: isDark ? "text-blush" : "text-[#2A2520]",
    nameInactive: isDark ? "text-blush/85" : "text-[#2A2520]/85",
    desc: isDark ? "text-parchment/65" : "text-[#2A2520]/65",
    wine: isDark ? "text-parchment/45" : "text-[#2A2520]/45",
    price: isDark ? "text-blush" : "text-[#2A2520]",
    priceUnit: isDark ? "text-parchment/45" : "text-[#2A2520]/45",
  };

  return (
    <section
      id={`course-${course.key}`}
      style={c.sectionStyle}
      className={`px-6 py-20 md:py-28 border-t ${c.borderTop} relative overflow-hidden`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Course title row */}
        <div className="flex items-baseline justify-between gap-6 mb-12 md:mb-16">
          <div className="flex items-baseline gap-6">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
              className={`font-display italic text-5xl md:text-7xl ${c.title}`}
            >
              {course.title}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className={`font-accent text-base md:text-xl italic ${c.titleSub} hidden sm:inline`}
            >
              {course.french}
            </motion.span>
          </div>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
            className={`hidden md:block flex-1 mx-6 max-w-md h-px ${c.rule} origin-right`}
          />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-amber whitespace-nowrap">
            {items.length} pr&eacute;parations
          </span>
        </div>

        {/* Course body — sticky image + list */}
        <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] gap-10 lg:gap-16">
          {/* Sticky image preview */}
          <div className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-28">
              <div className={`relative aspect-[4/5] overflow-hidden rounded-sm ${c.imageHolder}`}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active?.id}
                    src={active?.image}
                    alt={active?.name}
                    loading="lazy"
                    decoding="async"
                    initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                {/* Subtle corner tick */}
                <span className="absolute top-3 left-3 w-4 h-4 border-l border-t border-amber/70" aria-hidden="true" />
                <span className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-amber/70" aria-hidden="true" />
              </div>
              {/* Caption under image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active?.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  className="mt-5 flex items-center justify-between gap-4"
                >
                  <span className={`font-mono text-[10px] tracking-[0.3em] uppercase ${c.captionText} truncate`}>
                    {active?.name}
                  </span>
                  {active?.isChefsRec && (
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-amber whitespace-nowrap">
                      &mdash; Chef&apos;s Pick
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dish list + static vertical prev/next stack on the right */}
          <div className="order-1 lg:order-2 relative">
            {/* Vertical button stack — static, top-right of the dish column */}
            <div className="hidden lg:flex flex-col items-center gap-3 absolute right-0 -mr-2 xl:-mr-6 top-0">
              <motion.button
                type="button"
                onClick={goPrev}
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                aria-label="Previous dish"
                className={`flex items-center justify-center w-10 h-10 rounded-full border ${c.btnRing} hover:border-amber hover:bg-amber/10 ${c.btnText} hover:text-amber transition-colors duration-300 ${c.btnBg} backdrop-blur-sm`}
              >
                <ChevronUp size={18} strokeWidth={1.5} />
              </motion.button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={active?.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className={`font-mono text-[10px] tracking-[0.18em] ${c.btnCount}`}
                >
                  {String(activeIdx + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
              <motion.button
                type="button"
                onClick={goNext}
                whileHover={{ scale: 1.12, y: 2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                aria-label="Next dish"
                className={`flex items-center justify-center w-10 h-10 rounded-full border ${c.btnRing} hover:border-amber hover:bg-amber/10 ${c.btnText} hover:text-amber transition-colors duration-300 ${c.btnBg} backdrop-blur-sm`}
              >
                <ChevronDown size={18} strokeWidth={1.5} />
              </motion.button>
            </div>

            {/* Mobile prev/next row — small screens get a horizontal row above the list */}
            <div className="lg:hidden flex items-center justify-end gap-2 mb-6">
              <span className={`font-mono text-[10px] tracking-[0.2em] ${c.btnCountMobile} mr-2`}>
                {String(activeIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous dish"
                className={`flex items-center justify-center w-9 h-9 rounded-full border ${c.btnRing} hover:border-amber ${c.btnText}`}
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next dish"
                className={`flex items-center justify-center w-9 h-9 rounded-full border ${c.btnRing} hover:border-amber ${c.btnText}`}
              >
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            </div>

            <ul className="space-y-1 lg:pr-16">
            {items.map((item, idx) => {
              const isActive = item.id === activeId;
              return (
                <motion.li
                  key={item.id}
                  id={`dish-${item.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.06, ease: EASE_OUT_EXPO }}
                  onMouseEnter={() => setActiveId(item.id)}
                  onFocus={() => setActiveId(item.id)}
                  className={`group relative py-6 border-b ${c.rowBorder} cursor-default transition-colors duration-500 ${
                    isActive ? c.rowActiveBg : ""
                  }`}
                >
                  {/* Left active marker */}
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{
                      width: isActive ? 24 : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 h-px bg-amber"
                  />

                  <div className="flex items-baseline justify-between gap-6">
                    {/* Index + Name */}
                    <div className="flex items-baseline gap-5 min-w-0">
                      <span
                        className={`font-mono text-[10px] tracking-[0.2em] mt-1 transition-colors duration-500 ${
                          isActive ? "text-amber" : c.rowIdx
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`font-display italic text-2xl md:text-3xl leading-tight transition-all duration-500 ${
                            isActive
                              ? `${c.nameActive} translate-x-2`
                              : c.nameInactive
                          }`}
                        >
                          {item.name}
                          {item.isChefsRec && (
                            <span
                              className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-amber align-middle"
                              aria-label="Chef's pick"
                            />
                          )}
                        </h3>
                        <p
                          className={`font-body text-sm ${c.desc} mt-1.5 leading-relaxed max-w-md transition-opacity duration-500 ${
                            isActive ? "opacity-100" : "opacity-75"
                          }`}
                        >
                          {item.description}
                        </p>
                        {item.winePairing && (
                          <p className={`font-mono text-[10px] tracking-[0.2em] uppercase ${c.wine} mt-3`}>
                            <span className="text-amber/80">~~</span> Paired with {item.winePairing}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right whitespace-nowrap">
                      <p className={`font-display text-xl md:text-2xl ${c.price}`}>
                        {item.price}
                      </p>
                      <p className={`font-mono text-[10px] tracking-[0.25em] uppercase ${c.priceUnit} mt-0.5`}>
                        MAD
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

export default function Menu() {
  const reduce = useReducedMotion();

  const { data: menuData } = trpc.public.menu.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const allItems = useMemo<MenuItem[]>(
    () => (menuData && menuData.length > 0 ? (menuData as MenuItem[]) : DEFAULT_MENU_ITEMS),
    [menuData]
  );

  const byCourse = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    for (const item of allItems) {
      (map[item.category] ??= []).push(item);
    }
    return map;
  }, [allItems]);

  const activeCourses = COURSE_ORDER.filter((c) => (byCourse[c.key]?.length ?? 0) > 0);

  return (
    <div
      className="min-h-screen text-[#2A2520]"
      style={{
        background:
          "linear-gradient(180deg, #FAF1E2 0%, #F5E6D3 40%, #EAD7B9 100%)",
      }}
    >
      {/* ====== HEADER — bound-menu cover, elegant and rare ====== */}
      <section id="menu-top" className="relative min-h-screen md:min-h-0 flex flex-col justify-center pt-32 pb-20 md:pt-36 md:pb-28 px-6 overflow-hidden">
        {/* Fes sunset photo backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("/picts/rooftop/fes-sunset.jpg")` }}
          aria-hidden="true"
        />
        {/* Dark gradient — heavy at top, fades to transparent at bottom */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0E0D0C]/85 via-[#0E0D0C]/35 to-transparent"
          aria-hidden="true"
        />
        {/* Paper grain texture — kept faint over the photo */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Slow gold halo behind the title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: EASE_OUT_EXPO, delay: 0.1 }}
          className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,149,108,0.22) 0%, rgba(200,149,108,0.08) 35%, transparent 65%)",
            filter: "blur(40px)",
          }}
          aria-hidden="true"
        />

        {/* Corner ornaments — fine engraved brackets */}
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute top-28 left-10 w-14 h-14 border-l border-t border-amber/50" />
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute top-28 right-10 w-14 h-14 border-r border-t border-amber/50" />
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute bottom-12 left-10 w-14 h-14 border-l border-b border-amber/50" />
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute bottom-12 right-10 w-14 h-14 border-r border-b border-amber/50" />

        <div className="relative max-w-5xl mx-auto">
          {/* Top edition bar — house mark centered */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="flex items-center justify-center gap-4 font-mono text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-blush/80 mb-10 md:mb-12"
          >
            <span className="h-px w-10 bg-amber/70" />
            <span className="text-blush">La Breva</span>
            <span className="h-px w-10 bg-amber/70" />
          </motion.div>

          {/* Eyebrow — Restaurant & Terrasse */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.42em" }}
            transition={{ duration: 1.2, delay: 0.4, ease: EASE_OUT_EXPO }}
            className="font-mono text-[10px] md:text-[11px] uppercase text-amber text-center mb-2"
          >
            Restaurant &middot; Terrasse
          </motion.p>

          {/* Main title cluster */}
          <div className="text-center relative">
            {/* Decorative flourish above */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.5, ease: EASE_OUT_EXPO }}
              className="flex items-center justify-center gap-3 mb-3 origin-center"
            >
              <span className="h-px w-12 bg-blush/40" />
              <span className="w-1.5 h-1.5 rotate-45 border border-amber" aria-hidden="true" />
              <span className="h-px w-12 bg-blush/40" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 1.5, ease: EASE_OUT_EXPO, delay: 0.6 }}
              className="font-display italic text-[clamp(4rem,15vw,14rem)] leading-[0.9] tracking-tight text-blush"
            >
              Carte
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 1.5, ease: EASE_OUT_EXPO, delay: 0.9 }}
              className="font-display italic text-[clamp(2.5rem,9vw,8.5rem)] leading-[0.9] tracking-tight -mt-2 md:-mt-4 text-gold-shimmer"
            >
              du Soir
            </motion.h2>

            {/* Decorative flourish below */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.1, delay: 1.2, ease: EASE_OUT_EXPO }}
              className="flex items-center justify-center gap-3 mt-6 origin-center"
            >
              <span className="h-px w-20 bg-blush/40" />
              <span className="w-1.5 h-1.5 rotate-45 border border-amber" aria-hidden="true" />
              <span className="h-px w-20 bg-blush/40" />
            </motion.div>
          </div>

          {/* Place-mark — Fes, Morocco · 34°N */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55, duration: 0.9, ease: EASE_OUT_EXPO }}
            className="flex items-center justify-center gap-4 mt-10"
          >
            <span className="h-px w-10 bg-amber/55" />
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-blush/80">
              Fes &middot; Morocco
            </p>
            <span className="h-px w-10 bg-amber/55" />
          </motion.div>

          {/* Course index — The Order */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.9 }}
            className="mt-40 md:mt-48 max-w-3xl mx-auto"
            aria-label="Menu sections"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="h-px w-16 bg-blush/40 md:bg-[#3C2415]/60" />
              <p className="font-mono text-[10px] font-semibold tracking-[0.4em] uppercase text-blush md:text-[#3C2415]">
                The Order
              </p>
              <span className="h-px w-16 bg-blush/40 md:bg-[#3C2415]/60" />
            </div>
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {activeCourses.map((co, i) => (
                <li key={co.key} className="flex items-center gap-4">
                  <a
                    href={`#course-${co.key}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(`course-${co.key}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="group relative inline-flex items-baseline gap-2 font-display font-semibold italic text-xl md:text-2xl text-blush md:text-[#3C2415] hover:text-amber transition-colors duration-500"
                  >
                    <span className="font-mono text-[10px] not-italic tracking-[0.25em] text-amber">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{co.title}</span>
                    <span className="absolute -bottom-0.5 left-6 right-0 h-px bg-amber scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                  </a>
                  {i < activeCourses.length - 1 && (
                    <span className="text-amber/60 select-none" aria-hidden="true">&diams;</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>
      </section>

      {/* Floating prev/next course nav */}
      <CourseFloatingNav courses={activeCourses} />

      {/* ====== COURSES — alternating light/dark rhythm ====== */}
      {activeCourses.map((course, idx) => (
        <CoursePanel
          key={course.key}
          course={course}
          items={byCourse[course.key] || []}
          reduce={reduce}
          theme={idx % 2 === 0 ? "light" : "dark"}
        />
      ))}

      {/* ====== CHEF'S CLOSING NOTE — dark cinematic finish ====== */}
      <section
        id="menu-close"
        className="relative px-6 py-32 md:py-40 border-t border-blush/10 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0E0D0C 0%, #0A0A0A 100%)" }}
      >
        {/* Ambient amber glow */}
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.12)_0%,transparent_70%)] blur-3xl" />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Decorative monogram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, type: "spring", stiffness: 110, damping: 18 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-amber/60 mb-8"
          >
            <span className="font-display italic text-2xl text-amber">L</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
            className="font-accent italic text-2xl md:text-4xl text-blush leading-snug"
          >
            &ldquo;A menu is a letter. Read it slowly, and reply with an empty plate.&rdquo;
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase text-amber mt-8"
          >
            &mdash; Krishna Chaithanya, Head Chef
          </motion.p>

          {/* Subtle separator */}
          <div className="flex items-center justify-center gap-4 mt-16 mb-10">
            <span className="h-px w-16 bg-blush/30" />
            <span className="w-2 h-2 rotate-45 border border-amber" aria-hidden="true" />
            <span className="h-px w-16 bg-blush/30" />
          </div>

          <p className="font-body text-base text-parchment max-w-md mx-auto mb-8">
            Tonight&apos;s offering is best enjoyed at our table, with the call to prayer drifting up from the medina.
          </p>

          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="inline-block"
          >
            <Link
              to="/reservation"
              className="magnetic-btn inline-flex items-center px-10 py-4 bg-amber text-void text-xs font-medium tracking-[0.25em] uppercase rounded-full hover:bg-soft-gold transition-colors duration-500"
            >
              Reserve a Table
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
