import { startTransition, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { imageSrc, imageSrcSet, preloadImages } from "@/lib/images";
import { gridItem, staggerContainer, EASE_OUT_EXPO } from "@/lib/motion";

const categories = ["all", "food", "drinks", "ambiance", "events"];

const DEFAULT_GALLERY = [
  { id: 1, image: "/picts/rooftop/rooftop.jpg", category: "ambiance", title: "Terrace at Night" },
  { id: 2, image: "/picts/menu/orange-juice.jpg", category: "drinks", title: "Fresh Juices" },
  { id: 3, image: "/picts/inside/interior.jpg", category: "ambiance", title: "Interior Dining" },
  { id: 4, image: "/picts/team/chef.jpg", category: "food", title: "Chef at Work" },
  { id: 5, image: "/picts/inside/zellige.jpg", category: "ambiance", title: "Zellige Tilework" },
  { id: 6, image: "/picts/menu/breakfast.jpg", category: "food", title: "Breakfast Spread" },
  { id: 7, image: "/picts/events/cooking-class.jpg", category: "events", title: "Cooking Class" },
  { id: 8, image: "/picts/inside/lanterns.jpg", category: "ambiance", title: "Brass Lantern" },
  { id: 9, image: "/picts/menu/mint-tea.jpg", category: "drinks", title: "Tea Ceremony" },
  { id: 10, image: "/picts/menu/sea-bass.jpg", category: "food", title: "Sea Bass" },
  { id: 11, image: "/picts/menu/lamb-tagine.jpg", category: "food", title: "Rfissa" },
  { id: 12, image: "/picts/menu/burrata-salad.jpg", category: "food", title: "Burrata Salad" },
  { id: 13, image: "/picts/menu/grilled-octopus.jpg", category: "food", title: "Grilled Octopus" },
  { id: 14, image: "/picts/menu/chocolate-fondant.jpg", category: "food", title: "Chocolate Fondant" },
  { id: 15, image: "/picts/menu/salmon.jpg", category: "food", title: "Citrus Salmon" },
  { id: 16, image: "/picts/menu/pastilla.jpg", category: "food", title: "Moroccan Pastilla" },
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

        {/* Title content — glassy frosted card */}
        <div className="relative inline-flex flex-col items-center px-8 py-10 md:px-16 md:py-14 rounded-sm bg-[#F5E6D3]/25 backdrop-blur-[6px] border border-[#3C2415]/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE_OUT_EXPO }}
            className="absolute top-4 left-4 md:top-6 md:left-6 w-8 h-8 md:w-10 md:h-10 origin-top-left pointer-events-none"
            aria-hidden="true"
          >
            <span className="absolute top-0 left-0 h-px w-full bg-[#3C2415]/70" />
            <span className="absolute top-0 left-0 w-px h-full bg-[#3C2415]/70" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.05em" }}
            animate={{ opacity: 1, letterSpacing: "0.32em" }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="font-mono font-bold text-[13px] md:text-[15px] uppercase text-[#3C2415] mb-5 mt-6"
          >
            Visual Journey
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: EASE_OUT_EXPO }}
            className="font-display font-semibold italic text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#3C2415] tracking-tight leading-[1.02]"
          >
            The <span className="text-gold-shimmer not-italic font-display font-semibold italic">Gallery</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.9 }}
            className="font-accent font-bold italic text-xl md:text-2xl lg:text-3xl text-[#3C2415] mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Moments captured in <span className="text-[#C8956C]">golden light</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.95, ease: EASE_OUT_EXPO }}
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-8 h-8 md:w-10 md:h-10 origin-bottom-right pointer-events-none"
            aria-hidden="true"
          >
            <span className="absolute bottom-0 right-0 h-px w-full bg-[#3C2415]/70" />
            <span className="absolute bottom-0 right-0 w-px h-full bg-[#3C2415]/70" />
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
                <span className="relative">{cat}</span>
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
                      alt={img.title || "Gallery"}
                      decoding="async"
                      className="block w-full h-auto object-cover"
                      loading={i < 8 ? "eager" : "lazy"}
                      fetchPriority={i < 4 ? "high" : "auto"}
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
                    />
                    {/* Permanent index marker */}
                    <span className="absolute top-3 left-3 z-10 font-mono text-[9px] tracking-[0.3em] text-blush/85 px-2 py-1 rounded-sm bg-void/40 backdrop-blur-sm transition-colors duration-500 group-hover:bg-amber group-hover:text-void">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Hover overlay with category + title */}
                    <motion.div
                      initial={false}
                      className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-start justify-end p-5"
                    >
                      <span className="section-label text-xs text-amber mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                        {img.category?.toUpperCase()}
                      </span>
                      <span className="font-display italic text-lg md:text-xl text-blush translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75 leading-tight">
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
              aria-label="Close"
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
              aria-label="Previous"
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
              aria-label="Next"
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

            {/* Info */}
            <motion.div
              key={`info-${currentImage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="font-mono text-xs text-muted-taupe mb-1">
                {currentImage + 1} / {images.length}
              </p>
              <p className="font-body text-sm text-blush">{images[currentImage].title}</p>
              <p className="section-label text-xs text-amber mt-1">{images[currentImage].category?.toUpperCase()}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
