import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthCard, Field, PrimaryButton } from "@/components/page-shell";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In | Tadman Homes & Properties" },
      { name: "description", content: "Sign in to your Tadman account to manage saved properties and listings." },
      { property: "og:title", content: "Sign In | Tadman Homes" },
      { property: "og:description", content: "Access your favourites and merchant dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: isAdmin ? "/admin" : "/dashboard", replace: true });
  }, [session, isAdmin, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <form onSubmit={handleSubmit}>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to manage your favourites, enquiries and listings."
        footer={
          <>
            New here?{" "}
            <Link to="/register" className="font-semibold text-primary">
              Create an account
            </Link>
          </>
        }
      >
        <Field
          label="Email"
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-right">
          <Link to="/forgot-password" className="text-xs font-medium text-primary">
            Forgot password?
          </Link>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <PrimaryButton type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </PrimaryButton>
      </AuthCard>
    </form>
  );
}
