import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trash2 } from "lucide-react";


async function fetchMerchants(){

const {data,error}=await supabase
.from("merchants")
.select("*")
.order("created_at",{ascending:false});


if(error) throw error;

return data ?? [];

}



async function updateMerchantStatus(
id:string,
status:string
){

const {error}=await supabase
.from("merchants")
.update({
status,
verified: status==="approved"
})
.eq("id",id);


if(error) throw error;

}



async function deleteMerchant(id:string){

const {error}=await supabase
.from("merchants")
.delete()
.eq("id",id);


if(error) throw error;

}




export default function MerchantsTab(){

const qc=useQueryClient();


const {
data=[],
isLoading
}=useQuery({

queryKey:["admin-merchants"],

queryFn:fetchMerchants

});



const statusMutation=useMutation({

mutationFn:({
id,
status
}:{
id:string;
status:string;
})=>updateMerchantStatus(id,status),

onSuccess(){

qc.invalidateQueries({
queryKey:["admin-merchants"]
});

}

});



const deleteMutation=useMutation({

mutationFn:deleteMerchant,

onSuccess(){

qc.invalidateQueries({
queryKey:["admin-merchants"]
});

}

});



if(isLoading){

return <p>Loading merchants...</p>;

}



return (

<div className="space-y-5">


<h2 className="text-xl font-bold">
Merchants
</h2>



{data.length===0 && (

<p className="text-sm text-muted-foreground">
No merchants registered yet.
</p>

)}



<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">


{data.map((merchant:any)=>(


<div
key={merchant.id}
className="rounded-2xl border border-border bg-card p-5"
>


<div className="flex justify-between">


<div>

<h3 className="font-semibold">
{merchant.business_name}
</h3>


<p className="text-sm text-muted-foreground">
{merchant.email}
</p>


<p className="text-sm text-muted-foreground">
{merchant.phone || merchant.whatsapp || ""}
</p>


<p className="mt-2 text-xs font-bold uppercase">
{merchant.status}
</p>


</div>



<button
className="text-red-500"
onClick={()=>deleteMutation.mutate(merchant.id)}
>

<Trash2 size={18}/>

</button>



</div>



<div className="mt-4 flex gap-2 flex-wrap">


<button
className="rounded-full border px-3 py-1 text-sm"
onClick={()=>statusMutation.mutate({
id:merchant.id,
status:"approved"
})}
>
Approve
</button>



<button
className="rounded-full border px-3 py-1 text-sm"
onClick={()=>statusMutation.mutate({
id:merchant.id,
status:"suspended"
})}
>
Suspend
</button>



<button
className="rounded-full border px-3 py-1 text-sm"
onClick={()=>statusMutation.mutate({
id:merchant.id,
status:"pending"
})}
>
Pending
</button>



</div>



</div>


))}


</div>


</div>

);

}
