import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field, PrimaryButton } from "@/components/page-shell";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a New Password | Tadman Homes & Properties" },
      { name: "description", content: "Choose a new password for your Tadman Homes account." },
      { property: "og:title", content: "Reset Password | Tadman Homes" },
      { property: "og:description", content: "Securely set a new password for your account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message);
    else navigate({ to: "/dashboard", replace: true });
  }

  return (
    <form onSubmit={handleSubmit}>
      <AuthCard
        title="Set a new password"
        subtitle="Enter a new password for your account."
        footer={<span>Make sure it is at least 8 characters.</span>}
      >
        <Field
          label="New password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <PrimaryButton type="submit" disabled={busy}>
          {busy ? "Saving…" : "Update password"}
        </PrimaryButton>
      </AuthCard>
    </form>
  );
}
