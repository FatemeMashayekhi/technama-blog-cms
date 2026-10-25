-- Defense in depth for portfolio/demo accounts.
-- The read_only claim lives in Auth app_metadata so a browser user cannot change it.

create or replace function public.block_read_only_mutation()
returns trigger
language plpgsql
set search_path = public, auth
as $$
begin
  if coalesce((auth.jwt() -> 'app_metadata' ->> 'read_only')::boolean, false) then
    raise exception using
      errcode = '42501',
      message = 'This account has read-only access.';
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

revoke all on function public.block_read_only_mutation() from public, anon, authenticated;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'categories',
    'tags',
    'articles',
    'article_tags',
    'comments',
    'media',
    'site_settings',
    'newsletter_subscribers',
    'article_revisions'
  ]
  loop
    execute format('drop trigger if exists block_read_only_mutation on public.%I', table_name);
    execute format(
      'create trigger block_read_only_mutation before insert or update or delete on public.%I for each row execute function public.block_read_only_mutation()',
      table_name
    );
  end loop;
end;
$$;
