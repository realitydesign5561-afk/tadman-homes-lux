import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function SubscriptionsTab(){

const {data, isLoading}=useQuery({
queryKey:["admin-subscriptions"],
queryFn:async()=>{

const {data,error}=await supabase
.from("subscriptions")
.select(`
id,
status,
start_date,
expiry_date,
merchant_id,
subscription_plans(
name
),
merchants(
business_name,
whatsapp_number
)
`)
.order("expiry_date",{ascending:true});


if(error) throw error;

return data;

}
});


if(isLoading)
return <p>Loading subscriptions...</p>;


return (

<div className="space-y-4">

<h2 className="text-xl font-bold">
Merchant Subscriptions
</h2>


{(!data || data.length===0) && (

<p className="text-muted-foreground">
No subscriptions found.
</p>

)}


{data?.map((sub:any)=>(

<div
key={sub.id}
className="rounded-xl border p-5"
>

<h3 className="font-bold">
{sub.merchants?.business_name || "Unknown merchant"}
</h3>


<p>
Plan: {sub.subscription_plans?.name || "No plan"}
</p>


<p>
Status: {sub.status}
</p>


<p>
Start:
{sub.start_date}
</p>


<p>
Expiry:
{sub.expiry_date}
</p>


<p>
WhatsApp:
{sub.merchants?.whatsapp_number || "-"}
</p>


</div>

))}

</div>

)

}
