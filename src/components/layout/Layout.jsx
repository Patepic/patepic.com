import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect, useRef } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BackToTop, PageBackdrop } from "../ui/decor";
import { RouteSkeleton } from "../ui/skeleton";
import { PageErrorBoundary } from "../PageErrorBoundary";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const TITLE_CHIP_ROUTES = new Set(["/reviews", "/tier-list", "/awards", "/guidelines", "/about", "/contact", "/credits"]);

export const Layout = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  const mainRef = useRef(null);
  useScrollReveal(mainRef);

  return (
    <div className="relative min-h-screen flex flex-col">
      {pathname !== "/" && <PageBackdrop key={pathname} chip={TITLE_CHIP_ROUTES.has(pathname.replace(/\/$/, ""))} spin />}
      <Navbar />
      <main ref={mainRef} className="flex-1 relative z-10 pt-16 lg:pt-32">
        <PageErrorBoundary key={pathname}>
          <Suspense fallback={<RouteSkeleton pathname={pathname} />}>
            <div key={pathname} className={pathname === "/" ? undefined : "page-enter"}>
              <Outlet />
            </div>
          </Suspense>
        </PageErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};
