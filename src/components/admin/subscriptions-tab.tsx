import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function SubscriptionsTab(){

const qc = useQueryClient();


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
subscription_plans(name),
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



const updateSubscription = useMutation({

mutationFn:async({
id,
status,
expiry_date
}:{
id:string;
status?:string;
expiry_date?:string;
})=>{


const update:any={};

if(status)
update.status=status;

if(expiry_date)
update.expiry_date=expiry_date;


const {error}=await supabase
.from("subscriptions")
.update(update)
.eq("id",id);


if(error) throw error;

},


onSuccess:()=>{

qc.invalidateQueries({
queryKey:["admin-subscriptions"]
});

}

});



if(isLoading)
return <p>Loading subscriptions...</p>;



return (

<div className="space-y-5">

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
className="rounded-xl border p-5 space-y-2"
>


<h3 className="font-bold">
{sub.merchants?.business_name || "Unknown merchant"}
</h3>


<p>
Plan:
{sub.subscription_plans?.name || "No plan"}
</p>


<p>
Status:
<span className="font-semibold">
{sub.status}
</span>
</p>


<p>
Expiry:
{sub.expiry_date}
</p>


<p>
WhatsApp:
{sub.merchants?.whatsapp_number || "-"}
</p>



<div className="flex flex-wrap gap-2 mt-4">


<button

onClick={()=>updateSubscription.mutate({
id:sub.id,
status:"active"
})}

className="rounded-full bg-black text-white px-4 py-2 text-sm"

>
Activate
</button>



<button

onClick={()=>{

const date=new Date();

date.setMonth(date.getMonth()+1);


updateSubscription.mutate({

id:sub.id,

expiry_date:
date.toISOString().split("T")[0],

status:"active"

});


}}

className="rounded-full border px-4 py-2 text-sm"

>
Extend 30 Days
</button>



<button

onClick={()=>updateSubscription.mutate({

id:sub.id,

status:"cancelled"

})}

className="rounded-full border border-red-500 text-red-600 px-4 py-2 text-sm"

>
Cancel
</button>


</div>



</div>


))}


</div>

)

}
