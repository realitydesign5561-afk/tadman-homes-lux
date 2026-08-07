import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field, PrimaryButton } from "@/components/page-shell";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    plan:
      typeof search.plan === "string"
        ? search.plan
        : "basic",
  }),

  head: () => ({
    meta: [
      {
        title: "Create Merchant Account | Tadman Homes",
      },
    ],
  }),

  component: RegisterPage,
});


function RegisterPage() {

  const navigate = useNavigate();

  const { plan } = Route.useSearch();


  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [businessName,setBusinessName] = useState("");

  const [error,setError] =
    useState<string | null>(null);

  const [notice,setNotice] =
    useState<string | null>(null);

  const [busy,setBusy] =
    useState(false);



async function handleSubmit(
e:React.FormEvent
){

e.preventDefault();

setBusy(true);
setError(null);
setNotice(null);



try{


const {
data,
error:signupError
}=await supabase.auth.signUp({

email,

password,

options:{

emailRedirectTo:
`${window.location.origin}/login`,

data:{

full_name:fullName,

business_name:businessName,

role:"merchant",

selected_plan:plan,

},

},

});



if(signupError)
throw signupError;



if(!data.user)
throw new Error(
"Unable to create account."
);



const {
error:merchantError
}=await supabase
.from("merchants")
.insert({

user_id:data.user.id,

business_name:businessName,

status:"pending",

});



if(merchantError)
throw merchantError;



setNotice(
"Account created successfully. Please verify your email and wait for admin approval."
);



if(data.session){

navigate({
to:"/dashboard",
replace:true,
});

}



}

catch(err:any){

setError(err.message);

}

finally{

setBusy(false);

}

}



return (

<form onSubmit={handleSubmit}>


<AuthCard

title="Create Merchant Account"

subtitle={`Selected plan: ${plan}`}

footer={

<>

Already have an account?{" "}

<Link
to="/login"
className="font-semibold text-primary"
>

Sign in

</Link>

</>

}

>


<Field

label="Full name"

required

value={fullName}

onChange={(e)=>
setFullName(e.target.value)
}

/>


<Field

label="Email"

type="email"

required

value={email}

onChange={(e)=>
setEmail(e.target.value)
}

/>


<Field

label="Password"

type="password"

required

minLength={8}

value={password}

onChange={(e)=>
setPassword(e.target.value)
}

/>


<Field

label="Business Name"

required

value={businessName}

onChange={(e)=>
setBusinessName(e.target.value)
}

/>



{error && (

<p className="text-sm text-destructive">
{error}
</p>

)}



{notice && (

<p className="text-sm text-primary">
{notice}
</p>

)}



<PrimaryButton
type="submit"
disabled={busy}
>

{busy
?
"Creating Account..."
:
"Create Merchant Account"
}

</PrimaryButton>


</AuthCard>


</form>

);

}
