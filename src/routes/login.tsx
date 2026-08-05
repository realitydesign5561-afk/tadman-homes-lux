import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthCard, Field, PrimaryButton } from "@/components/page-shell";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      {
        title: "Sign In | Tadman Homes & Properties",
      },
      {
        name: "description",
        content:
         "Merchant login for Tadman Homes & Properties. Access your dashboard, manage listings and enquiries.",
      },
      {
        property: "og:title",
        content: "Sign In | Tadman Homes",
      },
      {
        property: "og:description",
        content:
          "Access your favourites and merchant dashboard.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const {
    session,
    roles,
    loading,
    isAdmin,
    isMerchant,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!session) return;

    if (isAdmin) {
      navigate({
        to: "/admin",
        replace: true,
      });
      return;
    }

    if (isMerchant) {
      navigate({
        to: "/dashboard",
        replace: true,
      });
      return;
    }

    navigate({
      to: "/",
      replace: true,
    });
  }, [session, loading, isAdmin, isMerchant, roles, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setBusy(true);
    setError(null);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setBusy(false);

    if (error) {
      setError("Invalid email or password.");
      return;
    }

    // Navigation happens automatically after
    // roles are loaded in use-auth.tsx
  }

  return (
    <form onSubmit={handleSubmit}>
      <AuthCard
        title="Merchant Login"
        subtitle="Sign in to access your merchant dashboard and manage your property listings."
        footer={
          <>
            Don't have a merchant account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary"
            >
              Register Here
            </Link>
          </>
        }
      >
        <Field
          label="Email"
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <Field
          label="Password"
          type="password"
          required
          placeholder="Enter your password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-primary"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        <PrimaryButton
          type="submit"
          disabled={busy}
        >
         {busy ? "Signing In..." : "Login"}
        </PrimaryButton>
      </AuthCard>
    </form>
  );
}
