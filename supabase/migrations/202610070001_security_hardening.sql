-- Security hardening: keep untrusted writes behind validated, rate-limited server routes.

-- New users never become administrators implicitly. Promote the first trusted admin
-- explicitly from the Supabase SQL editor after verifying their email address.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare generated_username text;
begin
  generated_username := regexp_replace(split_part(coalesce(new.email, 'writer'), '@', 1), '[^a-zA-Z0-9._-]', '', 'g');
  if char_length(generated_username) < 3 then generated_username := 'writer'; end if;
  generated_username := generated_username || '-' || left(new.id::text, 6);
  insert into public.profiles(id, display_name, username, role)
  values(new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'نویسنده'), '@', 1)), generated_username, 'author');
  return new;
end;
$$;

-- Anonymous clients must not bypass the application's validation and abuse controls.
revoke insert on public.comments from anon, authenticated;
revoke insert on public.newsletter_subscribers from anon, authenticated;
drop policy if exists "visitors submit pending comments" on public.comments;
drop policy if exists "anyone may subscribe" on public.newsletter_subscribers;

-- The distributed limiter is an internal server primitive, not a public write API.
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
  if random() < 0.01 then
    delete from public.rate_limits where window_started < now() - interval '2 days';
  end if;
  return current_hits <= max_hits;
end;
$$;
revoke execute on function public.check_rate_limit(text, integer, integer) from anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;

-- View increments are disabled until a rate-limited aggregation endpoint exists.
revoke execute on function public.increment_article_views(uuid) from anon, authenticated;

-- Media bytes are accepted only by the server route after signature verification and
-- raster re-encoding. Direct browser uploads would bypass those checks.
drop policy if exists "staff uploads own media objects" on storage.objects;
drop policy if exists "staff updates own media objects" on storage.objects;
drop policy if exists "staff deletes own media objects" on storage.objects;

update storage.buckets
set file_size_limit = 4194304,
    allowed_mime_types = array['image/webp']
where id = 'media';

-- Query-path indexes used by moderation, tag archives, media lists and revisions.
create index if not exists comments_status_created_idx on public.comments(status, created_at desc);
create index if not exists article_tags_tag_article_idx on public.article_tags(tag_id, article_id);
create index if not exists media_owner_created_idx on public.media(owner_id, created_at desc);
create index if not exists article_revisions_article_created_idx on public.article_revisions(article_id, created_at desc);

