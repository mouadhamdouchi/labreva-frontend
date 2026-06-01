import { startTransition, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { imageSrc, imageSrcSet, preloadImages } from "@/lib/images";
import { gridItem, staggerContainer, EASE_OUT_EXPO } from "@/lib/motion";

const categories = ["all", "food", "drinks", "ambiance", "events"];

const categoryLabels: Record<string, string> = {
  all: "tout",
  food: "cuisine",
  drinks: "boissons",
  ambiance: "ambiance",
  events: "événements",
};

const DEFAULT_GALLERY = [
  { id: 1, image: "/picts/rooftop/rooftop.jpg", category: "ambiance", title: "Terrasse de Nuit" },
  { id: 2, image: "/picts/menu/orange-juice.jpg", category: "drinks", title: "Jus Frais" },
  { id: 3, image: "/picts/inside/interior.jpg", category: "ambiance", title: "Salle Intérieure" },
  { id: 4, image: "/picts/team/chef.jpg", category: "food", title: "Chef au Travail" },
  { id: 5, image: "/picts/inside/zellige.jpg", category: "ambiance", title: "Zellige Marocain" },
  { id: 6, image: "/picts/menu/breakfast.jpg", category: "food", title: "Petit Déjeuner" },
  { id: 7, image: "/picts/events/cooking-class.jpg", category: "events", title: "Cours de Cuisine" },
  { id: 8, image: "/picts/inside/lanterns.jpg", category: "ambiance", title: "Lanterne en Laiton" },
  { id: 9, image: "/picts/menu/mint-tea.jpg", category: "drinks", title: "Cérémonie du Thé" },
  { id: 10, image: "/picts/menu/sea-bass.jpg", category: "food", title: "Bar de Mer" },
  { id: 11, image: "/picts/menu/lamb-tagine.jpg", category: "food", title: "Rfissa" },
  { id: 12, image: "/picts/menu/burrata-salad.jpg", category: "food", title: "Salade de Burrata" },
  { id: 13, image: "/picts/menu/grilled-octopus.jpg", category: "food", title: "Poulpe Grillé" },
  { id: 14, image: "/picts/menu/chocolate-fondant.jpg", category: "food", title: "Fondant au Chocolat" },
  { id: 15, image: "/picts/menu/salmon.jpg", category: "food", title: "Saumon aux Agrumes" },
  { id: 16, image: "/picts/menu/pastilla.jpg", category: "food", title: "Pastilla Marocaine" },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();

  const { data: galleryData } = trpc.public.gallery.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const images = useMemo(() => {
    const source = galleryData && galleryData.length > 0 ? galleryData : DEFAULT_GALLERY;
    if (activeCategory === "all") return source;
    return source.filter(img => img.category === activeCategory);
  }, [galleryData, activeCategory]);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const navigateLightbox = (dir: number) => {
    setDirection(dir);
    setCurrentImage((prev) => {
      const next = prev + dir;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  useEffect(() => {
    const source = galleryData && galleryData.length > 0 ? galleryData : DEFAULT_GALLERY;
    preloadImages(source.map((img) => img.image), 800);
  }, [galleryData]);

  useEffect(() => {
    preloadImages(images.slice(0, 8).map((img) => img.image), 480);
  }, [images]);

  useEffect(() => {
    if (!lightboxOpen || images.length === 0) return;
    const next = images[(currentImage + 1) % images.length];
    const prev = images[(currentImage - 1 + images.length) % images.length];
    preloadImages([next?.image, prev?.image], 1200);
  }, [currentImage, images, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      } else if (e.key === "ArrowRight" && images.length > 0) {
        setDirection(1);
        setCurrentImage((prev) => (prev + 1) % images.length);
      } else if (e.key === "ArrowLeft" && images.length > 0) {
        setDirection(-1);
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen, images.length]);

  return (
    <div className="bg-void min-h-screen">
      {/* Header — gallery.jpg as cinematic backdrop with dark-fade gradient (matches the other heroes) */}
      <section className="relative pt-28 pb-32 md:pt-32 md:pb-40 text-center px-6 overflow-hidden">
        {/* Photo backdrop — no dark filter, photo shows through */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("/picts/inside/gallery.jpg")` }}
          aria-hidden="true"
        />

        {/* Top fade — darkens the strip behind the navbar for legibility */}
        <div
          className="absolute inset-x-0 top-0 h-40 md:h-48 bg-gradient-to-b from-black/65 via-black/30 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Title content — opaque parchment card */}
        <div className="relative inline-flex flex-col items-center px-10 py-12 md:px-20 md:py-16 rounded-sm bg-[#F5E6D3]/95 backdrop-blur-xl border border-[#3C2415]/15 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)]">
          {/* Inner hairline frame — letterpress refinement */}
          <div
            className="absolute inset-2 md:inset-3 border border-[#3C2415]/15 rounded-[2px] pointer-events-none"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE_OUT_EXPO }}
            className="absolute top-4 left-4 md:top-6 md:left-6 w-9 h-9 md:w-11 md:h-11 origin-top-left pointer-events-none"
            aria-hidden="true"
          >
            <span className="absolute top-0 left-0 h-px w-full bg-[#3C2415]/80" />
            <span className="absolute top-0 left-0 w-px h-full bg-[#3C2415]/80" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="flex items-center gap-3 mb-5 mt-2"
            aria-hidden="true"
          >
            <span className="h-px w-8 md:w-12 bg-[#3C2415]/50" />
            <span className="block w-[5px] h-[5px] rounded-full bg-[#C8956C]" />
            <span className="h-px w-8 md:w-12 bg-[#3C2415]/50" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.05em" }}
            animate={{ opacity: 1, letterSpacing: "0.42em" }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="font-mono font-semibold text-[12px] md:text-[14px] uppercase text-[#3C2415] mb-6 pl-[0.42em]"
          >
            Voyage Visuel
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: EASE_OUT_EXPO }}
            className="font-display italic text-[clamp(3.25rem,12vw,8.5rem)] lg:text-9xl text-[#3C2415] tracking-tight leading-[0.95]"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}
          >
            La <span className="not-italic font-display italic text-[#6B3410]">Galerie</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: EASE_OUT_EXPO }}
            className="flex items-center gap-2 mt-7 mb-4"
            aria-hidden="true"
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#3C2415]/40" />
            <span className="text-[#C8956C] text-xs tracking-[0.3em]">&#10086;</span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#3C2415]/40" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.9 }}
            className="font-accent font-semibold italic text-lg md:text-xl lg:text-2xl text-[#3C2415] max-w-2xl mx-auto leading-snug tracking-wide"
          >
            Moments capturés dans une <span className="text-[#A6743F] font-bold">lumière dorée</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.95, ease: EASE_OUT_EXPO }}
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-9 h-9 md:w-11 md:h-11 origin-bottom-right pointer-events-none"
            aria-hidden="true"
          >
            <span className="absolute bottom-0 right-0 h-px w-full bg-[#3C2415]/80" />
            <span className="absolute bottom-0 right-0 w-px h-full bg-[#3C2415]/80" />
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <div className="sticky top-16 z-30 glass-nav border-b border-charcoal">
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
                    layoutId={reduce ? undefined : "gallery-pill"}
                    className="absolute inset-0 bg-amber rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {!active && (
                  <span className="absolute inset-0 border border-charcoal rounded-full transition-colors duration-200 hover:border-amber/50" />
                )}
                <span className="relative">{categoryLabels[cat] ?? cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editorial masonry — images flow at their natural aspect ratios for an elegant gallery feel */}
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              variants={staggerContainer(0.04)}
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]"
            >
              {images.map((img, i) => (
                <motion.button
                  type="button"
                  key={img.id}
                  variants={gridItem}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  className="group cursor-pointer overflow-hidden rounded-lg bg-charcoal/20 text-left block w-full mb-4 break-inside-avoid transform-gpu shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.75)] transition-shadow duration-500 [content-visibility:auto] [contain-intrinsic-size:320px]"
                  onClick={() => openLightbox(i)}
                >
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={imageSrc(img.image || "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80", 800)}
                      srcSet={imageSrcSet(img.image)}
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      alt={img.title || "Galerie"}
                      decoding="async"
                      className="block w-full h-auto object-cover"
                      loading={i < 8 ? "eager" : "lazy"}
                      fetchPriority={i < 4 ? "high" : "auto"}
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
                    />
                    {/* Permanent index marker — amber pill (matches hovered state) */}
                    <span className="absolute top-3 left-3 z-10 font-mono font-bold text-[10px] tracking-[0.3em] text-void px-2 py-1 rounded-sm bg-amber shadow-[0_4px_12px_-4px_rgba(0,0,0,0.5)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Hover overlay — floating glassy black pill, soft & legible on every photo */}
                    <motion.div
                      initial={false}
                      className="absolute left-3 right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-start px-4 py-3 bg-black/65 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)]"
                    >
                      <span className="section-label font-bold text-[10px] text-amber mb-1 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                        {(categoryLabels[img.category] ?? img.category)?.toUpperCase()}
                      </span>
                      <span className="font-display italic font-semibold text-base md:text-lg text-blush translate-y-1 group-hover:translate-y-0 transition-transform duration-500 delay-75 leading-tight">
                        {img.title}
                      </span>
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && images[currentImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-void/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.12, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full glass-card flex items-center justify-center text-parchment hover:text-amber z-10"
              aria-label="Fermer"
            >
              <X size={20} />
            </motion.button>

            {/* Navigation */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
              className="absolute left-4 md:left-8 w-10 h-10 rounded-full glass-card flex items-center justify-center text-parchment hover:text-amber z-10"
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
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
              className="absolute right-4 md:right-8 w-10 h-10 rounded-full glass-card flex items-center justify-center text-parchment hover:text-amber z-10"
              aria-label="Suivant"
            >
              <ChevronRight size={20} />
            </motion.button>

            {/* Image with slide transition */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                initial={{ opacity: 0, x: 60 * direction, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60 * direction, scale: 0.96 }}
                transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                src={imageSrc(images[currentImage].image, 1200)}
                srcSet={imageSrcSet(images[currentImage].image)}
                sizes="90vw"
                alt={images[currentImage].title || ""}
                decoding="async"
                className="max-w-[90vw] max-h-[85vh] object-contain rounded shadow-elevated"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Info — glassy black pill, floating above the bottom edge */}
            <motion.div
              key={`info-${currentImage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 inset-x-0 mx-auto w-fit text-center px-7 py-4 bg-black/65 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)]"
            >
              <p className="font-mono font-semibold text-sm md:text-base text-parchment mb-2 tracking-[0.2em]">
                {currentImage + 1} / {images.length}
              </p>
              <p className="font-display italic font-semibold text-2xl md:text-3xl text-blush">{images[currentImage].title}</p>
              <p className="section-label font-bold text-sm md:text-base text-amber mt-2 tracking-[0.32em]">{(categoryLabels[images[currentImage].category] ?? images[currentImage].category)?.toUpperCase()}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
