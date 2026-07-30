import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthCard, Field, PrimaryButton } from "@/components/page-shell";

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
  return (
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
      <Field label="Full name" placeholder="Jane Doe" />
      <Field label="Email" type="email" placeholder="you@email.com" />
      <Field label="Password" type="password" placeholder="Minimum 8 characters" />
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Account type
        </span>
        <select className="h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm outline-none focus:border-primary">
          <option>Buyer / Tenant</option>
          <option>Merchant (Agent, Agency, Developer, Landlord)</option>
        </select>
      </label>
      <PrimaryButton type="submit">Create account</PrimaryButton>
    </AuthCard>
  );
}