import { lazy, Suspense, useEffect, type ComponentType } from "react";
import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import PublicLayout from "./components/layout/PublicLayout";
import PageTransition from "./components/PageTransition";

function ScrollToTop({ pathname }: { pathname: string }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

const Home = lazy(() => import("./pages/Home"));
const Menu = lazy(() => import("./pages/Menu"));
const Reservation = lazy(() => import("./pages/Reservation"));
const Events = lazy(() => import("./pages/Events"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageFallback() {
  return (
    <div className="min-h-screen bg-void pt-24 px-6">
      <div className="mx-auto max-w-7xl py-16">
        <div className="h-6 w-32 animate-shimmer rounded mb-5" />
        <div className="h-12 w-full max-w-md animate-shimmer rounded mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="aspect-[4/3] animate-shimmer rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PublicPage({ PageComponent }: { PageComponent: ComponentType }) {
  return (
    <PublicLayout>
      <Suspense fallback={<PageFallback />}>
        <PageTransition>
          <PageComponent />
        </PageTransition>
      </Suspense>
    </PublicLayout>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageFallback />}>
      <ScrollToTop pathname={location.pathname} />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PublicPage PageComponent={Home} />} />
          <Route path="/menu" element={<PublicPage PageComponent={Menu} />} />
          <Route path="/reservation" element={<PublicPage PageComponent={Reservation} />} />
          <Route path="/events" element={<PublicPage PageComponent={Events} />} />
          <Route path="/gallery" element={<PublicPage PageComponent={Gallery} />} />
          <Route path="/about" element={<PublicPage PageComponent={About} />} />
          <Route path="/contact" element={<PublicPage PageComponent={Contact} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
