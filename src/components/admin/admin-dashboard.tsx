import {useState} from "react";

const tabs=[
"Overview",
"Properties",
"Merchants",
"Subscriptions",
"Agents",
"Enquiries",
"Settings",
"Activity"
];


export default function AdminDashboard(){

const [active,setActive]=useState("Overview");


return(

<div className="p-6">

<h1 className="text-3xl font-bold">
Tadman Admin Dashboard
</h1>


<div className="flex flex-wrap gap-3 mt-6">

{tabs.map(tab=>(

<button
key={tab}
onClick={()=>setActive(tab)}
className={
active===tab
?"bg-black text-white px-4 py-2 rounded-full"
:"border px-4 py-2 rounded-full"
}
>
{tab}
</button>

))}

</div>


<div className="mt-8">

{active==="Overview" &&
<p>Overview coming...</p>
}


{active==="Properties" &&
<p>Properties coming...</p>
}


{active==="Merchants" &&
<p>Merchants coming...</p>
}


{active==="Subscriptions" &&
<p>Subscriptions coming...</p>
}


{active==="Agents" &&
<p>Agents coming...</p>
}


{active==="Enquiries" &&
<p>Enquiries coming...</p>
}


{active==="Settings" &&
<p>Settings coming...</p>
}


{active==="Activity" &&
<p>Activity coming...</p>
}


</div>


</div>

)

}
