import { authorToForm, getMockAuthor, type AuthorFormData } from "@/lib/authors-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function getAuthorForm(id:string):Promise<AuthorFormData|null>{if(!isSupabaseConfigured){const author=getMockAuthor(id);return author?authorToForm(author):null;}const{data,error}=await(await createSupabaseServerClient()).from("profiles").select("*").eq("id",id).maybeSingle();if(error||!data)return null;let email="";if(process.env.SUPABASE_SERVICE_ROLE_KEY){const{data:authData}=await createSupabaseAdminClient().auth.admin.getUserById(id);email=authData.user?.email??"";}return{name:data.display_name,username:data.username,email,avatar:data.avatar_url??undefined,bio:data.bio,role:data.role,status:data.is_active?"active":"inactive",socialLinks:{website:"",linkedin:"",twitter:"",github:""}};}
