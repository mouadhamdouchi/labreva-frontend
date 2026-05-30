import type { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-void text-blush">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
