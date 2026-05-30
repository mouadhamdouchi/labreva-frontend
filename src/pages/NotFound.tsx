import { Link } from "react-router";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-display text-8xl text-amber/20 mb-4">404</p>
        <h1 className="font-display text-3xl text-blush mb-3">Page Not Found</h1>
        <p className="font-body text-parchment mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-amber text-void font-medium rounded-full hover:bg-soft-gold transition-all hover:scale-105"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
