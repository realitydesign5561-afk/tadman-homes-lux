import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthCard, Field, PrimaryButton } from "@/components/page-shell";

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
  return (
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
      <Field label="Email" type="email" placeholder="you@email.com" />
      <Field label="Password" type="password" placeholder="••••••••" />
      <div className="text-right">
        <Link to="/forgot-password" className="text-xs font-medium text-primary">
          Forgot password?
        </Link>
      </div>
      <PrimaryButton type="submit">Sign in</PrimaryButton>
    </AuthCard>
  );
}