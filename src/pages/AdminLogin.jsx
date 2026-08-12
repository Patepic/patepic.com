import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn } from "lucide-react";
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
          <div className="inline-grid place-items-center w-12 h-12 rounded-full bg-scarlet mb-4">
            <Lock className="w-5 h-5 text-gold" />
          </div>
          <h1 className="display-heading text-4xl text-ink">Admin sign in</h1>
          <p className="text-sm text-ink/70 mt-2">Only the writer gets in past this point.</p>
        </div>

        <form onSubmit={submit} className="panel-framed rounded-2xl p-7">
          <div className="relative mb-5">
            <Label htmlFor="email" className="text-[0.8rem] tracking-[0.06em] uppercase font-bold text-ink">Email</Label>
            <Input id="email" type="email" required autoComplete="username" value={email}
              onChange={(e) => setEmail(e.target.value)} data-testid="admin-email-input" placeholder="Email"
              className="mt-2 h-12 bg-surface border-ink text-ink" />
          </div>

          <div className="relative mb-7">
            <Label htmlFor="password" className="text-[0.8rem] tracking-[0.06em] uppercase font-bold text-ink">Password</Label>
            <Input id="password" type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} data-testid="admin-password-input" placeholder="Password"
              className="mt-2 h-12 bg-surface border-ink text-ink" />
          </div>

          <button type="submit" disabled={submitting} data-testid="admin-login-submit"
            className="relative w-full pill pill-ember h-12 px-8 text-sm disabled:opacity-60">
            {submitting ? (
              <><span className="w-4 h-4 rounded-full border-2 border-surface/40 border-t-surface animate-spin" /> Signing in…</>
            ) : (
              <><LogIn className="w-4 h-4" /> Sign in</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}