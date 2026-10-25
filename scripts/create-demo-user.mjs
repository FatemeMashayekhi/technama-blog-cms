import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

async function loadEnvironment() {
  const source = await readFile(new URL("../.env.local", import.meta.url), "utf8");
  return Object.fromEntries(source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
    const separator = line.indexOf("=");
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^['\"]|['\"]$/g, "")];
  }));
}

const env = await loadEnvironment();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const email = env.DEMO_USER_EMAIL;
const password = env.DEMO_USER_PASSWORD;
if (!url || !serviceRoleKey || !email || !password) throw new Error("Supabase and DEMO_USER_* values are required in .env.local.");
if (password.length < 16) throw new Error("DEMO_USER_PASSWORD must contain at least 16 characters.");

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: usersPage, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listError) throw listError;
let user = usersPage.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
if (!user) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: "بازدیدکننده نسخه نمایشی" },
    app_metadata: { read_only: true, demo_account: true },
  });
  if (error) throw error;
  user = data.user;
} else {
  const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
    password,
    email_confirm: true,
    app_metadata: { ...user.app_metadata, read_only: true, demo_account: true },
  });
  if (error) throw error;
  user = data.user;
}

const { error: profileError } = await supabase.from("profiles").update({
  display_name: "بازدیدکننده نسخه نمایشی",
  username: "portfolio.demo",
  bio: "حساب نمایشی فقط‌خواندنی برای مشاهده امکانات پنل مدیریت تک‌نما.",
  role: "author",
  is_active: true,
}).eq("id", user.id);
if (profileError) throw profileError;

console.log("Demo account is ready. Add this server-only variable locally and in Vercel:");
console.log(`DEMO_USER_ID=${user.id}`);
