import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BackToTop } from "../ui/decor";
import { useEffect } from "react";

export const Layout = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1 relative z-10 pt-16">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};