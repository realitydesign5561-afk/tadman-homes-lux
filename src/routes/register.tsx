import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field, PrimaryButton } from "@/components/page-shell";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create an Account | Tadman Homes & Properties" },
      {
        name: "description",
        content: "Register as a buyer or merchant to save favourites and advertise your properties.",
      },
      { property: "og:title", content: "Create an Account | Tadman Homes" },
      { property: "og:description", content: "Join as a buyer or subscribe as a merchant." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "merchant">("user");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: { full_name: fullName, role },
      },
    });
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }

    if (data.session && role === "merchant") {
      await supabase.from("merchants").insert({
        user_id: data.session.user.id,
        business_name: businessName || fullName,
        email,
      });
    }
    setBusy(false);

    if (data.session) {
      navigate({ to: "/dashboard", replace: true });
    } else {
      setNotice("Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <AuthCard
        title="Create your account"
        subtitle="Save favourites as a buyer, or subscribe as a merchant to advertise properties."
        footer={
          <>
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-primary">
              Sign in
            </Link>
          </>
        }
      >
        <Field
          label="Full name"
          required
          placeholder="Jane Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
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
          minLength={8}
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Account type
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "merchant")}
            className="h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm outline-none focus:border-primary"
          >
            <option value="user">Buyer / Tenant</option>
            <option value="merchant">Merchant (Agent, Agency, Developer, Landlord)</option>
          </select>
        </label>
        {role === "merchant" && (
          <Field
            label="Business name"
            placeholder="Tadman Realty Ltd"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {notice && <p className="text-sm text-primary">{notice}</p>}
        <PrimaryButton type="submit" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </PrimaryButton>
      </AuthCard>
    </form>
  );
}
