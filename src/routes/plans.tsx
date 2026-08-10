import { createFileRoute, Link } from "@tanstack/react-router";
import { PrimaryButton } from "@/components/page-shell";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      {
        title: "Merchant Plans | Tadman Homes & Properties",
      },
      {
        name: "description",
        content:
          "Choose a merchant subscription plan to list properties on Tadman Homes.",
      },
    ],
  }),
  component: PlansPage,
});


const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "#10,000/month",
    features: [
      "List properties",
      "Merchant dashboard",
      "Manage enquiries",
    ],
  },

  {
    id: "premium",
    name: "Premium",
    price: "#25,000/month",
    featured: true,
    features: [
      "Unlimited listings",
      "Featured properties",
      "Priority visibility",
      "Analytics dashboard",
    ],
  },

  {
    id: "enterprise",
    name: "Enterprise",
    price: "#50,000/month",
    features: [
      "Multiple agents",
      "Advanced management",
      "Priority support",
    ],
  },
];


function PlansPage() {

return (

<div className="mx-auto max-w-6xl p-6">

<h1 className="text-3xl font-bold text-center">
Choose Your Merchant Plan
</h1>


<p className="mt-3 text-center text-muted-foreground">
Subscribe to advertise and manage your properties on Tadman Homes.
</p>


<div className="mt-10 grid gap-6 md:grid-cols-3">


{plans.map((plan)=>(

<div
key={plan.id}
className={`rounded-3xl border p-6 ${
plan.featured
? "border-primary shadow-lg"
: "border-border"
}`}
>


<h2 className="text-xl font-bold">
{plan.name}
</h2>


<p className="mt-2 text-2xl font-bold">
{plan.price}
</p>


<ul className="mt-5 space-y-2 text-sm">

{plan.features.map((feature)=>(

<li key={feature}>
✓ {feature}
</li>

))}

</ul>


<Link
to="/register"
search={{
plan: plan.id,
}}
className="mt-6 block"
>

<PrimaryButton>
Choose {plan.name}
</PrimaryButton>

</Link>


</div>

))}


</div>


</div>

);

}
