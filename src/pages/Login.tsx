import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";

export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const loginUrl = `${import.meta.env.VITE_KIMI_AUTH_URL}/api/oauth/authorize?app_id=${import.meta.env.VITE_APP_ID}&redirect_uri=${encodeURIComponent(window.location.origin + "/api/oauth/callback")}&scope=profile`;

  return (
    <div className="min-h-screen bg-void flex items-center justify-center relative overflow-hidden">
      {/* Drifting ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(200,149,108,0.18)_0%,transparent_70%)] blur-3xl animate-drift-slow"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(245,230,211,0.08)_0%,transparent_70%)] blur-3xl animate-drift-slow"
          style={{ animationDelay: "-8s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.05)_0%,transparent_60%)] blur-3xl animate-drift-slow"
          style={{ animationDelay: "-14s" }}
        />
      </div>
      <div className="noise-overlay" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        className="glass-card p-10 max-w-sm w-full mx-6 relative z-10"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
          }}
          className="text-center mb-8"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
            }}
            className="font-body text-xs font-medium tracking-[0.2em] text-blush mb-2"
          >
            LA BREVA
          </motion.p>
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
            }}
            className="font-display text-2xl text-blush"
          >
            Admin Portal
          </motion.h1>
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.7 } },
            }}
            className="font-body text-sm text-parchment mt-2"
          >
            Sign in to manage your restaurant
          </motion.p>
        </motion.div>

        <motion.a
          href={loginUrl}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: EASE_OUT_EXPO }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="magnetic-btn w-full py-4 bg-amber text-void font-medium rounded-full hover:bg-soft-gold transition-colors flex items-center justify-center gap-2 animate-glow-pulse"
        >
          <LogIn size={18} />
          Sign In with Portal
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-center mt-6 font-body text-xs text-muted-taupe"
        >
          <a href="/" className="text-amber hover:text-blush transition-colors underline-grow">
            &larr; Back to website
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
