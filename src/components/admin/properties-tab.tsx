import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trash2 } from "lucide-react";

async function fetchProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}


async function updateStatus(id:string,status:string){

  const {error}=await supabase
    .from("properties")
    .update({
      status,
      published_at:
        status==="approved"
        ? new Date().toISOString()
        : null
    })
    .eq("id",id);


  if(error) throw error;

}



async function deleteProperty(id:string){

const {error}=await supabase
.from("properties")
.delete()
.eq("id",id);


if(error) throw error;

}



export default function PropertiesTab(){

const qc=useQueryClient();


const {data=[],isLoading}=useQuery({
queryKey:["admin-properties"],
queryFn:fetchProperties
});


const statusMutation=useMutation({
mutationFn:({
id,
status
}:{
id:string;
status:string;
})=>updateStatus(id,status),

onSuccess(){
qc.invalidateQueries({
queryKey:["admin-properties"]
});
}

});


const deleteMutation=useMutation({

mutationFn:deleteProperty,

onSuccess(){
qc.invalidateQueries({
queryKey:["admin-properties"]
});
}

});



if(isLoading){

return <p>Loading properties...</p>;

}



return (

<div className="space-y-5">

<h2 className="text-xl font-bold">
Properties
</h2>


{data.length===0 && (

<p className="text-sm text-muted-foreground">
No listings yet.
</p>

)}



<div className="grid gap-4">

{data.map((property:any)=>(


<div
key={property.id}
className="rounded-2xl border border-border bg-card p-5"
>


<div className="flex justify-between">

<div>

<h3 className="font-semibold">
{property.title}
</h3>


<p className="text-sm text-muted-foreground">
{property.city} {property.country}
</p>


<p className="mt-2 font-bold">
{property.status}
</p>

</div>


<button
onClick={()=>deleteMutation.mutate(property.id)}
className="text-red-500"
>

<Trash2 size={18}/>

</button>


</div>



<div className="mt-4 flex flex-wrap gap-2">


<button
className="rounded-full border px-3 py-1 text-sm"
onClick={()=>statusMutation.mutate({
id:property.id,
status:"approved"
})}
>
Approve
</button>


<button
className="rounded-full border px-3 py-1 text-sm"
onClick={()=>statusMutation.mutate({
id:property.id,
status:"rejected"
})}
>
Reject
</button>


<button
className="rounded-full border px-3 py-1 text-sm"
onClick={()=>statusMutation.mutate({
id:property.id,
status:"sold"
})}
>
Sold
</button>


<button
className="rounded-full border px-3 py-1 text-sm"
onClick={()=>statusMutation.mutate({
id:property.id,
status:"rented"
})}
>
Rented
</button>


</div>


</div>


))}


</div>


</div>

);

}
