import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field, PrimaryButton } from "@/components/page-shell";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    plan:
      typeof search.plan === "string"
        ? search.plan
        : "basic",
  }),

  head: () => ({
    meta: [
      {
        title: "Create Merchant Account | Tadman Homes",
      },
    ],
  }),

  component: RegisterPage,
});


function RegisterPage() {

  const navigate = useNavigate();

  const { plan } = Route.useSearch();


  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [businessName,setBusinessName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(plan);

  const [error,setError] =
    useState<string | null>(null);

  const [notice,setNotice] =
    useState<string | null>(null);

  const [busy,setBusy] =
    useState(false);



 async function handleSubmit(
 e:React.FormEvent
 ){

 e.preventDefault();

 setBusy(true);
 setError(null);
 setNotice(null);

 try{

 const {
 data,
 error:signupError
 }=await supabase.auth.signUp({

 email,

 password,

 options:{

 emailRedirectTo:
 `${window.location.origin}/login`,

 data:{

 full_name:fullName,

 business_name:businessName,

 role:"merchant",

 selected_plan:selectedPlan,

 },

 },

 });

 if(signupError)
 throw signupError;

 if(!data || !data.user)
 throw new Error(
 "Unable to create account."
 );

 // Do NOT create merchant server-side here. Payment must be completed first.
 setNotice(
   "Account created. Please verify your email. To activate a merchant account you must complete a paid subscription — after successful payment your merchant profile will be created and placed in 'Waiting for admin approval'."
 );

 // Keep the user on a neutral page — do not auto-enter dashboard until approved.
 // Optionally redirect to login page where they can verify their email.

 // navigate({ to: "/login", replace: true });

 }

 catch(err:any){

 setError(err?.message || String(err));

 }

 finally{

 setBusy(false);

 }

 }


 return (

 <form onSubmit={handleSubmit}>

 <AuthCard
 title="Create Merchant Account"
 subtitle={`Selected plan: ${selectedPlan}`}
 footer={
   <>
     Already have an account?{" "}
     <Link
       to="/login"
       className="font-semibold text-primary"
     >
       Sign in
     </Link>
   </>
 }
 >

 <Field
 label="Full name"
 required
 value={fullName}
 onChange={(e)=> setFullName(e.target.value)}
 />

 <Field
 label="Email"
 type="email"
 required
 value={email}
 onChange={(e)=> setEmail(e.target.value)}
 />

 <Field
 label="Password"
 type="password"
 required
 minLength={8}
 value={password}
 onChange={(e)=> setPassword(e.target.value)}
 />

 <Field
 label="Business Name"
 required
 value={businessName}
 onChange={(e)=> setBusinessName(e.target.value)}
 />

 <label className="block mt-2">
   <span className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Subscription plan</span>
   <select
     required
     value={selectedPlan}
     onChange={(e) => setSelectedPlan(e.target.value)}
     className="h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm"
   >
     <option value="basic">Basic — ₦10,000/month</option>
     <option value="premium">Premium — ₦25,000/month</option>
     <option value="enterprise">Enterprise — ₦50,000/month</option>
   </select>
 </label>

 {error && (
   <p className="text-sm text-destructive mt-2">{error}</p>
 )}

 {notice && (
   <p className="text-sm text-primary mt-2">{notice}</p>
 )}

 <PrimaryButton type="submit" disabled={busy}>
   {busy ? "Creating Account..." : "Create Merchant Account"}
 </PrimaryButton>

 </AuthCard>

 </form>

 );

 }
