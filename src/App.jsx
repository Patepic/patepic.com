import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { lazyPage } from "@/lib/lazyPage";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import TierList from "@/pages/TierList";

const Toaster = lazy(() =>
  import("sonner").then((m) => ({ default: m.Toaster }))
);

const About = lazyPage(() => import("@/pages/About"));
const Reviews = lazyPage(() => import("@/pages/Reviews"));
const ReviewDetail = lazyPage(() => import("@/pages/ReviewDetail"));
const Guidelines = lazyPage(() => import("@/pages/Guidelines"));
const Awards = lazyPage(() => import("@/pages/Awards"));
const YearInGaming = lazyPage(() => import("@/pages/YearInGaming"));
const Contact = lazyPage(() => import("@/pages/Contact"));
const AdminLogin = lazyPage(() => import("@/pages/AdminLogin"));
const Admin = lazyPage(() => import("@/pages/Admin"));
const NotFound = lazyPage(() => import("@/pages/NotFound"));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={null}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/reviews/:slug" element={<ReviewDetail />} />
                <Route path="/tier-list" element={<TierList />} />
                <Route path="/awards" element={<Awards />} />
                <Route path="/year-in-gaming" element={<YearInGaming />} />
                <Route path="/year-in-gaming/:year" element={<YearInGaming />} />
                <Route path="/guidelines" element={<Guidelines />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>

      <Suspense fallback={null}>
        <Toaster
          theme="light"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#9DECB8",
              color: "#171C1A",
              border: "1px solid rgba(38, 106, 90, 0.4)",
              borderRadius: "4px",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              boxShadow: "0 10px 28px -12px rgba(0, 0, 0, 0.35)",
            },
          }}
        />
      </Suspense>
    </div>
  );
}

export default App;
