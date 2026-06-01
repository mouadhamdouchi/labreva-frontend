import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Check, Copy, Calendar, ChevronLeft } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { EASE_OUT_EXPO } from "@/lib/motion";

const step1Schema = z.object({
  date: z.string().min(1, "Choisir une date"),
  time: z.string().min(1, "Choisir une heure"),
  guests: z.number().min(1).max(20),
  seating: z.enum(["indoor", "terrace"]).optional(),
});

const step2Schema = z.object({
  guestName: z.string().min(2, "Le nom est obligatoire"),
  guestEmail: z.string().email("E-mail valide requis"),
  guestPhone: z.string().min(8, "Numéro de téléphone valide requis"),
  occasion: z.string().optional(),
  requests: z.string().max(500).optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

function ReservationHeader() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section ref={ref} className="relative pt-44 pb-24 md:pt-52 md:pb-32 bg-void text-center px-6 overflow-hidden">
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -top-10 -bottom-10 bg-cover bg-center"
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url("/picts/events/reservation.jpg")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E0D0C]/85 via-[#0E0D0C]/35 to-transparent" />
      </motion.div>
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.15)_0%,transparent_70%)] blur-3xl animate-drift-slow" />
      <motion.div style={{ y: titleY, opacity }} className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.5, ease: EASE_OUT_EXPO, delay: 0.3 }}
          className="font-display italic text-[clamp(3.5rem,11vw,11rem)] leading-[0.9] tracking-tight text-blush"
          style={{
            textShadow:
              "0 0 24px rgba(245,230,211,0.35), 0 4px 14px rgba(0,0,0,0.5)",
          }}
        >
          Réservez Votre
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.5, ease: EASE_OUT_EXPO, delay: 0.6 }}
          className="font-display italic text-[clamp(2.5rem,8vw,7.5rem)] leading-[0.9] tracking-tight -mt-2 md:-mt-3"
          style={{
            color: "#F7F4F0",
            textShadow:
              "0 0 22px rgba(247,244,240,0.5), 0 4px 14px rgba(0,0,0,0.5)",
          }}
        >
          Table
        </motion.h2>
      </motion.div>
    </section>
  );
}

export default function Reservation() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data>>({ guests: 2 });
  const [bookingId, setBookingId] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { data: availability } = trpc.public.availability.useQuery(
    { date: formData.date || "2025-02-14" },
    { enabled: !!formData.date }
  );

  const createReservation = trpc.public.createReservation.useMutation({
    onSuccess: (data) => {
      setBookingId(data.bookingId);
      setStep(4);
    },
  });
  const reservationError = createReservation.error?.message;

  const timeSlots = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
  ];

  const next7Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { guests: 2 },
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
  });

  const onStep1Submit = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const onStep2Submit = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const onConfirm = () => {
    if (!termsAccepted) return;
    createReservation.mutate({
      guestName: formData.guestName!,
      guestEmail: formData.guestEmail!,
      guestPhone: formData.guestPhone!,
      date: formData.date!,
      time: formData.time!,
      guests: formData.guests!,
      seating: formData.seating,
      occasion: formData.occasion || undefined,
      requests: formData.requests || undefined,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", { weekday: "long", month: "long", day: "numeric" });
  };

  return (
    <div className="bg-void min-h-screen">
      {/* Header */}
      <ReservationHeader />


      {/* Form */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                      step >= s
                        ? step > s
                          ? "bg-success text-void"
                          : "bg-amber text-void"
                        : "border border-muted-taupe text-muted-taupe"
                    }`}
                  >
                    {step > s ? <Check size={14} /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-16 h-px transition-all ${step > s ? "bg-amber" : "bg-charcoal"}`} />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: Date & Time */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-2xl text-blush mb-6">Date & Heure</h2>

                  <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <label className="section-label text-muted-taupe mb-3 block">CHOISIR UNE DATE</label>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {next7Days.map((date) => {
                          const dateStr = date.toISOString().split("T")[0];
                          const isSelected = formData.date === dateStr;
                          const dayName = date.toLocaleDateString("fr-FR", { weekday: "short" });
                          const dayNum = date.getDate();
                          return (
                            <motion.button
                              key={dateStr}
                              type="button"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.94 }}
                              transition={{ type: "spring", stiffness: 400, damping: 22 }}
                              onClick={() => {
                                step1Form.setValue("date", dateStr);
                                setFormData((prev) => ({ ...prev, date: dateStr }));
                              }}
                              className={`flex flex-col items-center min-w-[60px] p-3 rounded-lg transition-colors duration-300 ${
                                isSelected
                                  ? "bg-amber text-void shadow-[0_0_25px_rgba(200,149,108,0.4)] scale-105"
                                  : "border border-charcoal text-parchment hover:border-amber/50"
                              }`}
                            >
                              <span className="text-xs">{dayName}</span>
                              <span className="text-xl font-display">{dayNum}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                      {step1Form.formState.errors.date && (
                        <p className="text-error text-xs mt-1">{step1Form.formState.errors.date.message}</p>
                      )}
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="section-label text-muted-taupe mb-3 block">CHOISIR UNE HEURE</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map((time) => {
                          const slotData = availability?.find((s) => s.time === time);
                          const isAvailable = !slotData || slotData.available;
                          const isSelected = step1Form.watch("time") === time;
                          return (
                            <motion.button
                              key={time}
                              type="button"
                              disabled={!isAvailable}
                              whileHover={isAvailable ? { scale: 1.05 } : {}}
                              whileTap={isAvailable ? { scale: 0.95 } : {}}
                              transition={{ type: "spring", stiffness: 400, damping: 22 }}
                              onClick={() => step1Form.setValue("time", time)}
                              className={`py-3 rounded-full text-sm transition-colors duration-300 ${
                                isSelected
                                  ? "bg-amber text-void glow-subtle shadow-[0_0_25px_rgba(200,149,108,0.4)]"
                                  : isAvailable
                                  ? "border border-charcoal text-parchment hover:border-amber"
                                  : "border border-charcoal/40 text-muted-taupe/40 cursor-not-allowed"
                              }`}
                            >
                              {time}
                            </motion.button>
                          );
                        })}
                      </div>
                      {step1Form.formState.errors.time && (
                        <p className="text-error text-xs mt-1">{step1Form.formState.errors.time.message}</p>
                      )}
                    </div>

                    {/* Guest Counter */}
                    <div>
                      <label className="section-label text-muted-taupe mb-3 block">NOMBRE DE CONVIVES</label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => step1Form.setValue("guests", Math.max(1, (step1Form.watch("guests") || 2) - 1))}
                          className="w-10 h-10 rounded-full border border-charcoal text-parchment hover:border-amber flex items-center justify-center disabled:opacity-30"
                          disabled={(step1Form.watch("guests") || 2) <= 1}
                        >
                          -
                        </button>
                        <span className="font-mono text-2xl text-blush min-w-[40px] text-center">
                          {step1Form.watch("guests") || 2}
                        </span>
                        <button
                          type="button"
                          onClick={() => step1Form.setValue("guests", Math.min(20, (step1Form.watch("guests") || 2) + 1))}
                          className="w-10 h-10 rounded-full border border-charcoal text-parchment hover:border-amber flex items-center justify-center disabled:opacity-30"
                          disabled={(step1Form.watch("guests") || 2) >= 20}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Seating */}
                    <div>
                      <label className="section-label text-muted-taupe mb-3 block">PRÉFÉRENCE DE PLACE</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: "indoor", label: "Intérieur" },
                          { value: "terrace", label: "Terrasse" },
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            onClick={() => step1Form.setValue("seating", option.value as "indoor" | "terrace")}
                            className={`p-4 rounded-lg border transition-colors duration-300 ${
                              step1Form.watch("seating") === option.value
                                ? "border-amber bg-amber/5 glow-subtle shadow-[0_0_25px_rgba(200,149,108,0.3)]"
                                : "border-charcoal text-parchment hover:border-amber/50"
                            }`}
                          >
                            {option.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className="magnetic-btn w-full py-4 bg-amber text-void font-medium rounded-full hover:bg-soft-gold transition-colors"
                    >
                      Continuer
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => setStep(1)}
                      className="text-parchment hover:text-amber transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h2 className="font-display text-2xl text-blush">Vos Coordonnées</h2>
                  </div>

                  <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-5">
                    {[
                      { name: "guestName" as const, label: "Nom Complet", type: "text", placeholder: "Votre nom complet" },
                      { name: "guestEmail" as const, label: "E-mail", type: "email", placeholder: "votre@email.com" },
                      { name: "guestPhone" as const, label: "Téléphone", type: "tel", placeholder: "+212 535 123 456" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="section-label text-muted-taupe mb-2 block">{field.label.toUpperCase()}</label>
                        <input
                          {...step2Form.register(field.name)}
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full bg-transparent border-b border-charcoal text-blush py-3 px-0 focus:border-amber focus:outline-none transition-colors placeholder:text-muted-taupe/50"
                        />
                        {step2Form.formState.errors[field.name] && (
                          <p className="text-error text-xs mt-1">{step2Form.formState.errors[field.name]?.message}</p>
                        )}
                      </div>
                    ))}

                    <div>
                      <label className="section-label text-muted-taupe mb-2 block">OCCASION (FACULTATIF)</label>
                      <select
                        {...step2Form.register("occasion")}
                        className="w-full bg-transparent border-b border-charcoal text-blush py-3 px-0 focus:border-amber focus:outline-none transition-colors"
                      >
                        <option value="" className="bg-void">Choisir une occasion</option>
                        <option value="birthday" className="bg-void">Anniversaire</option>
                        <option value="anniversary" className="bg-void">Anniversaire de Mariage</option>
                        <option value="date-night" className="bg-void">Soirée Romantique</option>
                        <option value="business" className="bg-void">Dîner d&apos;Affaires</option>
                        <option value="other" className="bg-void">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="section-label text-muted-taupe mb-2 block">DEMANDES SPÉCIALES</label>
                      <textarea
                        {...step2Form.register("requests")}
                        rows={4}
                        placeholder="Régime alimentaire, demandes spéciales..."
                        className="w-full bg-transparent border-b border-charcoal text-blush py-3 px-0 focus:border-amber focus:outline-none transition-colors resize-none placeholder:text-muted-taupe/50"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 border border-charcoal text-parchment rounded-full hover:border-amber transition-all"
                      >
                        Retour
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-amber text-void font-medium rounded-full hover:bg-soft-gold transition-all hover:scale-[1.02]"
                      >
                        Vérifier
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: Confirm */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => setStep(2)}
                      className="text-parchment hover:text-amber transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h2 className="font-display text-2xl text-blush">Confirmer la Réservation</h2>
                  </div>

                  <div className="glass-card p-6 mb-6">
                    <h3 className="font-display text-lg text-blush mb-4">Votre Réservation</h3>
                    <div className="border-t border-charcoal pt-4 grid grid-cols-2 gap-4">
                      {[
                        { label: "Date", value: formatDate(formData.date!) },
                        { label: "Heure", value: formData.time },
                        { label: "Invités", value: formData.guests === 1 ? "Pour 1 personne" : `Pour ${formData.guests} personnes` },
                        { label: "Place", value: formData.seating === "indoor" ? "Intérieur" : formData.seating === "terrace" ? "Terrasse" : "Non spécifié" },
                        { label: "Nom", value: formData.guestName },
                        { label: "E-mail", value: formData.guestEmail },
                        { label: "Téléphone", value: formData.guestPhone },
                        { label: "Occasion", value: formData.occasion ? ({ birthday: "Anniversaire", anniversary: "Anniversaire de Mariage", "date-night": "Soirée Romantique", business: "Dîner d'Affaires", other: "Autre" } as Record<string, string>)[formData.occasion] || formData.occasion : "—" },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="font-body text-xs text-muted-taupe">{item.label}</p>
                          <p className="font-body text-sm text-blush">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-start gap-3 mb-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-charcoal bg-transparent text-amber focus:ring-amber"
                    />
                    <span className="font-body text-sm text-parchment">
                      J&apos;accepte la politique d&apos;annulation. Les annulations doivent être effectuées au moins 24 heures à l&apos;avance.
                    </span>
                  </label>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 border border-charcoal text-parchment rounded-full hover:border-amber transition-all"
                    >
                      Modifier les Coordonnées
                    </button>
                    <button
                      onClick={onConfirm}
                      disabled={!termsAccepted || createReservation.isPending}
                      className="flex-1 py-4 bg-amber text-void font-medium rounded-full hover:bg-soft-gold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createReservation.isPending ? "Confirmation en cours..." : "Confirmer la Réservation"}
                    </button>
                  </div>
                  {reservationError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-error text-sm mt-4 text-center"
                      role="alert"
                    >
                      {reservationError}
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* STEP 4: Success */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8 relative"
                >
                  {/* Radiating success rings */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none">
                    {[0, 1, 2].map((ring) => (
                      <motion.div
                        key={ring}
                        initial={{ scale: 0.5, opacity: 0.7 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{
                          delay: 0.3 + ring * 0.3,
                          duration: 1.6,
                          ease: "easeOut",
                          repeat: 1,
                        }}
                        className="absolute inset-0 rounded-full border-2 border-success/60"
                      />
                    ))}
                  </div>

                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 14 }}
                    className="w-20 h-20 rounded-full border-2 border-success flex items-center justify-center mx-auto mb-6 relative bg-success/5"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 350, damping: 16 }}
                    >
                      <Check className="text-success" size={36} />
                    </motion.span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="font-display text-3xl text-success mb-3"
                  >
                    Réservation Confirmée !
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="font-body text-parchment mb-4"
                  >
                    Nous avons envoyé une confirmation à {formData.guestEmail}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex items-center justify-center gap-2 mb-6"
                  >
                    <span className="font-mono text-lg text-[#2A2520]">#{bookingId}</span>
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: -8 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigator.clipboard.writeText(bookingId)}
                      className="text-muted-taupe hover:text-amber transition-colors"
                      aria-label="Copier l'identifiant de réservation"
                    >
                      <Copy size={16} />
                    </motion.button>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="font-body text-sm text-muted-taupe mb-8"
                  >
                    Vous recevrez un rappel 24 heures avant votre visite.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {[
                      { label: "Ajouter au Calendrier" },
                      { label: "Modifier la Réservation" },
                    ].map((item) => (
                      <motion.div
                        key={item.label}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        className="glass-card p-4 flex flex-col items-center gap-2 cursor-pointer hover-lift"
                      >
                        <Calendar size={20} className="text-amber" />
                        <span className="font-body text-sm text-blush">{item.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Policy */}
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 bg-amber/30" />
              <div className="w-2 h-2 rotate-45 border border-amber" />
              <div className="h-px w-10 bg-amber/30" />
            </div>
            <h3 className="font-display text-lg text-blush mb-4">Politique de Réservation</h3>
            <div className="space-y-2 text-center">
              {[
                "Les réservations sont maintenues 15 minutes après l'heure réservée.",
                "Pour les groupes de 8 personnes ou plus, un acompte peut être demandé.",
                "Les annulations doivent être effectuées au moins 24 heures à l'avance.",
                "Tenue vestimentaire : tenue chic décontractée.",
              ].map((rule) => (
                <p key={rule} className="font-body text-sm text-parchment flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" />
                  {rule}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
