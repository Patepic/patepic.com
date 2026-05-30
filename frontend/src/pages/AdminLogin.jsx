import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Snowflake, LogIn } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../lib/api";
import { toast } from "sonner";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate("/admin", { replace: true });
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
      toast.success("Welcome back.");
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="admin-login-page" className="min-h-[80vh] grid place-items-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-grid place-items-center w-12 h-12 rounded-full bg-white border border-sky-200 shadow-sm mb-4">
            <Snowflake className="w-5 h-5 text-sky-600" />
          </div>
          <h1 className="font-display text-3xl text-slate-900 tracking-tight">Admin sign in</h1>
          <p className="text-sm text-slate-500 mt-2">Only the writer gets in past this point.</p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl bg-white border border-slate-200 p-7 shadow-[0_30px_80px_-30px_rgba(2,132,199,0.25)]"
        >
          <div className="mb-5">
            <Label htmlFor="email" className="text-xs tracking-[0.2em] uppercase text-sky-700">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="admin-email-input"
              placeholder="patrickcoulter01@gmail.com"
              className="mt-2 h-12 bg-white border-slate-200 focus-visible:ring-sky-400"
            />
          </div>

          <div className="mb-7">
            <Label htmlFor="password" className="text-xs tracking-[0.2em] uppercase text-sky-700">Password</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="admin-password-input"
              placeholder="••••••••"
              className="mt-2 h-12 bg-white border-slate-200 focus-visible:ring-sky-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            data-testid="admin-login-submit"
            className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-700 disabled:opacity-60 transition"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign in
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-5 inline-flex items-center gap-1.5 justify-center w-full">
          <Lock className="w-3 h-3" /> Single-admin site. Change credentials in <code className="text-slate-600">backend/.env</code>.
        </p>
      </div>
    </div>
  );
}
