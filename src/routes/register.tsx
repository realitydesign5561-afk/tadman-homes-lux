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
        content:
          "Register as a buyer or merchant to save favourites and advertise your properties.",
      },
      {
        property: "og:title",
        content: "Create an Account | Tadman Homes",
      },
      {
        property: "og:description",
        content: "Join as a buyer or subscribe as a merchant.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState<"merchant">("merchant");
  const [businessName, setBusinessName] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setBusy(true);
    setError(null);
    setNotice(null);
   console.log("Submitting signup", {
        email,
        password,
        fullName,
        businessName,
    });
    const response = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/login`,
    data: {
      full_name: fullName,
      business_name: businessName,
      role: "merchant",
    },
  },
});

console.log("Signup Response:", response);

const { data, error } = response;
console.log("SIGNUP RESPONSE", { data, error });

if (error) {
  console.error(error);
  setBusy(false);
  setError(JSON.stringify(error, null, 2));
  return;
}
    if (!data.user) {
      setBusy(false);
      setError("Unable to create account.");
      return;
    }

    setBusy(false);

    if (data.session) {
      navigate({
        to: role === "merchant" ? "/dashboard" : "/",
        replace: true,
      });
    } else {
      setNotice(
        "Account created successfully. Please check your email to verify your account before signing in."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <AuthCard
        title="Create Your Merchant Account"
        subtitle="Register as a property merchant to publish listings, manage enquiries and grow your business on Tadman Homes & Properties."
        footer={
          <>
            Already have a merchant account?{" "}
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

        <Field
          label="Business Name"
          required
          placeholder="ABC Properties Ltd"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {notice && (
          <p className="text-sm text-primary">{notice}</p>
        )}

        <PrimaryButton type="submit" disabled={busy}>
         {busy ? "Creating Merchant Account..." : "Create Merchant Account"}
        </PrimaryButton>
      </AuthCard>
    </form>
  );
}
