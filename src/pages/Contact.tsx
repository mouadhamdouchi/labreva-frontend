import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";
import { trpc } from "@/providers/trpc";
import Reveal from "@/components/Reveal";
import { fadeUp, staggerContainer, viewportOnce, EASE_OUT_EXPO } from "@/lib/motion";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom est obligatoire"),
  email: z.string().email("E-mail valide requis"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Le message doit comporter au moins 10 caractères"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const faqItems = [
  { q: "Acceptez-vous les visites sans réservation ?", a: "Nous acceptons les visites sans réservation, mais nous recommandons vivement de réserver, surtout pour le dîner et les visites en week-end." },
  { q: "Y a-t-il un code vestimentaire ?", a: "Notre code vestimentaire est smart casual. Nous voulons que vous vous sentiez à l'aise tout en préservant l'atmosphère élégante." },
  { q: "Acceptez-vous les restrictions alimentaires ?", a: "Absolument. Nous proposons des options végétariennes, véganes et sans gluten. Merci de nous informer de toute allergie lors de votre réservation." },
  { q: "Puis-je organiser un événement privé ?", a: "Oui, notre salle privée peut accueillir jusqu'à 30 invités. Pour les événements plus importants, la terrasse entière peut être réservée." },
  { q: "Avez-vous un parking ?", a: "Nous proposons un service voiturier pour les clients du dîner. Il existe également un parking public à 200 mètres du restaurant." },
  { q: "La terrasse est-elle ouverte toute l'année ?", a: "Notre terrasse est ouverte de mars à novembre. Pendant les mois d'hiver, nous proposons des places extérieures chauffées." },
  { q: "Puis-je acheter une carte cadeau ?", a: "Oui, des cartes cadeaux sont disponibles en coupures de 500, 1 000 et 2 000 MAD." },
  { q: "Proposez-vous la vente à emporter ou la livraison ?", a: "Nous proposons un menu à emporter sélectionné. La livraison est disponible via certains partenaires premium dans la région de Fès." },
];

export default function Contact() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const createContact = trpc.public.createContact.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      reset();
    },
  });
  const submitError = createContact.error?.message;

  const onSubmit = (data: ContactFormData) => {
    createContact.mutate(data);
  };

  return (
    <div className="bg-void min-h-screen">
      {/* ============== HERO ============== */}
      <section className="relative pt-44 pb-24 md:pt-52 md:pb-32 text-center px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("/picts/events/contact.jpg")`,
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0E0D0C]/70 via-[#0E0D0C]/35 to-[#0E0D0C]/55"
          aria-hidden="true"
        />
        {/* Amber spotlight */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(200,149,108,0.22)_0%,transparent_70%)] blur-3xl animate-drift-slow" />
        {/* Corner brackets */}
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute top-10 left-10 w-12 h-12 border-l border-t border-amber/40" />
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute top-10 right-10 w-12 h-12 border-r border-t border-amber/40" />
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute bottom-10 left-10 w-12 h-12 border-l border-b border-amber/40" />
        <span aria-hidden="true" className="hidden md:block pointer-events-none absolute bottom-10 right-10 w-12 h-12 border-r border-b border-amber/40" />

        <div className="relative max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.5, ease: EASE_OUT_EXPO, delay: 0.3 }}
            className="font-display italic text-[clamp(3rem,12vw,10.5rem)] leading-[0.9] tracking-tight"
            style={{
              color: "#FFFFFF",
              textShadow:
                "0 2px 6px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.55), 0 0 1px rgba(255,255,255,1), 0 0 5px rgba(255,236,200,0.65), 0 0 12px rgba(255,210,140,0.35)",
            }}
          >
            Contactez
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.5, ease: EASE_OUT_EXPO, delay: 0.6 }}
            className="font-display italic text-[clamp(2.25rem,8.5vw,8rem)] leading-[0.9] tracking-tight -mt-1 md:-mt-3"
            style={{
              color: "#D4A574",
              textShadow:
                "0 0 1px rgba(255,247,220,0.95), 0 0 5px rgba(255,232,180,0.8), 0 0 10px rgba(255,210,140,0.55), 0 0 15px rgba(200,149,108,0.4)",
            }}
          >
            -nous
          </motion.h2>
        </div>
      </section>

      {/* ============== QUICK CONTACT STRIP ============== */}
      <section className="bg-obsidian border-y border-charcoal/60 py-8 px-6 relative overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10"
        >
          {[
            { icon: MapPin, label: "Adresse", detail: "La Breva Rooftop · Fès, Maroc", cta: "Itinéraire", href: "https://maps.app.goo.gl/2n3io47fHbzv6d7Q6" },
            { icon: Phone, label: "Téléphone", detail: "+212 535 123 456", cta: "Appeler", href: "tel:+212535123456" },
            { icon: Mail, label: "E-mail", detail: "bonjour@labreva.ma", cta: "Écrire", href: "mailto:bonjour@labreva.ma" },
            { icon: Clock, label: "Horaires", detail: "Tous les jours · 8h – 00h", cta: "Réserver", href: "/reservation" },
          ].map((item, i) => (
            <motion.a
              key={i}
              variants={fadeUp}
              href={item.href}
              className="group flex items-start gap-4 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-amber/40 group-hover:border-amber group-hover:bg-amber/10 transition-colors duration-500 shrink-0">
                <item.icon size={16} className="text-amber" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[12px] tracking-[0.3em] uppercase text-amber/80 mb-1">{item.label}</p>
                <p className="font-body text-[15px] text-blush leading-tight truncate">{item.detail}</p>
                <p className="font-mono text-[12px] tracking-[0.25em] uppercase text-parchment/60 mt-1 group-hover:text-amber transition-colors">
                  {item.cta} &rsaquo;
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* ============== FORM + INFO ============== */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.08)_0%,transparent_70%)] blur-3xl animate-drift-slow" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 relative">
          {/* Left — Form */}
          <div>
            <Reveal>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-amber/50" />
                <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber">Écrivez-nous</p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <h2 className="font-display italic text-4xl md:text-6xl text-blush leading-[1.02] tracking-tight">
                Envoyer un <span className="text-gold-shimmer not-italic font-display italic">message</span>
              </h2>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="font-accent italic text-base md:text-lg text-parchment/75 mt-5 max-w-md leading-relaxed">
                Parlez-nous de votre visite, de votre événement ou de ce qui vous tient à cœur — nous lisons chaque message.
              </p>
            </Reveal>

            <div className="mt-12">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                    className="relative rounded-xl bg-gradient-to-br from-warm-stone/40 to-obsidian/60 border border-amber/30 backdrop-blur-[6px] p-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
                      className="w-16 h-16 rounded-full border-2 border-amber flex items-center justify-center mx-auto mb-5"
                    >
                      <svg className="w-8 h-8 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <motion.polyline
                          points="20 6 9 17 4 12"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                        />
                      </svg>
                    </motion.div>
                    <h3 className="font-display italic text-3xl text-blush mb-2">Message envoyé.</h3>
                    <p className="font-accent italic text-base text-parchment/75">
                      Nous vous répondrons sous peu &mdash; merci.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit(onSubmit)}
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer(0.07, 0.1)}
                    className="space-y-7"
                  >
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                      <motion.div variants={fadeUp}>
                        <label className="font-mono text-[12px] tracking-[0.3em] uppercase text-amber/80 block mb-2">
                          — Votre Nom —
                        </label>
                        <input
                          {...register("name")}
                          type="text"
                          placeholder="ex. Sophie Laurent"
                          className="w-full bg-transparent border-b border-blush/20 text-blush py-3 focus:border-amber focus:outline-none transition-colors placeholder:text-parchment/35"
                        />
                        {errors.name && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-error text-xs mt-1">
                            {errors.name.message}
                          </motion.p>
                        )}
                      </motion.div>
                      <motion.div variants={fadeUp}>
                        <label className="font-mono text-[12px] tracking-[0.3em] uppercase text-amber/80 block mb-2">
                          — E-mail —
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="vous@exemple.com"
                          className="w-full bg-transparent border-b border-blush/20 text-blush py-3 focus:border-amber focus:outline-none transition-colors placeholder:text-parchment/35"
                        />
                        {errors.email && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-error text-xs mt-1">
                            {errors.email.message}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>

                    {/* Phone + Subject row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                      <motion.div variants={fadeUp}>
                        <label className="font-mono text-[12px] tracking-[0.3em] uppercase text-amber/80 block mb-2">
                          — Téléphone (facultatif) —
                        </label>
                        <input
                          {...register("phone")}
                          type="tel"
                          placeholder="+212 ..."
                          className="w-full bg-transparent border-b border-blush/20 text-blush py-3 focus:border-amber focus:outline-none transition-colors placeholder:text-parchment/35"
                        />
                      </motion.div>
                      <motion.div variants={fadeUp}>
                        <label className="font-mono text-[12px] tracking-[0.3em] uppercase text-amber/80 block mb-2">
                          — Sujet —
                        </label>
                        <select
                          {...register("subject")}
                          className="w-full bg-transparent border-b border-blush/20 text-blush py-3 focus:border-amber focus:outline-none transition-colors appearance-none"
                          style={{ backgroundImage: "none" }}
                        >
                          <option value="" className="bg-obsidian">Sélectionner un sujet</option>
                          <option value="general" className="bg-obsidian">Demande Générale</option>
                          <option value="reservation" className="bg-obsidian">Question de Réservation</option>
                          <option value="private" className="bg-obsidian">Événement Privé</option>
                          <option value="feedback" className="bg-obsidian">Commentaires</option>
                          <option value="press" className="bg-obsidian">Presse &amp; Médias</option>
                          <option value="other" className="bg-obsidian">Autre</option>
                        </select>
                      </motion.div>
                    </div>

                    {/* Message */}
                    <motion.div variants={fadeUp}>
                      <label className="font-mono text-[12px] tracking-[0.3em] uppercase text-amber/80 block mb-2">
                        — Votre Message —
                      </label>
                      <textarea
                        {...register("message")}
                        rows={5}
                        placeholder="Écrivez-nous…"
                        className="w-full bg-transparent border-b border-blush/20 text-blush py-3 focus:border-amber focus:outline-none transition-colors resize-none placeholder:text-parchment/35"
                      />
                      {errors.message && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-error text-xs mt-1">
                          {errors.message.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Submit */}
                    <motion.div variants={fadeUp} className="pt-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        type="submit"
                        disabled={createContact.isPending}
                        className="magnetic-btn inline-flex items-center gap-3 px-10 py-4 bg-amber text-void font-medium text-sm tracking-[0.25em] uppercase rounded-full hover:bg-soft-gold transition-colors disabled:opacity-50"
                      >
                        {createContact.isPending ? "Envoi…" : "Envoyer le Message"}
                        <span aria-hidden="true">&rarr;</span>
                      </motion.button>
                      {submitError && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-error text-sm mt-4"
                          role="alert"
                        >
                          {submitError}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right — Info panel */}
          <div className="relative">
            <Reveal>
              <div className="rounded-sm bg-gradient-to-br from-warm-stone/40 to-obsidian/60 border border-charcoal/80 backdrop-blur-[6px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)] overflow-hidden">
                {/* Header strip */}
                <div className="px-8 py-7 border-b border-amber/15">
                  <h3 className="font-display italic text-3xl text-blush leading-tight">
                    Nous <span className="text-gold-shimmer not-italic font-display italic">trouver</span>
                  </h3>
                </div>

                {/* Info rows */}
                <ul className="divide-y divide-charcoal/60">
                  {[
                    { icon: MapPin, label: "Adresse", lines: ["La Breva Rooftop", "Fès — Maroc"] },
                    { icon: Phone, label: "Téléphone", lines: ["+212 535 123 456"] },
                    { icon: Mail, label: "E-mail", lines: ["bonjour@labreva.ma"] },
                    { icon: Clock, label: "Horaires d'Ouverture", lines: ["Tous les jours · 8h — 00h"] },
                  ].map((row, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={viewportOnce}
                      transition={{ delay: 0.15 + i * 0.08, duration: 0.7, ease: EASE_OUT_EXPO }}
                      className="flex items-start gap-4 px-8 py-5 group hover:bg-amber/5 transition-colors duration-500"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-amber/35 group-hover:border-amber transition-colors duration-500 shrink-0">
                        <row.icon size={14} className="text-amber" />
                      </div>
                      <div>
                        <p className="font-mono text-[12px] tracking-[0.3em] uppercase text-parchment/55 mb-1.5">
                          {row.label}
                        </p>
                        {row.lines.map((line, j) => (
                          <p key={j} className="font-body text-base md:text-lg text-blush leading-snug">
                            {line}
                          </p>
                        ))}
                      </div>
                    </motion.li>
                  ))}
                </ul>

                {/* Footer with social */}
                <div className="px-8 py-6 border-t border-amber/15 flex items-center justify-between">
                  <p className="font-mono text-[12px] tracking-[0.3em] uppercase text-parchment/55">Suivez le Voyage</p>
                  <div className="flex items-center gap-4">
                    {[
                      { icon: Instagram, href: "https://www.instagram.com/labrevafes/", label: "Instagram" },
                      { icon: Facebook, href: "https://www.facebook.com/moroccanrestaurantlabrevafes?locale=fr_FR", label: "Facebook" },
                      { icon: MessageCircle, href: "https://wa.me/212535123456", label: "WhatsApp" },
                    ].map((s) => (
                      <motion.a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        whileHover={{ scale: 1.2, rotate: -8 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 16 }}
                        className="text-parchment/70 hover:text-amber transition-colors"
                      >
                        <s.icon size={16} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* WhatsApp quick-message ribbon */}
            <Reveal delay={0.3}>
              <motion.a
                href="https://wa.me/212535123456"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="mt-6 group flex items-center justify-between gap-4 px-6 py-5 rounded-sm bg-[#25D366]/10 border border-[#25D366]/40 hover:border-[#25D366] backdrop-blur-sm transition-colors duration-500"
              >
                <div className="flex items-center gap-4">
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366]/15"
                  >
                    <MessageCircle size={16} className="text-[#25D366]" />
                  </motion.span>
                  <div>
                    <p className="font-mono text-[12px] tracking-[0.3em] uppercase text-[#25D366]/80 mb-1">Préférez discuter ?</p>
                    <p className="font-body text-base text-blush leading-tight">Écrivez-nous sur WhatsApp</p>
                  </div>
                </div>
                <span className="font-mono text-[13px] tracking-[0.2em] uppercase text-blush group-hover:text-[#25D366] transition-colors">
                  Ouvrir &rsaquo;
                </span>
              </motion.a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============== MAP ============== */}
      <section className="relative bg-obsidian">
        <Reveal>
          <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-amber/50" />
              <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber">Nous Rendre Visite</p>
            </div>
            <h2 className="font-display italic text-4xl md:text-6xl text-blush leading-[1.02] tracking-tight">
              Au cœur de <span className="text-gold-shimmer not-italic font-display italic">Fès</span>
            </h2>
            <p className="font-accent italic text-xl md:text-2xl lg:text-3xl text-parchment/85 mt-6 max-w-3xl leading-[1.45]">
              Une terrasse perchée sur la ville — accès aisé en taxi, stationnement devant l&apos;entrée, et la médina à quelques minutes seulement.
            </p>
          </div>
        </Reveal>

        <div className="relative h-[420px] md:h-[520px] overflow-hidden border-y border-charcoal/60">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306!2d-5.0046427!3d34.0353536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f8b3b8f6b73b3%3A0x3fdc9a8320cc8534!2sLa%20Breva%20Rooftop!5e0!3m2!1sfr!2sma!4v1720000000000"
            className="absolute inset-0 w-full h-full"
            style={{ filter: "grayscale(0.6) contrast(0.95) brightness(0.85)" }}
            loading="lazy"
            title="Emplacement de La Breva Rooftop"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* Floating address card on the map */}
          <Reveal delay={0.2}>
            <div className="absolute top-6 right-6 md:top-10 md:right-10 max-w-xs rounded-sm bg-[#0E0D0C]/90 backdrop-blur-md border border-amber/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] p-6">
              <p className="font-mono text-[12px] tracking-[0.3em] uppercase text-amber mb-2">La Breva Rooftop</p>
              <p className="font-display italic text-2xl text-blush leading-tight mb-3">Fès</p>
              <p className="font-body text-base text-parchment/80 mb-4">34°02&apos;07&Prime;N · 5°00&apos;17&Prime;W</p>
              <a
                href="https://maps.app.goo.gl/2n3io47fHbzv6d7Q6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-mono text-[13px] tracking-[0.25em] uppercase text-amber hover:text-soft-gold transition-colors group/dir"
              >
                Ouvrir dans Maps
                <span className="ml-2 transition-transform duration-300 group-hover/dir:translate-x-1">&rsaquo;</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== HOURS — printed schedule ============== */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.08)_0%,transparent_70%)] blur-3xl animate-drift-slow" />

        <div className="max-w-6xl mx-auto relative">
          <Reveal>
            <div className="text-center mb-16 md:mb-20">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="h-px w-12 bg-amber/50" />
                <p className="font-mono text-[12px] tracking-[0.45em] uppercase text-amber">Heures de Visite</p>
                <span className="h-px w-12 bg-amber/50" />
              </div>
              <h2 className="font-display italic text-5xl md:text-7xl text-blush leading-[1.02] tracking-tight">
                Quand nous sommes <span className="text-gold-shimmer not-italic font-display italic">ouverts</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {/* Schedule */}
            <Reveal variant="right" delay={0.1}>
              <div className="rounded-sm bg-gradient-to-br from-warm-stone/40 to-obsidian/60 border border-charcoal/80 backdrop-blur-[6px] p-8 md:p-10">
                <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber mb-6">— Horaires —</p>
                {[
                  { days: "Lun — Ven", hours: "8h – 00h" },
                  { days: "Sam", hours: "9h – 1h" },
                  { days: "Dim", hours: "9h – 23h" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: EASE_OUT_EXPO }}
                    className="flex items-baseline justify-between py-5 border-b border-charcoal/60 last:border-0"
                  >
                    <span className="font-display italic text-xl md:text-2xl text-blush">{s.days}</span>
                    <span className="font-mono text-base tracking-[0.15em] text-amber">{s.hours}</span>
                  </motion.div>
                ))}
                <p className="font-mono text-[12px] tracking-[0.25em] uppercase text-parchment/45 mt-6">
                  &mdash; Les horaires des jours fériés peuvent varier
                </p>
              </div>
            </Reveal>

            {/* Best times to visit */}
            <Reveal variant="left" delay={0.2}>
              <div className="rounded-sm bg-gradient-to-br from-warm-stone/40 to-obsidian/60 border border-charcoal/80 backdrop-blur-[6px] p-8 md:p-10">
                <p className="font-mono text-[12px] tracking-[0.4em] uppercase text-amber mb-6">— Meilleurs Moments pour Venir —</p>
                {[
                  { roman: "i.", time: "Déjeuner", window: "12:00 — 14:30", note: "Plus calme — parfait pour le travail" },
                  { roman: "ii.", time: "Coucher du soleil", window: "18:00 — 20:00", note: "La terrasse est magique" },
                  { roman: "iii.", time: "Dîner", window: "20:00 — 22:30", note: "L'expérience complète" },
                  { roman: "iv.", time: "Fin de soirée", window: "22:30 — 00:00", note: "Cocktails & atmosphère" },
                ].map((slot, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.25 + i * 0.08, duration: 0.7, ease: EASE_OUT_EXPO }}
                    className="flex items-baseline gap-4 py-4 border-b border-charcoal/60 last:border-0"
                  >
                    <span className="font-display italic text-2xl text-gold-shimmer w-8 shrink-0">{slot.roman}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-display italic text-lg md:text-xl text-blush">{slot.time}</p>
                        <p className="font-mono text-sm tracking-[0.18em] text-amber">{slot.window}</p>
                      </div>
                      <p className="font-body text-[15px] text-parchment/70 mt-1">{slot.note}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section className="py-24 md:py-32 bg-obsidian px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,230,211,0.05)_0%,transparent_70%)] blur-3xl animate-drift-slow" />

        <div className="max-w-3xl mx-auto relative">
          <Reveal>
            <div className="text-center mb-16 md:mb-20">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="h-px w-10 bg-amber/50" />
                <p className="font-mono text-[12px] tracking-[0.45em] uppercase text-amber">FAQ</p>
                <span className="h-px w-10 bg-amber/50" />
              </div>
              <h2 className="font-display italic text-5xl md:text-7xl text-blush leading-[1.02] tracking-tight">
                Questions <span className="text-gold-shimmer not-italic font-display italic">fréquentes</span>
              </h2>
            </div>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.05)}
            className="space-y-0"
          >
            {faqItems.map((faq, i) => {
              const open = faqOpen === i;
              return (
                <motion.div key={i} variants={fadeUp} className="border-b border-charcoal">
                  <button
                    onClick={() => setFaqOpen(open ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                  >
                    <div className="flex items-baseline gap-5 min-w-0">
                      <span className={`font-mono text-[13px] tracking-[0.3em] transition-colors duration-500 ${open ? "text-amber" : "text-amber/40"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`font-display italic text-xl md:text-2xl leading-tight transition-colors duration-500 ${open ? "text-amber" : "text-blush group-hover:text-amber"}`}>
                        {faq.q}
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: open ? 45 : 0 }}
                      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                      className={`text-2xl flex-shrink-0 transition-colors duration-500 ${open ? "text-amber" : "text-amber/60"}`}
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                        className="overflow-hidden"
                      >
                        <div className="pl-10 pr-10 pb-6">
                          <p className="font-body text-base md:text-lg text-parchment/85 leading-relaxed">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============== CLOSING ============== */}
      <section className="py-24 md:py-32 px-6 text-center relative overflow-hidden">
        <Reveal>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-16 bg-amber/35" />
            <span className="w-2 h-2 rotate-45 border border-amber" aria-hidden="true" />
            <span className="h-px w-16 bg-amber/35" />
          </div>
          <p className="font-accent italic text-2xl md:text-3xl text-blush max-w-2xl mx-auto leading-relaxed">
            &ldquo;Une table est toujours dressée pour vous à La Breva.&rdquo;
          </p>
          <p className="font-mono text-[12px] tracking-[0.3em] uppercase text-amber mt-6">
            &mdash; À très bientôt, Fès
          </p>
        </Reveal>
      </section>
    </div>
  );
}
