import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field, PrimaryButton } from "@/components/page-shell";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Password | Tadman Homes & Properties" },
      { name: "description", content: "Reset the password for your Tadman Homes & Properties account." },
      { property: "og:title", content: "Reset Password | Tadman Homes" },
      { property: "og:description", content: "We'll email you a secure reset link." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <form onSubmit={handleSubmit}>
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a secure reset link."
      footer={
        <Link to="/login" className="font-semibold text-primary">
          Back to sign in
        </Link>
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
      {error && <p className="text-sm text-destructive">{error}</p>}
      {sent && <p className="text-sm text-primary">Reset link sent. Check your inbox.</p>}
      <PrimaryButton type="submit" disabled={busy}>
        {busy ? "Sending…" : "Send reset link"}
      </PrimaryButton>
    </AuthCard>
    </form>
  );
}