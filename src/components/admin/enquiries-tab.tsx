import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const card =
"surface-card rounded-2xl p-5";

const chip =
"rounded-full border border-border px-3 py-1.5 text-xs font-semibold";


export default function EnquiriesTab(){

const qc = useQueryClient();


const enquiries = useQuery({

queryKey:["admin-enquiries"],

queryFn:async()=>{

const {data,error}=await supabase
.from("enquiries")
.select("*")
.order("created_at",{ascending:false});


if(error) throw error;

return data ?? [];

}

});



const update = useMutation({

mutationFn:async({
id,
patch
}:{
id:string;
patch:any;
})=>{


const {error}=await supabase
.from("enquiries")
.update(patch)
.eq("id",id);


if(error) throw error;


},


onSuccess(){

qc.invalidateQueries({
queryKey:["admin-enquiries"]
});

}

});



const remove = useMutation({

mutationFn:async(id:string)=>{

const {error}=await supabase
.from("enquiries")
.delete()
.eq("id",id);


if(error) throw error;

},


onSuccess(){

qc.invalidateQueries({
queryKey:["admin-enquiries"]
});

}

});



return (

<div className="space-y-5">


{
enquiries.data?.length===0 &&

<p className="text-sm text-muted-foreground">
No enquiries yet.
</p>

}



{
enquiries.data?.map((enquiry:any)=>(


<div
key={enquiry.id}
className={card}
>


<div className="flex justify-between gap-4">


<div>

<h3 className="font-bold">
{enquiry.name}
</h3>


<p className="text-sm text-muted-foreground">
{enquiry.email}
</p>


<p className="text-sm text-muted-foreground">
{enquiry.phone}
</p>


</div>


<span className="text-xs">
{enquiry.status}
</span>


</div>



<div className="mt-4">


<p className="font-semibold text-sm">
{enquiry.subject}
</p>


<p className="mt-2 text-sm text-muted-foreground">
{enquiry.message}
</p>


</div>



<div className="mt-4 flex flex-wrap gap-2">


<button

className={chip}

onClick={()=>update.mutate({

id:enquiry.id,

patch:{
is_read:true
}

})}

>

Mark Read

</button>



<button

className={chip}

onClick={()=>update.mutate({

id:enquiry.id,

patch:{
status:"resolved"
}

})}

>

Resolve

</button>



{
enquiry.email &&

<a

href={`mailto:${enquiry.email}`}

className={chip}

>

Email Reply

</a>

}



{
enquiry.phone &&

<a

href={`https://wa.me/${enquiry.phone}`}

target="_blank"

className={chip}

>

WhatsApp

</a>

}



<button

className={chip+" text-destructive"}

onClick={()=>remove.mutate(enquiry.id)}

>

Delete

</button>



</div>



</div>


))

}



</div>

);

}
