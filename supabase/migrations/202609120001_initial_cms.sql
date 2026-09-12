-- Technama CMS initial PostgreSQL schema, authorization rules and media bucket.
create type public.app_role as enum ('admin', 'editor', 'author');
create type public.content_status as enum ('draft', 'review', 'published', 'scheduled', 'archived');
create type public.comment_status as enum ('pending', 'approved', 'rejected', 'spam');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  username text not null unique check (username ~ '^[a-zA-Z0-9._-]{3,40}$'),
  avatar_url text,
  bio text not null default '',
  role public.app_role not null default 'author',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(), name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '', icon text not null default 'Folder', color text not null default '#176f66',
  parent_id uuid references public.categories(id) on delete set null, cover_image text, seo jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(), name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'), created_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
  excerpt text not null default '', content text not null default '', cover_url text,
  author_id uuid not null references public.profiles(id) on delete restrict,
  category_id uuid references public.categories(id) on delete set null,
  status public.content_status not null default 'draft', reading_time integer not null default 1 check (reading_time > 0),
  views bigint not null default 0 check (views >= 0), published_at timestamptz, scheduled_at timestamptz,
  seo jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index articles_status_published_idx on public.articles(status, published_at desc);
create index articles_author_idx on public.articles(author_id);
create index articles_category_idx on public.articles(category_id);

create table public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(), article_id uuid not null references public.articles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade, user_id uuid references public.profiles(id) on delete set null,
  name text not null check (char_length(name) between 2 and 80), email text not null,
  content text not null check (char_length(content) between 5 and 5000), status public.comment_status not null default 'pending',
  likes integer not null default 0 check (likes >= 0), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index comments_article_status_idx on public.comments(article_id, status, created_at desc);

create table public.media (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete restrict,
  name text not null, path text not null unique, url text not null, mime_type text not null, size bigint not null check (size > 0),
  width integer, height integer, alt_text text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(), key text not null unique, value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null, updated_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(), email text not null unique
    check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'), is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.article_revisions (
  id uuid primary key default gen_random_uuid(), article_id uuid not null references public.articles(id) on delete cascade,
  editor_id uuid not null references public.profiles(id) on delete restrict, snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create table public.rate_limits (
  key text primary key, hits integer not null default 1,
  window_started timestamptz not null default now()
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger articles_set_updated_at before update on public.articles for each row execute function public.set_updated_at();
create trigger comments_set_updated_at before update on public.comments for each row execute function public.set_updated_at();
create trigger media_set_updated_at before update on public.media for each row execute function public.set_updated_at();
create trigger settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare generated_username text; initial_role public.app_role;
begin
  perform pg_advisory_xact_lock(hashtext('technama:first-admin'));
  generated_username := regexp_replace(split_part(coalesce(new.email, 'writer'), '@', 1), '[^a-zA-Z0-9._-]', '', 'g');
  if char_length(generated_username) < 3 then generated_username := 'writer'; end if;
  generated_username := generated_username || '-' || left(new.id::text, 6);
  select case when exists(select 1 from public.profiles) then 'author'::public.app_role else 'admin'::public.app_role end into initial_role;
  insert into public.profiles(id, display_name, username, role)
  values(new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'نویسنده'), '@', 1)), generated_username, initial_role);
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.current_user_role() returns public.app_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = (select auth.uid()) and is_active = true;
$$;
revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;

create or replace function public.is_valid_public_comment_parent(target_article_id uuid, target_parent_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select target_parent_id is null or exists(
    select 1 from public.comments where id = target_parent_id and article_id = target_article_id and status = 'approved'
  );
$$;
revoke all on function public.is_valid_public_comment_parent(uuid, uuid) from public;
grant execute on function public.is_valid_public_comment_parent(uuid, uuid) to anon, authenticated;

create or replace function public.protect_profile_privileges() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role or new.is_active is distinct from old.is_active then
    if coalesce((select auth.jwt()->>'role'), '') <> 'service_role'
      and public.current_user_role() is distinct from 'admin'::public.app_role then
      raise exception 'Only administrators may change profile privileges';
    end if;
  end if;
  return new;
end;
$$;
create trigger protect_profile_privileges before update on public.profiles
for each row execute function public.protect_profile_privileges();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.articles enable row level security;
alter table public.article_tags enable row level security;
alter table public.comments enable row level security;
alter table public.media enable row level security;
alter table public.site_settings enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.article_revisions enable row level security;
alter table public.rate_limits enable row level security;

revoke all on table public.profiles, public.categories, public.tags, public.articles,
  public.article_tags, public.comments, public.media, public.site_settings,
  public.newsletter_subscribers, public.article_revisions, public.rate_limits from anon, authenticated;
grant select on public.profiles, public.categories, public.tags, public.articles, public.article_tags to anon, authenticated;
grant insert on public.comments, public.newsletter_subscribers to anon, authenticated;
grant select, insert, update, delete on public.comments, public.media, public.site_settings, public.article_revisions to authenticated;
grant insert, update, delete on public.profiles, public.categories, public.tags, public.articles, public.article_tags to authenticated;

create policy "active profiles are public" on public.profiles for select using (is_active = true or id = (select auth.uid()));
create policy "users update own profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "admins manage profiles" on public.profiles for all to authenticated using ((select public.current_user_role()) = 'admin') with check ((select public.current_user_role()) = 'admin');

create policy "categories are public" on public.categories for select using (true);
create policy "editors manage categories" on public.categories for all to authenticated using ((select public.current_user_role()) in ('admin','editor')) with check ((select public.current_user_role()) in ('admin','editor'));
create policy "tags are public" on public.tags for select using (true);
create policy "editors manage tags" on public.tags for all to authenticated using ((select public.current_user_role()) in ('admin','editor')) with check ((select public.current_user_role()) in ('admin','editor'));

create policy "published articles are public" on public.articles for select using (status = 'published' and published_at <= now());
create policy "staff read working articles" on public.articles for select to authenticated using (author_id = (select auth.uid()) or (select public.current_user_role()) in ('admin','editor'));
create policy "staff create articles" on public.articles for insert to authenticated with check ((author_id = (select auth.uid()) and status in ('draft','review')) or (select public.current_user_role()) in ('admin','editor'));
create policy "staff update articles" on public.articles for update to authenticated using (author_id = (select auth.uid()) or (select public.current_user_role()) in ('admin','editor')) with check ((author_id = (select auth.uid()) and status in ('draft','review')) or (select public.current_user_role()) in ('admin','editor'));
create policy "staff delete articles" on public.articles for delete to authenticated using (author_id = (select auth.uid()) or (select public.current_user_role()) in ('admin','editor'));
create policy "article tags follow visible articles" on public.article_tags for select using (exists(select 1 from public.articles a where a.id = article_id));
create policy "staff manage article tags" on public.article_tags for all to authenticated using (exists(select 1 from public.articles a where a.id = article_id and (a.author_id = (select auth.uid()) or (select public.current_user_role()) in ('admin','editor')))) with check (exists(select 1 from public.articles a where a.id = article_id and (a.author_id = (select auth.uid()) or (select public.current_user_role()) in ('admin','editor'))));

create policy "visitors submit pending comments" on public.comments for insert with check (
  status = 'pending' and char_length(email) <= 254
  and exists(select 1 from public.articles a where a.id = article_id and a.status = 'published' and a.published_at <= now())
  and public.is_valid_public_comment_parent(article_id, parent_id)
);
create policy "staff read comments" on public.comments for select to authenticated using (
  (select public.current_user_role()) in ('admin','editor')
  or exists(select 1 from public.articles a where a.id = article_id and a.author_id = (select auth.uid()))
);
create policy "editors moderate comments" on public.comments for update to authenticated using ((select public.current_user_role()) in ('admin','editor')) with check ((select public.current_user_role()) in ('admin','editor'));
create policy "editors delete comments" on public.comments for delete to authenticated using ((select public.current_user_role()) in ('admin','editor'));

create policy "staff read media" on public.media for select to authenticated using (owner_id = (select auth.uid()) or (select public.current_user_role()) in ('admin','editor'));
create policy "staff create media" on public.media for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "staff update media" on public.media for update to authenticated using (owner_id = (select auth.uid()) or (select public.current_user_role()) in ('admin','editor')) with check (owner_id = (select auth.uid()) or (select public.current_user_role()) in ('admin','editor'));
create policy "staff delete media" on public.media for delete to authenticated using (owner_id = (select auth.uid()) or (select public.current_user_role()) in ('admin','editor'));
create policy "admins read settings" on public.site_settings for select to authenticated using ((select public.current_user_role()) in ('admin','editor'));
create policy "admins manage settings" on public.site_settings for all to authenticated using ((select public.current_user_role()) = 'admin') with check ((select public.current_user_role()) = 'admin');
create policy "anyone may subscribe" on public.newsletter_subscribers for insert with check (is_active = true);
create policy "admins manage subscribers" on public.newsletter_subscribers for all to authenticated using ((select public.current_user_role()) = 'admin') with check ((select public.current_user_role()) = 'admin');
create policy "staff read revisions" on public.article_revisions for select to authenticated using (editor_id = (select auth.uid()) or (select public.current_user_role()) in ('admin','editor'));
create policy "staff create revisions" on public.article_revisions for insert to authenticated with check (editor_id = (select auth.uid()));

create type public.public_comment as (id uuid, parent_id uuid, name text, content text, likes integer, created_at timestamptz);
create or replace function public.get_public_comments(target_article_id uuid) returns setof public.public_comment
language sql stable security definer set search_path = public as $$
  select id, parent_id, name, content, likes, created_at from public.comments
  where article_id = target_article_id and status = 'approved'
    and exists(select 1 from public.articles a where a.id = target_article_id and a.status = 'published' and a.published_at <= now())
  order by created_at asc;
$$;
revoke all on function public.get_public_comments(uuid) from public;
grant execute on function public.get_public_comments(uuid) to anon, authenticated;

create or replace function public.increment_article_views(target_article_id uuid) returns void
language sql security definer set search_path = public as $$
  update public.articles set views = views + 1 where id = target_article_id and status = 'published' and published_at <= now();
$$;
revoke all on function public.increment_article_views(uuid) from public;
grant execute on function public.increment_article_views(uuid) to anon, authenticated;

create or replace function public.check_rate_limit(identifier text, max_hits integer, window_seconds integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare current_hits integer;
begin
  if char_length(identifier) > 160 or max_hits not between 1 and 100 or window_seconds not between 10 and 86400 then
    return false;
  end if;
  insert into public.rate_limits(key, hits, window_started) values(identifier, 1, now())
  on conflict (key) do update set
    hits = case when public.rate_limits.window_started < now() - make_interval(secs => window_seconds) then 1 else public.rate_limits.hits + 1 end,
    window_started = case when public.rate_limits.window_started < now() - make_interval(secs => window_seconds) then now() else public.rate_limits.window_started end
  returning hits into current_hits;
  return current_hits <= max_hits;
end;
$$;
revoke all on function public.check_rate_limit(text, integer, integer) from public;
grant execute on function public.check_rate_limit(text, integer, integer) to anon, authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 6291456, array['image/jpeg','image/png','image/webp','image/gif','application/pdf'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads media objects" on storage.objects for select using (bucket_id = 'media');
create policy "staff uploads own media objects" on storage.objects for insert to authenticated with check (bucket_id = 'media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "staff updates own media objects" on storage.objects for update to authenticated using (bucket_id = 'media' and (owner_id = (select auth.uid())::text or (select public.current_user_role()) in ('admin','editor')));
create policy "staff deletes own media objects" on storage.objects for delete to authenticated using (bucket_id = 'media' and (owner_id = (select auth.uid())::text or (select public.current_user_role()) in ('admin','editor')));

insert into public.categories(name, slug, description, icon, color) values
  ('هوش مصنوعی', 'artificial-intelligence', 'تحلیل و آموزش‌های مرتبط با هوش مصنوعی و یادگیری ماشین', 'Sparkles', '#176f66'),
  ('برنامه‌نویسی', 'programming', 'توسعه نرم‌افزار، معماری سیستم و ابزارهای برنامه‌نویسی', 'Code2', '#315f86'),
  ('طراحی محصول', 'product-design', 'تجربه کاربری، سیستم طراحی و فرایند طراحی محصول', 'PenTool', '#8a5c3d'),
  ('امنیت', 'cybersecurity', 'امنیت سایبری، حریم خصوصی و محافظت از زیرساخت', 'ShieldCheck', '#924c4c'),
  ('استارتاپ', 'startup', 'کسب‌وکارهای نوآور، محصول و روایت بنیان‌گذاران', 'Rocket', '#836327')
on conflict (slug) do nothing;

insert into public.tags(name, slug) values ('Next.js','nextjs'),('React','react'),('TypeScript','typescript'),('AI','ai'),('Startup','startup'),('UX','ux'),('Cybersecurity','cybersecurity'),('Frontend','frontend'),('Product','product'),('Cloud','cloud') on conflict (slug) do nothing;
