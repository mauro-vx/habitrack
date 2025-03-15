import { createClient } from "@/lib/supabase/server";

export default async function Profile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  console.log('user: ', user);
  
  
  return (
    <div className="container">
      <h1>Profile</h1>
    </div>
  );
}

