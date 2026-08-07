import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

async function fetchOverviewStats() {
  const tables = [
    "properties",
    "merchants",
    "agents",
    "contact_requests",
    "subscriptions",
  ];

  const results = await Promise.all(
    tables.map(async (table) => {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error(`Error counting ${table}:`, error);
        return 0;
      }

      return count ?? 0;
    })
  );

  return {
    properties: results[0],
    merchants: results[1],
    agents: results[2],
    enquiries: results[3],
    subscriptions: results[4],
  };
}


export default function OverviewTab() {

  const {data, isLoading} = useQuery({
    queryKey:["admin-overview"],
    queryFn:fetchOverviewStats,
  });


  const cards=[
    {
      title:"Properties",
      value:data?.properties ?? 0,
    },
    {
      title:"Merchants",
      value:data?.merchants ?? 0,
    },
    {
      title:"Agents",
      value:data?.agents ?? 0,
    },
    {
      title:"Enquiries",
      value:data?.enquiries ?? 0,
    },
    {
      title:"Subscriptions",
      value:data?.subscriptions ?? 0,
    },
  ];


  if(isLoading){
    return (
      <p className="text-sm text-muted-foreground">
        Loading overview...
      </p>
    );
  }


  return (

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

      {cards.map(card=>(

        <div
        key={card.title}
        className="rounded-2xl border border-border bg-card p-5"
        >

          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {card.title}
          </p>

          <p className="mt-3 text-3xl font-bold">
            {card.value}
          </p>

        </div>

      ))}

    </div>

  );
}
