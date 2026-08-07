import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import AdminDashboard from "@/components/admin/admin-dashboard";

export const Route = createFileRoute("/admin")({
  ssr:false,

  beforeLoad: async()=>{

    const {data} = await supabase.auth.getUser();

    if(!data.user){
      throw redirect({
        to:"/login"
      });
    }


    const {data:role}=await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id",data.user.id)
      .eq("role","admin");


    if(!role || role.length===0){
      throw redirect({
        to:"/dashboard"
      });
    }

  },

  component:AdminDashboard
});
