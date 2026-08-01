import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthCard, Field, PrimaryButton } from "@/components/page-shell";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/merchant/login")({
  head: () => ({
    meta: [
      { title: "Merchant Login | Tadman Homes and Properties" },
      {
        name: "description",
        content:
          "Merchant sign in for Tadman Homes and Properties — manage listings, enquiries and your subscription.",
      },
      { property: "og:title", content: "Merchant Login | Tadman Homes and Properties" },
      {
        property: "og:description",
        content: "Sign in to your merchant dashboard to manage listings and enquiries.",
      },
    ],
  }),
  component: MerchantLoginPage,
});

function MerchantLoginPage() {
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
        title="Merchant login"
        subtitle="Sign in to manage your listings, enquiries and subscription."
        footer={
          <>
            Not a merchant yet?{" "}
            <Link to="/merchant" className="font-semibold text-primary">
              Become a merchant
            </Link>
          </>
        }
      >
        <Field
          label="Email"
          type="email"
          required
          placeholder="you@company.com"
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
