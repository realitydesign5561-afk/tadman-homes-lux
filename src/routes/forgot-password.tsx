import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthCard, Field, PrimaryButton } from "@/components/page-shell";

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
  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a secure reset link."
      footer={
        <Link to="/login" className="font-semibold text-primary">
          Back to sign in
        </Link>
      }
    >
      <Field label="Email" type="email" placeholder="you@email.com" />
      <PrimaryButton type="submit">Send reset link</PrimaryButton>
    </AuthCard>
  );
}