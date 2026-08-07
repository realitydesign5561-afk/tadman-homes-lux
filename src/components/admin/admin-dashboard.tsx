import OverviewTab from "./overview-tab";
import {useState} from "react";
import PropertiesTab from "./properties-tab";
import MerchantsTab from "./merchants-tab";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";


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
const { signOut } = useAuth();
const navigate = useNavigate();
const [active,setActive]=useState("Overview");


return(

<div className="p-6">

<h1 className="text-3xl font-bold">
Tadman Admin Dashboard
</h1>


<div className="flex flex-wrap gap-3 mt-6">

{tabs.map(tab=>(
<button
  type="button"
  onClick={async () => {
    await signOut();
    navigate({ to: "/login", replace: true });
  }}
  className="rounded-full border border-border px-5 py-2 text-sm font-semibold"
>
  Logout
</button>
  
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
{active==="Overview" && <OverviewTab />}

{active==="Properties" && <PropertiesTab />}
  

{active==="Merchants" && <MerchantsTab />}


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
