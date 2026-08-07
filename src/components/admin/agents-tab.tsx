import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

const card =
"surface-card rounded-2xl p-5";

const chip =
"rounded-full border border-border px-3 py-1.5 text-xs font-semibold";


const emptyAgent = {
  full_name:"",
  title:"",
  bio:"",
  photo_url:"",
  email:"",
  phone:"",
  whatsapp:"",
  facebook:"",
  instagram:"",
  linkedin:"",
  twitter:"",
  is_active:true,
  sort_order:0,
};


export default function AgentsTab(){

const qc = useQueryClient();

const [form,setForm]=useState<any>(emptyAgent);


const agents = useQuery({

queryKey:["admin-agents"],

queryFn:async()=>{

const {data,error}=await supabase
.from("agents")
.select("*")
.order("sort_order",{ascending:true});


if(error) throw error;

return data ?? [];

}

});



const save = useMutation({

mutationFn:async(agent:any)=>{

const {error}=await supabase
.from("agents")
.upsert(agent);


if(error) throw error;

},


onSuccess(){

qc.invalidateQueries({
queryKey:["admin-agents"]
});

setForm(emptyAgent);

}

});



const remove = useMutation({

mutationFn:async(id:string)=>{

const {error}=await supabase
.from("agents")
.delete()
.eq("id",id);


if(error) throw error;

},


onSuccess(){

qc.invalidateQueries({
queryKey:["admin-agents"]
});

}

});



const toggle = useMutation({

mutationFn:async(agent:any)=>{

const {error}=await supabase
.from("agents")
.update({
is_active:!agent.is_active
})
.eq("id",agent.id);


if(error) throw error;

},


onSuccess(){

qc.invalidateQueries({
queryKey:["admin-agents"]
});

}

});



return (

<div className="space-y-8">


<form

className="surface-card rounded-2xl p-6 grid gap-4"

onSubmit={(e)=>{

e.preventDefault();

save.mutate(form);

}}

>


<input
className="border rounded-xl p-3"
placeholder="Full name"
value={form.full_name}
onChange={
e=>setForm({
...form,
full_name:e.target.value
})
}
/>


<input
className="border rounded-xl p-3"
placeholder="Title"
value={form.title}
onChange={
e=>setForm({
...form,
title:e.target.value
})
}
/>



<input
className="border rounded-xl p-3"
placeholder="Email"
value={form.email}
onChange={
e=>setForm({
...form,
email:e.target.value
})
}
/>


<input
className="border rounded-xl p-3"
placeholder="Phone"
value={form.phone}
onChange={
e=>setForm({
...form,
phone:e.target.value
})
}
/>



<input
className="border rounded-xl p-3"
placeholder="WhatsApp"
value={form.whatsapp}
onChange={
e=>setForm({
...form,
whatsapp:e.target.value
})
}
/>



<textarea

className="border rounded-xl p-3"

placeholder="Bio"

value={form.bio}

onChange={
e=>setForm({
...form,
bio:e.target.value
})
}

/>



<button
className="bg-black text-white rounded-full px-5 py-3"
>

{
form.id
?"Update Agent"
:"Add Agent"
}

</button>



</form>




<div className="grid gap-4 lg:grid-cols-3">


{
agents.data?.map((agent:any)=>(


<div
key={agent.id}
className={card}
>


{
agent.photo_url &&
<img
src={agent.photo_url}
className="h-32 w-full rounded-xl object-cover"
/>
}



<h3 className="mt-3 font-bold">
{agent.full_name}
</h3>


<p className="text-sm text-muted-foreground">
{agent.title}
</p>


<p className="text-xs mt-2">
{agent.email}
</p>



<div className="mt-4 flex flex-wrap gap-2">


<button

className={chip}

onClick={()=>setForm(agent)}

>
Edit
</button>



<button

className={chip}

onClick={()=>toggle.mutate(agent)}

>

{
agent.is_active
?"Deactivate"
:"Activate"
}

</button>



<button

className={chip+" text-destructive"}

onClick={()=>remove.mutate(agent.id)}

>

Delete

</button>



</div>


</div>


))

}


</div>


</div>

);

}
