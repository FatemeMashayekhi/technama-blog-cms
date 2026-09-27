import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

async function loadEnvironment() {
  const source = await readFile(new URL("../.env.local", import.meta.url), "utf8");
  return Object.fromEntries(source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
    const separator = line.indexOf("=");
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^['\"]|['\"]$/g, "")];
  }));
}

const authors = [
  { name: "ندا احمدی", username: "neda.ai", email: "neda.ai@authors.example.com", role: "author", bio: "پژوهشگر هوش مصنوعی کاربردی با تمرکز بر مدل‌های زبانی، ابزارهای توسعه و طراحی محصولات مبتنی بر یادگیری ماشین." },
  { name: "آرمان شریفی", username: "arman.frontend", email: "arman.frontend@authors.example.com", role: "author", bio: "مهندس Frontend و نویسنده حوزه React، Next.js، TypeScript و معماری رابط‌های کاربری مقیاس‌پذیر." },
  { name: "سارا محمدی", username: "sara.product", email: "sara.product@authors.example.com", role: "editor", bio: "طراح محصول و پژوهشگر تجربه کاربری؛ علاقه‌مند به Design System، دسترس‌پذیری و طراحی سرویس‌های پیچیده." },
  { name: "امیر کریمی", username: "amir.security", email: "amir.security@authors.example.com", role: "author", bio: "پژوهشگر امنیت سایبری با تمرکز بر امنیت وب، هویت دیجیتال، حریم خصوصی و زنجیره تأمین نرم‌افزار." },
  { name: "نیما فرهمند", username: "nima.hardware", email: "nima.hardware@authors.example.com", role: "author", bio: "روزنامه‌نگار فناوری و تحلیلگر سخت‌افزار، تراشه‌ها، رایانش لبه و صنعت نیمه‌رساناها." },
  { name: "الهام مرادی", username: "elham.startup", email: "elham.startup@authors.example.com", role: "editor", bio: "نویسنده کسب‌وکار فناوری و اکوسیستم استارتاپی با تمرکز بر محصول، بازار و روایت بنیان‌گذاران." },
];

const env = await loadEnvironment();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) throw new Error("Supabase URL or service role key is missing from .env.local.");

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listError) throw listError;
const usersByEmail = new Map(existingUsers.users.map((user) => [user.email?.toLowerCase(), user]));

let created = 0;
for (const author of authors) {
  let user = usersByEmail.get(author.email.toLowerCase());
  if (!user) {
    const password = `${randomBytes(24).toString("base64url")}Aa1!`;
    const { data, error } = await supabase.auth.admin.createUser({ email: author.email, password, email_confirm: true, user_metadata: { display_name: author.name } });
    if (error) throw error;
    user = data.user;
    created += 1;
  }
  const { error: profileError } = await supabase.from("profiles").update({ display_name: author.name, username: author.username, bio: author.bio, role: author.role, is_active: true }).eq("id", user.id);
  if (profileError) throw profileError;
}

console.log(`Seeded ${authors.length} editorial author profiles (${created} new auth users, ${authors.length - created} updated).`);
