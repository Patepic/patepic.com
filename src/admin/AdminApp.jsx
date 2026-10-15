import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "./AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin";

const Toaster = lazy(() =>
  import("sonner").then((m) => ({ default: m.Toaster }))
);

function LeaveAdmin() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    window.location.replace(`${pathname}${search}${hash}`);
  }, [pathname, search, hash]);
  return null;
}

export default function AdminApp() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<LeaveAdmin />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>

      <Suspense fallback={null}>
        <Toaster
          theme="light"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-charcoal-brown)",
              color: "var(--color-soft-white)",
              border: "1px solid var(--color-charcoal-brown)",
              borderRadius: "4px",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              boxShadow: "0 10px 28px -12px color-mix(in srgb, var(--color-charcoal-brown) 35%, transparent)",
            },
          }}
        />
      </Suspense>
    </div>
  );
}
