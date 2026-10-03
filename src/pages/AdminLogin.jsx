import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../lib/api";
import { toast } from "sonner";
import { usePageTitle } from "../hooks/usePageTitle";

export default function AdminLogin() {
  usePageTitle("Admin sign in");
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
          <h1 className="display-hero text-4xl text-void">Admin sign in</h1>
          <p className="text-sm text-void/80 mt-2">Admin access only.</p>
        </div>

        <form onSubmit={submit} className="panel-framed p-7">
          <div className="relative mb-5">
            <Label htmlFor="email" className="eyebrow !text-[0.6rem] text-void">Email</Label>
            <Input id="email" type="email" required autoComplete="username" value={email}
              onChange={(e) => setEmail(e.target.value)} data-testid="admin-email-input" placeholder="Email"
              className="mt-2 h-12 bg-bone border-hairline text-void" />
          </div>

          <div className="relative mb-7">
            <Label htmlFor="password" className="eyebrow !text-[0.6rem] text-void">Password</Label>
            <Input id="password" type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} data-testid="admin-password-input" placeholder="Password"
              className="mt-2 h-12 bg-bone border-hairline text-void" />
          </div>

          <button type="submit" disabled={submitting} data-testid="admin-login-submit"
            className="relative w-full pill pill-jade h-12 px-8 text-sm disabled:opacity-60">
            {submitting ? (
              <><span className="w-4 h-4 rounded-full border-2 border-bone/30 border-t-bone animate-spin" /> Signing in…</>
            ) : (
              <><LogIn className="w-4 h-4" /> Sign in</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
